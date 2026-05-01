import {
  ComponentRef,
  DestroyRef,
  EventEmitter,
  InputSignal,
  InputSignalWithTransform,
  OutputRef,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  createPopper,
  Instance,
  Modifier,
  VirtualElement,
} from '@popperjs/core';
import {
  BehaviorSubject,
  debounceTime,
  defer,
  EMPTY,
  filter,
  finalize,
  fromEvent,
  merge,
  Observable,
  share,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
  throttle,
  timer,
} from 'rxjs';

import {
  IwPopoverContentComponent,
  MaxSizes,
  PopoverContext,
} from './popover.component';
import {
  IwPopoverOptions,
  POPOVER_DEFAULT_OPTIONS,
  PopoverHideStream,
  PopoverShowStream,
  PopoverTriggers,
} from './popover.options';
import { Keys } from '../helpers/set-inputs';

export type ComponentInputs<C> = {
  [K in Keys<C, any, OutputRef<unknown>>]?: InputValue<C[K]>;
};

type InputValue<T> =
  T extends OutputRef<unknown> ? never
    : T extends (Input<infer V> | undefined) ? V
      : T;

type Input<V> = InputSignal<V> | InputSignalWithTransform<any, V>;

export const setInputs = <C>(ref: ComponentRef<C>, inputs: ComponentInputs<C>) => {
  Object.entries(inputs).forEach(([key, value]) => ref.setInput(key, value));
  ref.changeDetectorRef.detectChanges();
};


export type PopoverShowOptions = {
  context?: PopoverContext;
  event?: MouseEvent;
  element?: HTMLElement;
  modifiers?: Partial<Modifier<string, Partial<unknown>>>[];
};

type PopoverShowEvent = {
  x: number;
  y: number;
  context?: PopoverContext;
};

export interface IPopoverRef {
  showed: EventEmitter<void>;
  hided: EventEmitter<void>;
  isVisible: EventEmitter<boolean>;
  show: (event?: PopoverShowOptions | PopoverShowEvent) => void;
  hide: () => void;
  destroy: () => void;
  updateOptions: (options: Partial<IwPopoverOptions>) => void;
  isOpened: boolean;
}

export class IwPopoverRef implements IPopoverRef {
  public readonly showed = new EventEmitter<void>();

  public readonly hided = new EventEmitter<void>();

  public readonly isVisible = new EventEmitter<boolean>();

  public isOpened = false;

  private readonly _isShowing = new BehaviorSubject(false);

  private readonly _isHidding = new BehaviorSubject(false);

  private _showEvent?: { x: number; y: number };

  private _currentEvent: MouseEvent | null = null;

  private readonly _open$ = new Subject<any | undefined>();

  private _component?: ComponentRef<IwPopoverContentComponent>;

  private _streamSubscription?: Subscription;

  private readonly _mouseenterStream?: Subscription;

  private readonly _mouseleaveStream?: Subscription;

  private _popperInstance?: Instance;

  private _virtualElement!: VirtualElement;

  private _options: IwPopoverOptions;

  private readonly _hidden$ = new Subject();

  constructor(
    private readonly _element: HTMLElement | undefined,
    _initialOptions: Partial<IwPopoverOptions> | undefined,
    private readonly _renderer: Renderer2,
    private readonly _viewContainerRef: ViewContainerRef,
    private readonly _destroy: DestroyRef,
  ) {
    this._options = { ...POPOVER_DEFAULT_OPTIONS, ..._initialOptions };
    this._setupTriggers();
  }

  public updateOptions(options: Partial<IwPopoverOptions>) {
    const triggersChanged = this._optionIsChanged('triggers', options);
    const contextChanged = this._optionIsChanged('context', options);
    this._options = { ...this._options, ...options };

    // On trigger update recreate triggers subscription
    if (triggersChanged) {
      this._setupTriggers();
    }

    // Context update inside created component
    if (this._component && contextChanged) {
      this._options = { ...this._options, ...options };
      this._component.instance.context = {
        ...this._component.instance.context,
        ...options.context,
      };
    }

    // Hide if disabled state become truly
    if (options.disabled) {
      this.hide();
    }
  }

  public destroy() {
    this._unsubscribeAll();
    this._destroyPopover();
    this._teardownTriggers();
  }

  public show(event?: PopoverShowOptions | PopoverShowEvent) {
    if (this._options.disabled) {
      return;
    }

    if (event && 'modifiers' in event && event.modifiers) {
      this._options.modifiers = event.modifiers;
    }

    if (this.isOpened || this._options.content === '') {
      return;
    }

    if (event && 'event' in event) {
      this._open$.next(event.event);
    } else {
      this._open$.next(event);
    }
  }

