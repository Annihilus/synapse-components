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
    // Local state, so a user toggle clears it without fighting the input.
    effect(() => this.isIndeterminate.set(this.indeterminate()));
  }

  setFocusState(state: boolean) {
    this.isFocused.set(state);
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

  /**
   * The native checkbox is visually hidden, so pointer events land on the host
   * (box / icon). Forward them to the checkbox — ignoring clicks that already
   * originated from the input itself, which would double-toggle.
   */
  onHostClick(event: Event) {
    if (this.disabled()) return;

    const checkbox = this._checkbox().nativeElement;

    if (event.target === checkbox) return;

    checkbox.click();
  }
}
