import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { SynapseIconComponent } from '../icon/icon.component';
import { SynapseControlDirective } from '../control-directives';

@Component({
  selector: 'syn-checkbox, label[syn-checkbox]',
  imports: [SynapseIconComponent],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.checked]': 'isChecked()',
    '[class.indeterminate]': 'isIndeterminate()',
    '[class.focus]': 'isFocused()',
    '(click)': 'onHostClick($event)',
  },
  hostDirectives: [
    {
      directive: SynapseControlDirective,
      inputs: ['value', 'disabled'],
      outputs: ['valueChanged'],
    },
  ],
})
export class SynapseCheckboxComponent {
  indeterminate = input(false);

  changeChecked = output<boolean>();

  isIndeterminate = signal(false);

  isFocused = signal(false);

  private readonly control = inject(SynapseControlDirective<boolean>);

  readonly disabled = this.control.disabled;

  readonly isChecked = computed(() => !!this.control.current());

  private readonly _checkbox = viewChild.required<ElementRef<HTMLInputElement>>('checkbox');

  constructor() {
    effect(() => this.isIndeterminate.set(this.indeterminate()));
  }

  /**
   * `.focus` drives the generated focus style now that only `hover` stays a
   * pseudo-state, so it is limited to keyboard focus — a mouse click on the
   * control should not light up the ring.
   */
  setFocusState(state: boolean, event?: FocusEvent) {
    this.isFocused.set(state && !!(event?.target as Element | undefined)?.matches(':focus-visible'));
  }

  setCheckedState(event: Event) {
    const target = event.target as HTMLInputElement;

    this.isIndeterminate.set(false);
    this.control.setValue(target.checked);
    this.changeChecked.emit(target.checked);
  }

  onBlur() {
    this.setFocusState(false);
    this.control.markTouched();
  }

  /** Clicks from the input itself are skipped: forwarding them double-toggles. */
  onHostClick(event: Event) {
    if (this.disabled()) return;

    const checkbox = this._checkbox().nativeElement;

    if (event.target === checkbox) return;

    checkbox.click();
  }
}
