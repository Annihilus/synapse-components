import {
  computed,
  Directive,
  inject,
  input,
} from '@angular/core';

import { IwElementFormControlDirective } from './element-form-control.directive';

@Directive({
  selector: '[iwElementDisable]',
  host: {
    '[attr.disabled]': 'state() || null',
    '[class.disabled]': 'state()',
  },
})
export class IwElementDisableDirective {
  public disabled = input<boolean>(false);

  public state = computed(() =>
    this._isFormControl() ? Boolean(this._formControl?.disableState()) : this.disabled(),
  );

  private readonly _formControl = inject(IwElementFormControlDirective<unknown>, {
    optional: true,
    host: true,
  });

  private _isFormControl() {
    return Boolean(this._formControl?.formControlName());
  }
}
