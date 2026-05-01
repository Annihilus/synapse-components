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
  selector: '[SynControlValidState]',
  standalone: true,
})
export class IwControlValidStateDirective {
  public errors = input<boolean | string | string[]>(false);

  public errorsList = computed(() => {
    const errors = this.errors();

    if (Array.isArray(errors)) {
      return errors;
    }

    if (typeof errors === 'string') {
      return [errors];
    }

    return [];
  });

  public isInvalid = computed(() => {
    const control = this._formControl?.control();

    return control ? control.invalid : this.errors();
  });

  public isValid = computed(() => {
    const control = this._formControl?.control();

    return control ? control.valid : !this.errors();
  });

  private readonly _formControl = inject(SynControlFormControlDirective<unknown>, {
    optional: true,
    host: true,
  });
}
