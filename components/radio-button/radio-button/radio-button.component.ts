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

import { SynapseRadioService } from '../radio.service';

@Component({
  selector: 'syn-radio-button, label[syn-radio-button]',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'syn-radio-button',
    '[class.disabled]': 'isDisabled()',
    '[class.checked]': 'isChecked()',
    '[class.focus]': 'isFocused()',
    '(click)': 'onHostClick($event)',
  },
})
export class SynapseRadioButtonComponent<T = unknown> {
  value = input.required<T>();

  disabled = input(false);

  focused = output<boolean>();

  isFocused = signal(false);

  private readonly service = inject<SynapseRadioService<T> | null>(SynapseRadioService, {
    optional: true,
  });

  readonly groupName = computed(() => this.service?.groupName ?? null);

  readonly isChecked = computed(() => this.service?.isSelected(this.value()) ?? false);

  readonly isDisabled = computed(() => this.disabled() || (this.service?.disabled() ?? false));

  private readonly _radio = viewChild.required<ElementRef<HTMLInputElement>>('radio');

  setFocusState(state: boolean) {
    this.isFocused.set(state);
    this.focused.emit(state);
  }

  onSelect() {
    this.service?.select(this.value());
  }

  /** Clicks from the input itself are skipped: forwarding them loops. */
  onHostClick(event: Event) {
    if (this.isDisabled()) return;

    const radio = this._radio().nativeElement;

    if (event.target === radio) return;

    radio.click();
  }
}
