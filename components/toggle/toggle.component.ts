import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { IwElementFormControlDirective, IwElementValueControlDirective } from '../control-directives';
import { Subject } from 'rxjs';

@Component({
  selector: 'syn-toggle, label[syn-toggle]',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'disabled()',
    '[class.checked]': 'isChecked()',
    '[class.focus]': 'isFocused()',
    '(click)': 'onHostClick($event)',
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
export class SynapseToggleComponent {
  description = input('');

  disabled = input();

  changeValue = output<boolean>();

  isChecked = signal(false);

  isFocused = signal(false);

  private readonly _checkbox = viewChild.required<ElementRef<HTMLInputElement>>('checkbox');

  private readonly _valueChanged$ = new Subject<boolean>();

  private readonly _valueControl = inject(IwElementValueControlDirective<boolean>);

  public setFocusState(state: boolean) {
    this.isFocused.set(state);
  }

  public setCheckedState(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked.set(target.checked);
    this.changeValue.emit(target.checked);
    this._valueChanged$.next(target.checked);
  }

  /**
   * The native checkbox is visually hidden, so pointer events land on the host
   * (indicator / state / track). Forward them to the checkbox — ignoring clicks
   * that already originated from the input itself, which would double-toggle.
   */
  public onHostClick(event: Event) {
    if (this.disabled()) return;

    const checkbox = this._checkbox().nativeElement;

    if (event.target === checkbox) return;

    checkbox.click();
  }

  constructor() {
    this._valueControl.registerEvent(this._valueChanged$);

    // Reflect the bound [value] onto the checkbox state.
    effect(() => {
      this.isChecked.set(!!this._valueControl.value());
    });
  }
}