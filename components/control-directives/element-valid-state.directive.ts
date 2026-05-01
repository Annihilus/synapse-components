import {
  computed,
  Directive,
  Host,
  inject,
  input,
  Optional,
  Signal,
} from '@angular/core';
import {
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import {
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';

import { IwElementFormControlDirective } from './element-form-control.directive';

@Directive({
  selector: '[iwElementValidState]',
  standalone: true,
})
export class IwElementValidStateDirective {
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

  public isInvalid = computed(() => this._isInvalid());

  public isValid = computed(() => !this._isInvalid());

  private readonly _isInvalid: Signal<boolean>;

  private readonly formControlDirective = inject(IwElementFormControlDirective<unknown>, {
    optional: true,
    host: true,
  });

  constructor() {
    const formControl = computed(() => this.formControlDirective?.control());

    const errors$ = toObservable(this.errors);

    const controlInvalid$ = toObservable(formControl).pipe(
      switchMap(control => control
        ? this._getControlStatus(control)
        : this._getErrorState(errors$),
      ),
    );

    this._isInvalid = toSignal(controlInvalid$, { initialValue: false });
  }

  private _getControlStatus(control: AbstractControl) {
    return control.statusChanges.pipe(
      startWith(control.status),
      map(status => status === 'INVALID'),
    );
  }

  private _getErrorState(errors$: Observable<string | boolean | string[]>) {
    return errors$.pipe(
      map(errorState => typeof errorState === 'boolean'
        ? errorState
        : errorState.length > 0,
      ),
    );
  }
}
