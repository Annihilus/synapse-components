import {
  computed,
  DestroyRef,
  Directive,
  forwardRef,
  inject,
  input,
  Signal,
  signal,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  filter,
  fromEvent,
  map,
  startWith,
  switchMap,
} from 'rxjs';

@Directive({
  selector: '[SynControlFormControl]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SynControlFormControlDirective),
      multi: true,
    },
  ],
})
export class SynControlFormControlDirective<T> implements ControlValueAccessor {
  public readonly errors = input<string[]>([]);

  public readonly formControlName = input<string>('');

  public readonly formControl = input<AbstractControl>();

  public readonly displayErrors = computed(() => {
    const errors = this.errors();

    if (!errors) return;

    const show = this._isTouched() && this._isInvalid();

    if (show) return errors;

    return;
  });

  public readonly disableState = signal(false);

  public value: T | null = null;

  public readonly control = computed<AbstractControl | null>(() => {
    const control = this.formControl();

    if (control) return control;

    if (this._controlContainer && this.formControlName()) {
      const form = this._controlContainer.control as FormGroup;

      if (form) {
        return form.controls[this.formControlName()];
      }
    }

    return null;
  });

  private _isInvalid: Signal<boolean | undefined>;

  private _isTouched = signal(false);

  private _controlContainer = inject(ControlContainer, { optional: true });

  private _destroy = inject(DestroyRef);

  constructor() {
    const validityStream$ = this._getValidityStream();

    this._isInvalid = toSignal(validityStream$);
  }

  public registerElement(element: HTMLElement) {
    fromEvent(element, 'blur')
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe(() => {
        this._isTouched.set(true);
        this._propagateTouched();
      });
  }

  public changeValue(value: T) {
    this._propagateChange(value);
  }

  public writeValue(value: T) {
    this.value = value;
  }

  public registerOnChange(fn: (value: T) => void) {
    this._propagateChange = fn;
  }

  public registerOnTouched(fn: () => void) {
    this._propagateTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disableState.set(isDisabled);
  }

  private _propagateChange: (value: T) => void = () => {};

  private _propagateTouched: () => void = () => {};

  private _getValidityStream() {
    return toObservable(this.control)
      .pipe(
        filter(control => control !== null),
        switchMap(control => control.statusChanges.pipe(startWith(control.status))),
        map(state => state === 'INVALID'),
      );
  }
}
