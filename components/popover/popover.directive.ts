import {
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  IPopoverRef,
  PopoverShowOptions,
} from './popover-ref';
import {
  DROPDOWN_DEFAULT_OPTIONS,
  IwPopoverOptions,
  POPOVER_DEFAULT_OPTIONS,
  PopoverShowEvent,
  TOOLTIP_DEFAULT_OPTIONS,
} from './popover.options';
import { IwPopoverService } from './popover.service';

type EllipsisOptions = {
  lines?: number;
};

type PopoverInputValue = string | TemplateRef<unknown> | Partial<IwPopoverOptions>;

interface ParsedPopoverInput {
  content: string | TemplateRef<unknown>;
  options?: Partial<IwPopoverOptions>;
}

@Directive({
  selector: '[iwPopoverOverflowContainer]',
  exportAs: 'iwPopoverOverflowContainer',
})
export class IwPopoverOverflowContainerDirective implements OnInit {
  private readonly _el = inject(ElementRef);

  private readonly _renderer = inject(Renderer2);

  ngOnInit(): void {
    this._renderer.setAttribute(
      this._el.nativeElement,
      'popover-overflow-container',
      '',
    );
  }
}

@Directive({
  selector: '[iwPopover], [iwTooltip], [iwDropdown]',
  exportAs: 'iwPopover, iwTooltip, iwDropdown',
  providers: [IwPopoverService],
  host: {
    '[style]': 'ellipsisStyles()',
  },
})
export class SynPopoverDirective implements OnInit, OnDestroy {
  @Output() public readonly hided = new EventEmitter<void>();

  @Output() public readonly showed = new EventEmitter<void>();

  @Output() public readonly isVisible = new EventEmitter<boolean>();

  public readonly iwPopover = input<PopoverInputValue>();

  public readonly iwTooltip = input<PopoverInputValue>();

  public readonly iwDropdown = input<PopoverInputValue>();

  protected readonly ellipsisStyles = computed(() => {
    const ellipsis = this._ellipsis();

    if (!ellipsis) {
      return null;
    }

    const lines = (ellipsis as EllipsisOptions).lines || 1;

    return {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      ...(lines === 1
        ? { whiteSpace: 'nowrap' }
        : {
          'display': '-webkit-box',
          '-webkit-line-clamp': lines,
          '-webkit-box-orient': 'vertical',
        }),
    };
  });

  private readonly _ellipsis = computed(() => this._options().ellipsis);

  private readonly _options = computed(() => {
    const options = this._buildOptions();

    return options;
  });

  private readonly _destroy = inject(DestroyRef);

  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private readonly _viewRef = inject(ViewContainerRef);

  private readonly _service = inject(IwPopoverService);

  private _ref: IPopoverRef | null = null;

  constructor() {
    effect(() => {
      const options = this._options();

      this._updatePopoverOptions(options);
    });
  }

  ngOnInit(): void {
    const options = this._buildOptions();

    this._ref = this._service.registerPopover(
      this._destroy,
      this._viewRef,
      options,
      this._element,
    );
    this._bindOutputEvents();
  }

  ngOnDestroy(): void {
    this._ref?.destroy();
  }

  public show(modifier?: PopoverShowOptions | PopoverShowEvent): void {
    this._ref?.show(modifier);
  }

  public hide(): void {
    this._ref?.hide();
  }

  private _updatePopoverOptions(options: Partial<IwPopoverOptions>): void {
    if (this._ref) {
      this._ref.updateOptions(options);
    }
  }

  private _buildOptions(): IwPopoverOptions {
    const { content, options } = this._parseOptions();
    const defaults = this._getDefaults();

    return {
      ...defaults,
      ...options,
      content,
    };
  }

  private _parseOptions(): ParsedPopoverInput {
    const value = this.iwPopover() || this.iwDropdown() || this.iwTooltip();

    if (value !== undefined && this._isContentValue(value)) {
      return {
        content: value as string | TemplateRef<unknown>,
        options: undefined,
      };
    }

    const optionsObj = value as Partial<IwPopoverOptions>;

    return {
      ...optionsObj,
      content: optionsObj?.content || this._getElementTextContent(),
    };
  }

  private _isContentValue(value: PopoverInputValue): boolean {
    return (
      value instanceof TemplateRef
      || (typeof value === 'string' && value !== '')
    );
  }

  private _getElementTextContent(): string {
    return this._element.textContent?.trim() || '';
  }

  private _getDefaults(): IwPopoverOptions {
    const hasTooltip = this._hasAttribute('tooltip');
    const hasDropdown = this._hasAttribute('dropdown');

    if (hasTooltip) {
      return TOOLTIP_DEFAULT_OPTIONS;
    }

    if (hasDropdown) {
      return DROPDOWN_DEFAULT_OPTIONS;
    }

    return POPOVER_DEFAULT_OPTIONS;
  }

  private _hasAttribute(type: 'tooltip' | 'dropdown'): boolean {
    const inputValue = type === 'tooltip' ? this.iwTooltip() : this.iwDropdown();

    return inputValue !== undefined;
  }

  private _bindOutputEvents(): void {
    if (!this._ref) {
      return;
    }

    this._ref.showed
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe(() => this.showed.emit());

    this._ref.hided
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe(() => this.hided.emit());

    this._ref.isVisible
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe(visible => this.isVisible.emit(visible));
  }
}
