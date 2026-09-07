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

  /** Selection for a radio used on its own; inside a group the group decides. */
  checked = input(false);

  focused = output<boolean>();

  isFocused = signal(false);

  private readonly service = inject<SynapseRadioService<T> | null>(SynapseRadioService, {
    optional: true,
  });

  readonly groupName = computed(() => this.service?.groupName ?? null);

  readonly isChecked = computed(() =>
    this.service ? this.service.isSelected(this.value()) : this.checked());

  readonly isDisabled = computed(() => this.disabled() || (this.service?.disabled() ?? false));

  private readonly _radio = viewChild.required<ElementRef<HTMLInputElement>>('radio');

  /**
   * `.focus` drives the generated focus style now that only `hover` stays a
   * pseudo-state, so it is limited to keyboard focus — a mouse click on the
   * control should not light up the ring.
   */
  setFocusState(state: boolean, event?: FocusEvent) {
    this.isFocused.set(state && !!(event?.target as Element | undefined)?.matches(':focus-visible'));
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
