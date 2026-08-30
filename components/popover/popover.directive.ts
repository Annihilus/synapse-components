import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  Injector,
  Signal,
  TemplateRef,
  computed,
  createComponent,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, filter, fromEvent, merge } from 'rxjs';

import { POPOVER_DEFAULTS } from './popover.defaults';
import { SynapsePopoverPanelComponent } from './popover-panel.component';
import { computePopoverPosition } from './popover.position';
import {
  PopoverInput,
  PopoverOptions,
  PopoverVariant,
} from './popover.model';

const OVERLAY_CLASS = 'syn-popover-overlay';

function isContent(value: unknown): boolean {
  return value instanceof TemplateRef || (typeof value === 'string' && value !== '');
}

/**
 * The engine shared by the three directives, each of which contributes only an
 * options preset and a panel modifier class (see popover.defaults.ts).
 *
 * Open state is a single signal and placement a pure function,
 * `computePopoverPosition()`; no third-party positioning library is involved.
 */
@Directive({
  host: {
    '[attr.aria-expanded]': 'ariaExpanded()',
    '[attr.aria-controls]': 'ariaControls()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
  },
})
export abstract class SynapsePopoverBaseDirective {
  /** The value of the concrete directive's primary input. */
  protected abstract readonly value: Signal<PopoverInput | undefined>;

  protected abstract readonly variant: PopoverVariant;

  readonly opened = output<void>();

  readonly closed = output<void>();

  readonly openChange = output<boolean>();

  private readonly _open = signal(false);

  readonly isOpen = this._open.asReadonly();

  readonly options: Signal<PopoverOptions> = computed(() => {
    const defaults = POPOVER_DEFAULTS[this.variant];
    const value = this.value();

    if (value === undefined) return defaults;

    if (isContent(value)) {
      return { ...defaults, content: value as PopoverOptions['content'] };
    }

    return { ...defaults, ...(value as Partial<PopoverOptions>) };
  });

  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  private panelRef: ComponentRef<SynapsePopoverPanelComponent> | null = null;
  private showTimer?: ReturnType<typeof setTimeout>;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private triggerSub?: Subscription;
  private whileOpenSub?: Subscription;

  /** Id of the open panel, for a trigger that has to declare aria-controls. */
  readonly panelId = computed(() => this._open() ? this.panelRef?.instance.panelId ?? null : null);

  protected readonly ariaExpanded = computed(() =>
    this.variant === 'tooltip' ? null : String(this._open()),
  );

  protected readonly ariaControls = computed(() =>
    this.variant === 'tooltip' || !this._open() ? null : this.panelRef?.instance.panelId ?? null,
  );

  protected readonly ariaDescribedBy = computed(() =>
    this.variant === 'tooltip' && this._open() ? this.panelRef?.instance.panelId ?? null : null,
  );

  constructor() {
    // Rebuild the trigger subscription whenever trigger or disabled changes.
    effect((onCleanup) => {
      const { trigger, disabled } = this.options();

      this.triggerSub?.unsubscribe();

      if (disabled) {
        this.hide();
        return;
      }

      this.triggerSub = this.bindTriggers(trigger);
      onCleanup(() => this.triggerSub?.unsubscribe());
    });

    this.destroyRef.onDestroy(() => {
      this.clearTimers();
      this.destroyPanel();
    });
  }

  public show(): void {
    this.clearTimers();

    const { disabled, content } = this.options();

    if (disabled || this._open() || !content) return;

    this.createPanel();
    this._open.set(true);
    this.opened.emit();
    this.openChange.emit(true);
  }

  public hide(): void {
    this.clearTimers();

    if (!this._open()) return;

    this.destroyPanel();
    this._open.set(false);
    this.closed.emit();
    this.openChange.emit(false);
  }

  public toggle(): void {
    if (this._open()) {
      this.hide();
      return;
    }

    this.show();
  }

  // --- triggers -----------------------------------------------------------

