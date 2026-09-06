import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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

import { SynapseControlDirective } from '../control-directives';

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
    '[class.focus]': 'isFocused()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.aria-valuemin]': 'min()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-disabled]': 'disabled()',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerUp($event)',
    '(pointercancel)': 'onPointerUp($event)',
    '(keydown)': 'onKeyDown($event)',
    '(focus)': 'setFocusState(true)',
    '(blur)': 'setFocusState(false)',
  },
  hostDirectives: [
    {
      directive: SynapseControlDirective,
      inputs: ['value', 'disabled'],
      outputs: ['valueChanged'],
    },
  ],
})
export class SynapseSliderComponent {
  private readonly control = inject(SynapseControlDirective<number>);

  min = input(0);

  max = input(100);

  step = input(1);

  readonly disabled = this.control.disabled;

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

  private readonly _host = inject(ElementRef<HTMLElement>);

  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const bound = this.control.current();

      if (bound !== undefined && bound !== null) {
        this.value.set(clamp(bound, this.min(), this.max()));
      }
    });

    afterNextRender(() => {
      const host = this._host.nativeElement;

      this._measure();

      if (typeof ResizeObserver === 'undefined') return;

      const observer = new ResizeObserver(() => this._measure());
      observer.observe(host);

      this._destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  private _measure() {
    this._trackWidth.set(this._host.nativeElement.offsetWidth);
    this._thumbWidth.set(this._thumb().nativeElement.offsetWidth);
  }

  public setFocusState(state: boolean) {
    this.isFocused.set(state);

    if (!state) {
      this.control.markTouched();
    }
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

  public onPointerUp(event: PointerEvent) {
    const host = this._host.nativeElement;

    if (host.hasPointerCapture(event.pointerId)) {
      host.releasePointerCapture(event.pointerId);
    }
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
    this.control.setValue(next);
  }
}
