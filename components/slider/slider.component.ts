import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { IwElementFormControlDirective, IwElementValueControlDirective } from '../control-directives';
import { Subject } from 'rxjs';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

@Component({
  selector: 'syn-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'slider',
    '[class.disabled]': 'disabled()',
    '[class.focus]': 'isFocused()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.aria-valuemin]': 'min()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-disabled]': 'disabled()',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(keydown)': 'onKeyDown($event)',
    '(focus)': 'setFocusState(true)',
    '(blur)': 'setFocusState(false)',
  },
  hostDirectives: [
    {
      directive: IwElementFormControlDirective,
      inputs: ['formControlName', 'formControl', 'errors'],
    },
    {
      directive: IwElementValueControlDirective,
      inputs: ['value'],
      outputs: ['valueChanged'],
    },
  ],
})
export class SynapseSliderComponent {
  min = input(0);

  max = input(100);

  step = input(1);

  disabled = input(false);

  changeValue = output<number>();

  value = signal(0);

  isFocused = signal(false);

  percent = computed(() => {
    const range = this.max() - this.min();
    return range <= 0 ? 0 : clamp((this.value() - this.min()) / range, 0, 1);
  });

  thumbLeft = computed(() => this.percent() * (this._trackWidth() - this._thumbWidth()));

  private readonly _thumb = viewChild.required<ElementRef<HTMLElement>>('thumb');

  private readonly _trackWidth = signal(116);

  private readonly _thumbWidth = signal(24);

  private readonly _valueChanged$ = new Subject<number>();

  private readonly _valueControl = inject(IwElementValueControlDirective<number>);

  private readonly _host = inject(ElementRef<HTMLElement>);

  constructor() {
    this._valueControl.registerEvent(this._valueChanged$);

    // Reflect the bound [value] onto the internal signal used for rendering/dragging.
    effect(() => {
      const controlValue = this._valueControl.value();

      if (controlValue !== undefined) {
        this.value.set(clamp(controlValue, this.min(), this.max()));
      }
    });

    // Track/thumb are fixed-size per the design mixin, but measuring avoids
    // a second source of truth for their pixel widths.
    afterNextRender(() => {
      this._trackWidth.set(this._host.nativeElement.offsetWidth);
      this._thumbWidth.set(this._thumb().nativeElement.offsetWidth);
    });
  }

  public setFocusState(state: boolean) {
    this.isFocused.set(state);
  }

  public onPointerDown(event: PointerEvent) {
    if (this.disabled()) return;

    this._host.nativeElement.setPointerCapture(event.pointerId);
    this._host.nativeElement.focus();
    this.setValueFromPointer(event);
  }

  public onPointerMove(event: PointerEvent) {
    if (this.disabled() || event.buttons !== 1) return;

    this.setValueFromPointer(event);
  }

  public onKeyDown(event: KeyboardEvent) {
    if (this.disabled()) return;

    if (event.key === 'Home') {
      this.setValue(this.min());
      event.preventDefault();
      return;
    }

    if (event.key === 'End') {
      this.setValue(this.max());
      event.preventDefault();
      return;
    }

    const step = this.step();
    const deltaByKey: Record<string, number> = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
    };

    const delta = deltaByKey[event.key];

    if (delta !== undefined) {
      this.setValue(this.value() + delta);
      event.preventDefault();
    }
  }

  private setValueFromPointer(event: PointerEvent) {
    const rect = this._host.nativeElement.getBoundingClientRect();
    const thumbWidth = this._thumbWidth();
    const travel = Math.max(rect.width - thumbWidth, 1);
    const offset = clamp(event.clientX - rect.left - thumbWidth / 2, 0, travel);
    const ratio = offset / travel;

    this.setValue(this.min() + ratio * (this.max() - this.min()));
  }

  private setValue(raw: number) {
    const step = this.step();
    const stepped = Math.round(raw / step) * step;
    const next = clamp(stepped, this.min(), this.max());

    if (next === this.value()) return;

    this.value.set(next);
    this.changeValue.emit(next);
    this._valueChanged$.next(next);
  }
}