  private bindTriggers(trigger: PopoverOptions['trigger']): Subscription {
    if (trigger === 'manual') return new Subscription();

    if (trigger === 'click') {
      return fromEvent<MouseEvent>(this.host, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.toggle());
    }

    // hover covers both pointer and keyboard focus, so the hint is reachable
    // by Tab and not mouse-only.
    const enter$ = merge(
      fromEvent(this.host, 'mouseenter'),
      fromEvent(this.host, 'focusin'),
    );

    const leave$ = merge(
      fromEvent(this.host, 'mouseleave'),
      fromEvent(this.host, 'focusout'),
    );

    const sub = new Subscription();

    sub.add(enter$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.showWithDelay()));
    sub.add(leave$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.hideWithDelay()));

    return sub;
  }

  private showWithDelay(): void {
    this.clearTimers();

    const { showDelay } = this.options();

    if (!showDelay) {
      this.show();
      return;
    }

    this.showTimer = setTimeout(() => this.show(), showDelay);
  }

  private hideWithDelay(): void {
    clearTimeout(this.showTimer);

    const { hideDelay } = this.options();

    if (!hideDelay) {
      this.hide();
      return;
    }

    this.hideTimer = setTimeout(() => this.hide(), hideDelay);
  }

  /** Listeners that are only needed while the panel is open. */
  private bindWhileOpen(): void {
    const sub = new Subscription();
    const panelEl = this.panelElement();

    sub.add(
      fromEvent<KeyboardEvent>(this.document, 'keydown')
        .pipe(filter(event => event.key === 'Escape'))
        .subscribe(() => this.hide()),
    );

    // A click outside both trigger and panel closes it. Captured, so that a
    // stopPropagation inside the content cannot swallow the event.
    sub.add(
      fromEvent<MouseEvent>(this.document, 'click', { capture: true })
        .pipe(filter(event => !this.containsTarget(event)))
        .subscribe(() => this.hide()),
    );

    // Ancestor scroll and resize reposition the panel rather than close it.
    sub.add(
      merge(
        fromEvent(this.document, 'scroll', { capture: true }),
        fromEvent(window, 'resize'),
      ).subscribe(() => this.position()),
    );

    // Hovering the panel cancels a pending close, or the pointer could never
    // travel from the trigger into a hover popover.
    if (panelEl && this.options().trigger === 'hover') {
      sub.add(fromEvent(panelEl, 'mouseenter').subscribe(() => this.clearTimers()));
      sub.add(fromEvent(panelEl, 'mouseleave').subscribe(() => this.hideWithDelay()));
    }

    this.whileOpenSub = sub;
  }

  private containsTarget(event: Event): boolean {
    const path = event.composedPath();
    const panelEl = this.panelElement();

    return path.includes(this.host) || (!!panelEl && path.includes(panelEl));
  }

  // --- panel --------------------------------------------------------------

  private createPanel(): void {
    const options = this.options();

    const panelRef = createComponent(SynapsePopoverPanelComponent, {
      environmentInjector: this.envInjector,
      elementInjector: this.injector,
    });

    const isTemplate = options.content instanceof TemplateRef;

    panelRef.setInput('variant', this.variant);
    panelRef.setInput('side', options.side);
    panelRef.setInput('align', options.align);
    panelRef.setInput('arrow', options.arrow);
    panelRef.setInput('role', options.role);
    panelRef.setInput('text', isTemplate ? '' : options.content);
    panelRef.setInput('template', isTemplate ? options.content : null);
    panelRef.setInput('context', options.context);

    if (options.matchTriggerWidth) {
      panelRef.setInput('minWidth', this.host.getBoundingClientRect().width);
    }

    this.appRef.attachView(panelRef.hostView);
    this.overlayContainer().appendChild(panelRef.location.nativeElement);

    if (options.panelClass) {
      (panelRef.location.nativeElement as HTMLElement).classList.add(options.panelClass);
    }

    this.panelRef = panelRef;

    // Render hidden to measure the real size, then position.
    panelRef.changeDetectorRef.detectChanges();
    this.position();

    this.bindWhileOpen();
  }

  private position(): void {
    const panelRef = this.panelRef;
    const panelEl = this.panelElement();

    if (!panelRef || !panelEl) return;

    const options = this.options();
    const triggerRect = this.host.getBoundingClientRect();
    const panelRect = panelEl.getBoundingClientRect();

    const result = computePopoverPosition({
      trigger: triggerRect,
      panel: { width: panelRect.width, height: panelRect.height },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      side: options.side,
      align: options.align,
      offset: options.offset,
      viewportPadding: options.viewportPadding,
    });

    panelRef.setInput('top', result.top);
    panelRef.setInput('left', result.left);
    panelRef.setInput('side', result.side);
    panelRef.setInput('positioned', true);
    panelRef.changeDetectorRef.detectChanges();
  }

  private destroyPanel(): void {
    this.whileOpenSub?.unsubscribe();
    this.whileOpenSub = undefined;

    if (!this.panelRef) return;

    this.appRef.detachView(this.panelRef.hostView);
    this.panelRef.destroy();
    this.panelRef = null;
  }

  private panelElement(): HTMLElement | null {
    return (this.panelRef?.location.nativeElement as HTMLElement) ?? null;
  }

  private overlayContainer(): HTMLElement {
    const existing = this.document.querySelector(`.${OVERLAY_CLASS}`);

    if (existing) return existing as HTMLElement;

    const container = this.document.createElement('div');
    container.className = OVERLAY_CLASS;
    this.document.body.appendChild(container);

    return container;
  }

  private clearTimers(): void {
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);
  }
}

@Directive({
  selector: '[synPopover]',
  exportAs: 'synPopover',
})
export class SynapsePopoverDirective extends SynapsePopoverBaseDirective {
  readonly synPopover = input<PopoverInput>();

  protected readonly value = this.synPopover;
  protected readonly variant = 'popover' as const;
}

@Directive({
  selector: '[synTooltip]',
  exportAs: 'synTooltip',
})
export class SynapseTooltipDirective extends SynapsePopoverBaseDirective {
  readonly synTooltip = input<PopoverInput>();

  protected readonly value = this.synTooltip;
  protected readonly variant = 'tooltip' as const;
}

@Directive({
  selector: '[synDropdown]',
  exportAs: 'synDropdown',
})
export class SynapseDropdownDirective extends SynapsePopoverBaseDirective {
  readonly synDropdown = input<PopoverInput>();

  protected readonly value = this.synDropdown;
  protected readonly variant = 'dropdown' as const;
}
