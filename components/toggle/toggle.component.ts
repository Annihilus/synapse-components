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

  // Bridges the toggle to a reactive form ([formControl]/[formControlName]).
  private readonly _formControl = inject(IwElementFormControlDirective<boolean>);

  public setFocusState(state: boolean) {
    this.isFocused.set(state);
  }

  public setCheckedState(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked.set(target.checked);
    this.changeValue.emit(target.checked);
    this._valueChanged$.next(target.checked);
    // Push to the reactive form so a bound [formControl] updates.
    this._formControl.changeValue(target.checked);
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

    // Reflect a bound reactive-form value (initial + external updates).
    effect((onCleanup) => {
      const control = this._formControl.control();
      if (!control) return;

      this.isChecked.set(!!control.value);
      const sub = control.valueChanges.subscribe((value) => this.isChecked.set(!!value));
      onCleanup(() => sub.unsubscribe());
    });
  }
}