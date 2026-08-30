import {
  DestroyRef,
  Directive,
  Injector,
  OnInit,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { Observable, of, startWith, switchMap } from 'rxjs';

function hasErrors(errors: boolean | string | string[]): boolean {
  return typeof errors === 'boolean' ? errors : errors.length > 0;
}

function isFilled(value: unknown): boolean {
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length > 0;
  }

  return Boolean(value);
}

/**
 * Shared form state for every Synapse control, applied as a host directive.
 *
 * It is the `ControlValueAccessor` for its host, so `formControl`,
 * `formControlName` and `ngModel` drive it. Without a form it falls back to
 * `[value]` and `[error]`.
 */
@Directive({
  selector: '[synControl]',
  exportAs: 'synControl',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SynapseControlDirective),
      multi: true,
    },
  ],
  host: {
    '[class.filled]': 'filled()',
    '[class.disabled]': 'disabled()',
  },
})
export class SynapseControlDirective<T = unknown> implements ControlValueAccessor, OnInit {
  /** Used when there is no form. */
  readonly value = input<T | undefined>(undefined);

  /** Used when there is no form. */
  readonly errors = input<boolean | string | string[]>(false, { alias: 'error' });

  readonly disabledInput = input(false, { alias: 'disabled' });

  readonly valueChanged = output<T | undefined>();

  private readonly injector = inject(Injector);

  private readonly destroyRef = inject(DestroyRef);

  private readonly _value = signal<T | undefined>(undefined);

  private readonly _touched = signal(false);

  private readonly _disabledByForm = signal<boolean | null>(null);

  private readonly _control = signal<AbstractControl | null>(null);

  private onChange: (value: T | undefined) => void = () => { /* set by Angular */ };

  private onTouched: () => void = () => { /* set by Angular */ };

  /** The bound control, or `null` when the host is used without a form. */
  readonly control = this._control.asReadonly();

  readonly current = this._value.asReadonly();

  readonly touched = this._touched.asReadonly();

  /** A form's disabled state wins over the `[disabled]` input. */
  readonly disabled = computed(() => this._disabledByForm() ?? this.disabledInput());

  readonly filled = computed(() => isFilled(this._value()));

  private readonly status = toSignal(
    toObservable(this._control).pipe(
      switchMap(control => control
        ? control.statusChanges.pipe(startWith(control.status))
        : of<string | null>(null)),
    ),
    { initialValue: null },
  );

  readonly invalid = computed(() => this._control()
    ? this.status() === 'INVALID'
    : hasErrors(this.errors()));

  /**
   * Whether the error state should be rendered. With a form the control has to
   * be touched first; without one a non-empty `[error]` shows immediately.
   */
  readonly showError = computed(() => this._control()
    ? this.invalid() && this._touched()
    : this.invalid());

  readonly errorList = computed(() => {
    const errors = this.errors();

    if (Array.isArray(errors)) return errors;
    if (typeof errors === 'string') return errors ? [errors] : [];

    return [];
  });

  constructor() {
    effect(() => {
      const bound = this.value();

      if (bound !== undefined) {
        this._value.set(bound);
      }
    });
  }

  ngOnInit(): void {
    // Resolved here rather than injected: this directive provides the value
    // accessor that `NgControl` depends on, so asking for it during
    // construction would close a dependency cycle. By `ngOnInit` the form
    // directive has run its own `ngOnChanges` and exposes the control.
    const ngControl = this.injector.get(NgControl, null, { optional: true, self: true });

    this._control.set(ngControl?.control ?? null);
  }

  /**
   * A stream rather than an element: a value need not come from one DOM node,
   * and only the host knows how to build a `T` from its parts.
   */
  registerSource(source$: Observable<T>): void {
    source$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.setValue(value));
  }

  setValue(value: T): void {
    this._value.set(value);
    this.onChange(value);
    this.valueChanged.emit(value);
  }

  markTouched(): void {
    this._touched.set(true);
    this.onTouched();
  }

  writeValue(value: T): void {
    this._value.set(value);
  }

  registerOnChange(fn: (value: T | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabledByForm.set(isDisabled);
  }
}
