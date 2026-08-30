import {
  DestroyRef,
  type ElementRef,
  type Signal,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, map, switchMap } from 'rxjs';

import { type SynapseControlDirective } from './control.directive';

type TextElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * Wires one native text field to a string-valued control. Composite controls
 * skip it and call `registerSource()` themselves.
 *
 * Call from a constructor: it uses the surrounding injection context.
 */
export function connectTextInput(
  control: SynapseControlDirective<string>,
  element: Signal<ElementRef<TextElement>>,
): void {
  const destroyRef = inject(DestroyRef);

  const element$ = toObservable(element).pipe(map(ref => ref.nativeElement));

  control.registerSource(
    element$.pipe(switchMap(el => fromEvent(el, 'input').pipe(map(() => el.value)))),
  );

  element$
    .pipe(
      switchMap(el => fromEvent(el, 'blur')),
      takeUntilDestroyed(destroyRef),
    )
    .subscribe(() => control.markTouched());

  effect(() => {
    const el = element().nativeElement;
    const value = control.current();
    const next = value ?? '';

    if (el.value !== next) {
      el.value = next;
    }
  });
}
