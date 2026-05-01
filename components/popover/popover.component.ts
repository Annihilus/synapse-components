import { CommonModule } from '@angular/common';
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  inject,
  Input,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  Instance,
  Placement,
  Rect,
  State,
} from '@popperjs/core';
import {
  BehaviorSubject,
  map,
  Observable,
} from 'rxjs';

export type PopoverContext = {
  [key in string]?: unknown
};

export interface IAnimationParams {
  x?: number;
  y?: number;
  offsetY?: number;
  offsetX?: number;
  opacity?: number;
  scale?: number;
  showSpeed?: number;
  hideSpeed?: number;
}

export type MaxSizes = {
  width: {
    before: number;
    after: number;
  };

  height: {
    before: number;
    after: number;
  };
};

// TODO
// Forming transform params outside of angular animations to avoid extra rendering

@Component({
  selector: 'iw-popover-content',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IwPopoverContentComponent implements AfterContentChecked {
  @Input() public maxSizes?: MaxSizes;

  @Input() public animations: string[] = [];

  @Input() public noStyles = false;

  @Input() public dropdown = false;

  @Input() public tooltip = false;

  @Input() public arrow = false;

  @Input() public template?: TemplateRef<unknown>;

  @Input() public text = '';

  @Input() public zIndex = 10_000;

  @Input() public popoverStyle: Record<string, any> | null = null;

  @Input() set context(context: PopoverContext) {
    this._context = {
      waitData: this._waitData,
      ...context,
    };

    // Тригаем перерисовку только если компонент видим юзеру
    if (this._isShowed) {
      this._cdr.detectChanges();
    }
  }

  get context() {
    return this._context;
  }

  @ViewChild('arrow', { static: false }) public arrowEl?: ElementRef<HTMLElement>;

  @ViewChild('contentEl', { static: false }) public contentEl?: ElementRef<HTMLElement>;

  @ViewChild('popoverEl', { static: false }) public popoverEl?: ElementRef<HTMLElement>;

  @ViewChild('popoverContent', { static: true }) protected popoverContent?: ElementRef<HTMLElement>;

  @HostBinding('class.iw-popover-content') public class = true;

  @HostBinding('attr.role') public 'popover': unknown;

  @HostBinding('attr.aria-hidden') public 'true': unknown;

  public readonly isReady$: Observable<boolean>;

  public params: IAnimationParams = {};

  private readonly _waitData = new BehaviorSubject(false);

  private _context!: PopoverContext;

  private _isShowed = false;

  private _popperInstance?: Instance;

  private _animationState = 'hide';

  private _popper: Partial<State> | null = null;

  private _height = 0;

  private _hideCallback: null | (() => void) = null;

  private readonly _element: HTMLElement;

  private readonly _renderer = inject(Renderer2);
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _elem = inject(ElementRef);
  constructor() {
    this._element = this._elem.nativeElement;
    this.isReady$ = this._waitData.pipe(map(wait => !wait));
  }

  public ngAfterContentChecked() {
    const { height } = this._element.getBoundingClientRect();

    if (height !== this._height) {
      this._popperInstance
        ?.update()
        .catch();

      this._height = height;
    }
  }

  public getRect() {
    return this._element.getBoundingClientRect() as Rect;
  }

  public setHidden() {
    this._renderer.setStyle(this._element, 'position', 'absolute');
    this._renderer.setStyle(this._element, 'visibility', 'hidden');
  }

  public setVisible() {
    this._renderer.setStyle(this._element, 'position', 'static');
    this._renderer.setStyle(this._element, 'visibility', 'visible');
  }

  /* eslint complexity: ["error", 19] */
  public setScaleAnimationParams(popper: Partial<State>) {
    const placement = popper.placement as Placement;
    const refRects = popper.rects?.reference;
    const params = popper.elements?.popper.getBoundingClientRect();

    const isHorizontal = placement.includes('top') || placement.includes('bottom');
    const isVertical = placement.includes('right') || placement.includes('left');
    let offsetY = 0;
    let offsetX = 0;

    if (isHorizontal && params) {
      offsetY = params.height / 2;

      if (placement.includes('bottom')) {
        offsetY = -offsetY;
      }

      if (placement.includes('start') && refRects) {
        offsetX = -(params.width / 2 - refRects.width / 2);
      }

      if (placement.includes('end') && refRects) {
        offsetX = params.width / 2 - refRects.width / 2;
      }
    }

    if (isVertical && params) {
      offsetX = params.width / 2;

      if (placement.includes('right')) {
        offsetX = -offsetX;
      }

      if (placement.includes('start') && refRects) {
        offsetY = -(params.height / 2 - refRects.height / 2);
      }

      if (placement.includes('end') && refRects) {
        offsetY = params.height / 2 - refRects.height / 2;
      }
    }

    this.params.offsetY = Math.floor(offsetY);
    this.params.offsetX = Math.floor(offsetX);

    this.params.scale = 0;
  }

  public update(popper: Partial<State>) {
    this._popper = popper;
  }

  public calcAnimation(popper: Partial<State>) {
    const popperElem = popper.elements?.popper;
    // Popper using top: auto if popover position is top
    // In this reason transform position is relative to bottom of the page
    // Because of this we using real CSSTransform params

    if (popperElem) {
      const transform = window
        .getComputedStyle(popperElem)
        .getPropertyValue('transform')
        .match(/(-?[\d.]+)/g)
        ?.slice(4);

      if (transform) {
        this.params.x = parseInt(transform[0], 10);
        this.params.y = parseInt(transform[1], 10);
      }
    }
  }

  public show(popper: Partial<State>, popperInstance: Instance) {
    this._popper = popper;
    const popperElem = popper?.elements?.popper;
    this._hideCallback = null;

    if (!popper || !popperElem) {
      return;
    }

    this._popperInstance = popperInstance;

    this.calcAnimation(popper);

    this._setSizeLimits(popper.placement);

    if (this.animations.includes('scale') && popper.rects?.reference) {
      this.setScaleAnimationParams(popper);
    }

    this.params.opacity = this.animations.includes('fade') ? 0 : 1;

    this._renderer.setStyle(this._element, 'z-index', this.zIndex);
  }

  public hide(callback: () => void): void {
    callback();
    this.setHidden();
  }

  private _setSizeLimits(placement?: Placement) {
    if (!this.maxSizes) return;

    const elem = this.popoverContent?.nativeElement;
    const { width, height } = this.maxSizes;
    const gap = 8;

    if (placement?.includes('top')) {
      this._renderer.setStyle(elem, 'max-height', `${height.before - gap}px`);
    } else if (placement?.includes('bottom')) {
      this._renderer.setStyle(elem, 'max-height', `${height.after - gap}px`);
      this._renderer.setStyle(elem, 'min-height', 'min-content');
    } else {
      const maxWidth = Math.max(width.before, width.after);
      this._renderer.setStyle(elem, 'max-width', `${maxWidth - gap}px`);
    }
  }
}
