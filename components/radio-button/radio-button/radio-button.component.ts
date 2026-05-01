import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  Signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { SynapseRadioService } from '../radio.service';

@Component({
  selector: 'syn-radio-button, label[syn-radio-button]',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'syn-radio-button',
    '[class.disabled]': 'disabled()',
    '[class.checked]': 'isChecked()',
    '[class.focus]': 'isFocused()',
    '(click)': 'onHostClick($event)',
  },
})
export class SynapseRadioButtonComponent {
  name = input('');

  disabled = input();

  focused = output<boolean>();

  isFocused = signal(false);

  isChecked: Signal<boolean>;

  private readonly _radio = viewChild.required<ElementRef<HTMLInputElement>>('radio');

  private readonly service = inject(SynapseRadioService);

  constructor() {
    this.isChecked = toSignal(
      this.service.selected$.pipe(map(selected => selected === this.name())),
      { initialValue: false },
    );
  }

  public setFocusState(state: boolean) {
    this.isFocused.set(state);
    this.focused.emit(state);
  }

  public setCheckedState() {
    this.service.setSelected(this.name());
  }

  /**
   * The native radio is visually hidden, so pointer events land on the host
   * (the visual circle). Forward them to the input — ignoring clicks that
   * already originated from it.
   */
  public onHostClick(event: Event) {
    if (this.disabled()) return;

    const radio = this._radio().nativeElement;

    if (event.target === radio) return;

    radio.click();
  }
}
