import {
  computed,
  Directive,
  Host,
  inject,
  input,
  Optional,
} from '@angular/core';
import { SynControlFormControlDirective } from './control-form-control.directive';

@Directive({
  selector: '[SynControlDisable]',
  host: {
    '[attr.disabled]': 'state() || null',
    '[class.disabled]': 'state()',
  },
  standalone: true,
})
export class IwControlDisableDirective {
  public disabled = input<boolean>(false);

  public state = computed(() =>
    this._isFormControl() ? Boolean(this._formControl?.disableState()) : this.disabled(),
  );

  private readonly _formControl = inject(SynControlFormControlDirective<unknown>, {
    optional: true,
    host: true,
  });

  private _isFormControl() {
    return Boolean(this._formControl?.formControlName());
  }
}