  public hide() {
    if (!this.isOpened) {
      return;
    }

    this.isOpened = false;

    this._unsubscribeAll();

    // Reseting event
    this._currentEvent = null;

    // Calling hide method of popover component
    this._component?.instance.hide(() => {
      this._destroyPopover();

      this.hided.emit();
      this.isVisible.next(false);
    });
  }

  private _setupTriggers() {
    const { activateStream$, deactivateStream$ } = this._parseTriggers(this._options.triggers);

    this._teardownTriggers();

    // Стрим показа, фильтруется в тех случаях когда:
    // - Поповер еще не показан;
    // - Поповер не находится в состоянии исчезновения(нужен для того чтобы прервать исчезновение);
    // - Поповер уже находится на стадии показа;
    // - Поповер не находится в состоянии disabled
    const activate$ = activateStream$.pipe(
      filter(() => !this.isOpened && !this._isShowing.value && !this._options.disabled),
    );

    // Стрим исчезновения поповера;
    // Фильтруется в тех случаях когда уже находится в процессе исчезновения;
    // Работает с выставленной задержкой и сбрасывается если снова был инициирован показ;
    let hideStream$: Observable<number>;

    // Основной стрим
    const popoverStream$ = activate$.pipe(
      switchMap(event => {
        // Создаем деактивационные стримы после того как поповер был взведен.
        // Необходимо для того чтобы не дергать лишний раз для всех поповеров на странице,
        // а также для тех случаях где в дом дереве могут происходить сайдэффекты до появления поповера
        const deactivate$ = deactivateStream$.pipe(
          tap(() => this._isShowing.next(false)),
          takeUntil(this._hidden$),
        );

        this._isShowing.next(true);
        this._showEvent = event;

        hideStream$ = this._createHideStream(activate$, deactivate$);

        const context = event && 'context' in event ? event.context : undefined;
        const showDelay = event instanceof MouseEvent ? this._options.showDelay : 0;

        return timer(showDelay).pipe(
          switchMap(() => {
            this._isShowing.next(false);

            const componentRef = this._createPopoverContent(context);

            if (this._element) {
              this._renderer.setStyle(this._element, 'cursor', 'wait');
            }

            return componentRef.instance.isReady$;
          }),
          // Ждем пока данные загрузятся;
          filter(Boolean),
          tap(() => {
            this._createPopover(this._showEvent);
            this.isOpened = true;

            if (this._element) {
              this._renderer.removeStyle(this._element, 'cursor');
            }
          }),
          // Удаляем компонент поповера если стрим был прерван до завершения
          tap({
            unsubscribe: () => {
              if (!this.isOpened) {
                this._destroyPopover();
              }
            },
          }),
          // Прерывает показ поповера в случае если приходит событие из стрима деактивации
          takeUntil(deactivate$),
        );
      }),
      switchMap(() => hideStream$),
    );

    this._streamSubscription = popoverStream$
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe(() => this.hide());
  }

  private _getDeactivateStreams(activate: string[], triggers: string[], element: HTMLElement): PopoverHideStream {
    const triggers$ = triggers.map(trigger => {
      if (trigger === 'mouseleave' || trigger === 'mouseout') {
        const mouseLeave$ = fromEvent<MouseEvent>(element, trigger).pipe(
          filter(() => !this._containsPopoverElements(this._currentEvent)),
        );

        const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(
          tap(event => {
            if (this._options.followCursor && this._popperInstance) {
              this._virtualElement.getBoundingClientRect = this._generateGetBoundingClientRect(
                event.clientX,
                event.clientY,
              );

              this._popperInstance
                .update()
                .catch(error => console.error(error));
            }

            this._currentEvent = event;
          }),
          filter(() => !this._containsPopoverElements(this._currentEvent)),
        );

        return merge(mouseMove$, mouseLeave$);
      }

      if (trigger === 'click') {
        return fromEvent<MouseEvent>(document, trigger).pipe(
          filter(event => {
            const elem = this._component?.instance.popoverEl?.nativeElement;

            // This required for hiding popover when we clicked second time on popover trigger
            if (!activate.includes('click')) {
              this._currentEvent = event;
            }

            return event !== this._showEvent && !this._eventInsideElement(event, elem);
          }),
        );
      }

      return fromEvent<MouseEvent>(element, trigger);
    });

    return defer(() => merge(
      ...triggers$,
      this._createScrollingObserver(),
    ));
  }

