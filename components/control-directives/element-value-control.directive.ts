import {
  computed,
  Directive,
  inject,
  input,
  output,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
} from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import {
  distinctUntilChanged,
  EMPTY,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import { IwElementFormControlDirective } from './element-form-control.directive';

type InputElementType = HTMLInputElement | HTMLTextAreaElement;

@Directive({
  selector: '[iwElementControl]',
  standalone: true,
})
export class IwElementValueControlDirective<T> {
  public readonly value = input<T | undefined>();

  public readonly valueChanged = output<T | undefined>();

  private readonly _control = computed(() => this._formControl?.control() ?? null);

  private _element: InputElementType | null = null;

  private readonly _event$ = new Subject<Observable<T>>();

  private readonly _formControl = inject(IwElementFormControlDirective<unknown>, {
    optional: true,
    host: true,
  });

  constructor() {
    const controlValue$ = toObservable(this._control).pipe(
      switchMap((control: AbstractControl<T> | null) =>
        control ? control.valueChanges : EMPTY,
      ),
    );

    // TODO Вероятно обработка инпута должна уйти в компоненты
    const inputValue$ = toObservable(this.value).pipe(
      filter((val): val is T => val !== undefined),
    );

    merge(controlValue$, inputValue$)
      .pipe(
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe(value => this.setValue(value));

    this._event$
      .pipe(
        switchMap(event$ => merge(event$, controlValue$)),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe(value => {
        this.valueChanged.emit(value);
      });
  }

  public registerEvent(event$: Observable<T>) {
    const connectedEvent$ = event$.pipe(tap(val => this._formControl?.changeValue(val)));

    this._event$.next(connectedEvent$);
  }

  public registerInputElement(
    this: IwElementValueControlDirective<string>,
    element: InputElementType,
  ) {
    this._element = element;

    const value = this._control()?.value ?? this.value() ?? '';

    if (value) {
      this.setValue(String(value));
    }

    const event$ = fromEvent<InputEvent>(element, 'input').pipe(
      map(event => {
        const { target } = event;

        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
          return target.value;
        }

        return '';
      }),
    );

    this.registerEvent(event$);
  }

  public setValue(value: T) {
    if (this._element && typeof value === 'string') {
      this._element.value = value;
    }
  }
}
