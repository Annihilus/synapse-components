import {
  Directive,
  Host,
  inject,
  input,
  Optional,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';

import { SynControlFormControlDirective } from './control-form-control.directive';

type ElementType = HTMLInputElement | HTMLTextAreaElement;
type InputEventWithTarget = InputEvent & { target: HTMLInputElement | HTMLTextAreaElement };

@Directive({
  selector: '[SynControlControl]',
  standalone: true,
})
export class SynControlValueControlDirective<T> {
  public readonly value = input<T>();

  public readonly valueChanged = output<T>();

  private _element: HTMLInputElement | HTMLTextAreaElement | null = null;

  private _inputEventsInitiator$ = new Subject<Observable<unknown>>();

  private readonly _formControl = inject(SynControlFormControlDirective<unknown>, {
    optional: true,
    host: true,
  });

  constructor() {
    this._inputEventsInitiator$
      .pipe(
        switchMap(newObs$ => newObs$),
        takeUntilDestroyed(),
      )
      .subscribe(value => {
        this.setValue(value as T);
      });
  }

  public registerElement(element: ElementType) {
    this._element = element;

    // Setting initial value from input
    const initialValue = this._formControl?.value || this.value();

    if (initialValue && typeof initialValue === 'string') {
      element.value = initialValue;
    }

    this._inputEventsInitiator$.next(fromEvent<InputEventWithTarget>(element, 'input')
      .pipe(
        filter(
          event =>
            event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement,
        ),
        map(event => event.target.value),
        distinctUntilChanged(),
      ),
    );
  }

  public registerStream(stream$: Observable<unknown>) {
    this._inputEventsInitiator$.next(stream$);
  }

  public setValue(value: T) {
    if (this._element && typeof value === 'string') {
      this._element.value = value;
    }

    this._formControl?.changeValue(value);
    this.valueChanged.emit(value);
  }
}