  private _parseTriggers(triggers: PopoverTriggers): {
    activateStream$: PopoverShowStream;
    deactivateStream$: PopoverHideStream;
  } {
    if (typeof triggers !== 'string') {
      const [activateStream$, deactivateStream$] = triggers;

      return { activateStream$, deactivateStream$ };
    }

    // Otherwise, triggers is a string. We parse it:
    const activateTriggers: string[] = [];
    const deactivateTriggers: string[] = [];

    if (this._element) {
      const triggerPairs = triggers.trim().split(/\s+/);
      triggerPairs.forEach(pair => {
        const [showTrigger, hideTrigger] = pair.split(':');
        activateTriggers.push(showTrigger);
        deactivateTriggers.push(hideTrigger);
      });

      return {
        activateStream$: this._getActivateStreams(activateTriggers, this._element),
        deactivateStream$: this._getDeactivateStreams(
          activateTriggers,
          deactivateTriggers,
          this._element,
        ),
      };
    }

    return {
      activateStream$: EMPTY,
      deactivateStream$: EMPTY,
    };
  }

  private _getActivateStreams(triggers: string[], element: HTMLElement): PopoverShowStream {
    const triggers$ = triggers
      .map(trigger => fromEvent<MouseEvent>(element, trigger));

    return merge(...triggers$, this._open$);
  }

  private _createHideStream(activate$: Observable<Event | any | undefined>, deactivate$: Observable<Event>) {
    return deactivate$.pipe(
      filter(() => !this._isHidding.value && this.isOpened),
      tap(() => this._isHidding.next(true)),
      switchMap(() => timer(this._options.hideDelay).pipe(
        filter(() => this._isOutsidePopoverElements()),
        finalize(() => this._isHidding.next(false)),
        takeUntil(activate$),
      )),
    );
  }

  private _createPopoverContent(context?: PopoverContext) {
    if (this._component) return this._component;

    const componentRef = this._viewContainerRef.createComponent(IwPopoverContentComponent, {
      index: 0,
    });

    componentRef.instance.setHidden();

    const inputs: ComponentInputs<IwPopoverContentComponent> = {
      arrow: this._options.arrow,
      noStyles: this._options.noStyles,
      dropdown: this._options.dropdown,
      popoverStyle: this._options.popoverStyle,
      animations: this._options.animations,
      zIndex: this._options.zIndex,
      maxSizes: this._calcMaxSizes(),
    };

    if (typeof this._options.content === 'string') {
      inputs.text = this._options.content;
      inputs.tooltip = true;
    } else {
      inputs.template = this._options.content;
      inputs.context = context || this._options.context || {};
    }

    setInputs(componentRef, inputs);

    if (this._options.container === 'body') {
      const body = window.document.querySelector('body');
      body?.appendChild(componentRef.location.nativeElement);
    }

    this._component = componentRef;

    return componentRef;
  }

  private _createPopover(event?: MouseEvent | { x: number; y: number }) {
    if (!this._component) return;

    const modifiers = this._getModifiers();

    this._component.instance.setVisible();

    if (event) {
      const x = 'clientX' in event ? event.clientX : event.x;
      const y = 'clientY' in event ? event.clientY : event.y;

      this._virtualElement = {
        getBoundingClientRect: this._generateGetBoundingClientRect(x, y),
      };
    }

    const isDirectEvent = event != null && !(event instanceof MouseEvent);

    const element = this._options.followCursor || !this._element || isDirectEvent
      ? this._virtualElement
      : this._element;

    // if (this._options.widthMinLimit) {
      this._setWidthLimit('min');
    // }

    if (this._options.widthMaxLimit) {
      this._setWidthLimit('max');
    }

    const contentElement = this._component.location.nativeElement as HTMLElement;
    const component = this._component.instance;

    this._popperInstance = createPopper(
      element,
      contentElement,
      {
        placement: this._options.placement,
        modifiers: [
          ...modifiers,
          {
            name: 'updateCallback',
            enabled: true,
            phase: 'afterWrite',
            fn: ({ state }) => {
              component.update(state);
            },
          },
        ],
        onFirstUpdate: popper => {
          if (this._component && this._popperInstance) {
            this._component.instance.show(popper, this._popperInstance);
          }
        },
      },
    );

    this.showed.emit();
    this.isVisible.next(true);
    this.isOpened = true;
  }

  private _eventInsideElement(event: MouseEvent, element?: HTMLElement) {
    if (!element) {
      return false;
    }

    return insideElementRect(event, element) || this._isInsideElement(event, element);
  }

  private _destroyPopover() {
    this._popperInstance?.destroy();
    this._component?.destroy();
    this._component = undefined;
  }

