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

  /** Null outside a group: the input stays ungrouped instead of crashing. */
  readonly groupName = computed(() => this.service?.groupName ?? null);

  readonly isChecked = computed(() => this.service?.isSelected(this.value()) ?? false);

  readonly isDisabled = computed(() => this.disabled() || (this.service?.disabled() ?? false));

  private readonly _radio = viewChild.required<ElementRef<HTMLInputElement>>('radio');

  setFocusState(state: boolean) {
    this.isFocused.set(state);
    this.focused.emit(state);
  }

  /** Fires for a click and for arrow-key navigation between native radios. */
  onSelect() {
    this.service?.select(this.value());
  }

  /**
   * The native radio is visually hidden, so pointer events land on the host
   * (the visual circle). Forward them to the input — ignoring clicks that
   * already originated from it.
   */
  onHostClick(event: Event) {
    if (this.isDisabled()) return;

    const radio = this._radio().nativeElement;

    if (event.target === radio) return;

    radio.click();
  }
}
