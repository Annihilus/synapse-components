import {
  Directive,
  input,
  Signal,
} from '@angular/core';
import {
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  startWith,
  Subject,
  switchAll,
} from 'rxjs';

type InputEventWithTarget = InputEvent & { target: HTMLInputElement | HTMLTextAreaElement };

@Directive({
  selector: '[SynControlFilledState]',
  standalone: true,
  host: {
    '[class.filled]': 'state()',
  },
})
export class IwControlFilledStateDirective<T = unknown> {
  public readonly value = input<T | undefined>(undefined);

  public readonly state: Signal<boolean>;

  private readonly _initiator$ = new Subject<Observable<unknown>>();

  constructor() {
    this.state = this._getFilledState();
  }

  public registerElement(element: HTMLInputElement | HTMLTextAreaElement) {
    const value$ = fromEvent<InputEventWithTarget>(element, 'input').pipe(
      map(event => event.target),
      filter(target => target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement),
      map(event => event.value),
      startWith(element.value),
    );

    this._initiator$.next(value$);
  }

  public registerStream(stream$: Observable<unknown>) {
    this._initiator$.next(stream$);
  }

  private _getFilledState() {
    const internalValue$ = this._initiator$.pipe(
      switchAll(),
      map(value => isTrulyValue(value)),
    );

    const externalValue$ = toObservable(this.value).pipe(
      map(isTrulyValue),
    );

    const filled$ = merge(internalValue$, externalValue$);

    return toSignal(filled$, { initialValue: false });
  }
}

function isTrulyValue(value?: unknown): boolean {
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length > 0;
  } else {
    return Boolean(value);
  }
}