  private _containsPopoverElements(event: MouseEvent | Event | null) {
    if (!event) {
      return true;
    }

    const insideTrigger = this._isInsideElement(event, this._element);
    const insideContent = this._isInsideElement(event, this._component?.instance.popoverEl?.nativeElement);

    const inside = this._options.followCursor
      ? insideTrigger
      : insideTrigger || insideContent;

    return inside;
  }

  private _isInsideElement(event: MouseEvent | Event, element?: HTMLElement): boolean {
    const path = event.composedPath() || [];

    return element ? path.includes(element) : false;
  }

  private _calcMaxSizes() {
    if (!this._element) return;

    const rect = this._element.getBoundingClientRect();

    const maxSizes: MaxSizes = {
      width: {
        before: rect.left,
        after: window.innerWidth - rect.right,
      },

      height: {
        before: rect.top,
        after: window.innerHeight - rect.bottom,
      },
    };

    return maxSizes;
  }

  private _getModifiers() {
    const defaultModifiers: Partial<Modifier<string, Partial<unknown>>>[] = [
      {
        name: 'preventOverflow',
        options: {
          padding: 10,
          boundary: document.querySelector('body'),
        },
      },
      {
        name: 'computeStyles',
        options: {
          adaptive: false,
        },
      },
      {
        name: 'arrow',
        enabled: this._options.arrow,
        options: {
          element: this._component?.instance.arrowEl?.nativeElement,
        },
      },
      {
        name: 'offset',
        enabled: this._options.arrow,
        options: {
          offset: [0, 4],
        },
      },
    ];

    // Merge default modifiers with custom modifiers if exists
    let modifiers: Partial<Modifier<any, any>>[] = defaultModifiers;

    if (this._options.modifiers.length > 0) {
      const defaultProps = defaultModifiers.map(prop => prop.name);
      const modifiedProps = [...this._options.modifiers].map(prop => prop.name);

      defaultProps.forEach((prop, index) => {
        if (prop && modifiedProps.includes(prop)) {
          defaultModifiers.splice(index, 1);
        }
      });

      modifiers = [...defaultModifiers, ...this._options.modifiers];
    }

    return modifiers;
  }

  private _setWidthLimit(limit: 'min' | 'max') {
    if (this._component && this._element) {
      this._renderer.setStyle(
        this._component.location.nativeElement,
        `${limit}-width`,
        `${this._element.offsetWidth}px`,
      );
    }
  }

  private _generateGetBoundingClientRect(x = 0, y = 0): () => DOMRect {
    return (): DOMRect => ({
      width: 0,
      height: 0,
      top: y,
      right: x,
      bottom: y,
      left: x,
      x,
      y,
      toJSON: () => {},
    });
  }

  private _unsubscribeAll() {
    this._unsubscribeFromMouseStream();
    this._hidden$.next(true);
  }

  private _unsubscribeFromMouseStream() {
    if (this._mouseenterStream) {
      this._mouseenterStream.unsubscribe();
    }

    if (this._mouseleaveStream) {
      this._mouseleaveStream.unsubscribe();
    }
  }

  private _teardownTriggers() {
    if (this._streamSubscription) {
      this._streamSubscription.unsubscribe();
    }
  }

  private _createScrollingObserver() {
    if (!this._element) {
      return EMPTY;
    }

    const container = this._element.closest('[popover-overflow-container]');
    if (!container) return EMPTY;

    const scrollSource$ = fromEvent(container, 'scroll', { capture: true }).pipe(
      filter(event => {
        const target = event.target as Node;
        const contains = target.contains(this._element || null);

        return this._isOutsidePopoverElements() && contains;
      }),
    );

    const debounced$ = scrollSource$.pipe(debounceTime(Math.max(50, this._options.hideDelay)), share());

    return merge(
      scrollSource$.pipe(throttle(() => debounced$)),
      debounced$,
    );
  }

  private _isOutsidePopoverElements() {
    if (!this._currentEvent) {
      return true;
    }

    const insideTrigger = this._element && insideElementRect(this._currentEvent, this._element);
    const insidePopover = this._eventInsideElement(this._currentEvent, this._component?.instance.contentEl?.nativeElement);

    const inside = this._options.followCursor
      ? insideTrigger
      : insideTrigger || insidePopover;

    return !inside;
  }

  private _optionIsChanged(key: keyof IwPopoverOptions, options: Partial<IwPopoverOptions>): boolean {
    return this._options[key] !== options[key];
  }
}

function insideElementRect(event: MouseEvent, element: HTMLElement) {
  const elem = element.getBoundingClientRect();

  const insideHorizontal = elem.left <= event.x && event.x <= elem.right;
  const insideVertical = elem.top <= event.y && event.y <= elem.bottom;

  return insideHorizontal && insideVertical;
}
