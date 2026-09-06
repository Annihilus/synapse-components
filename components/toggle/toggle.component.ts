import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { SynapseControlDirective } from '../control-directives';

@Component({
  selector: 'syn-toggle, label[syn-toggle]',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.checked]': 'isChecked()',
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
export class SynapseToggleComponent {
  /** The only accessible name: the mixin fixes the host width, leaving no room. */
  description = input('');

  changeValue = output<boolean>();

  isFocused = signal(false);

  private readonly control = inject(SynapseControlDirective<boolean>);

  readonly disabled = this.control.disabled;

  readonly isChecked = computed(() => !!this.control.current());

  private readonly _checkbox = viewChild.required<ElementRef<HTMLInputElement>>('checkbox');

  setFocusState(state: boolean) {
    this.isFocused.set(state);
  }

  setCheckedState(event: Event) {
    const target = event.target as HTMLInputElement;

    this.control.setValue(target.checked);
    this.changeValue.emit(target.checked);
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
