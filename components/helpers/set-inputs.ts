import {
  ComponentRef,
  InputSignal,
  InputSignalWithTransform,
  OutputRef,
} from '@angular/core';

export type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N;

export type ExcludeAny<T> = IfAny<T, unknown, T>;

export type Keys<O, IncludedValues = any, ExcludedValues = never> = {
  [K in keyof O]-?:
  ExcludeAny<O[K]> extends ExcludedValues ? never
    : ExcludeAny<O[K]> extends IncludedValues ? K
      : never
}[keyof O];


export type ComponentInputs<C> = {
  [K in Keys<C, any, OutputRef<unknown>>]?: InputValue<C[K]>;
};

type InputValue<T> =
  T extends OutputRef<unknown> ? never
    : T extends (Input<infer V> | undefined) ? V
      : T;

type Input<V> = InputSignal<V> | InputSignalWithTransform<any, V>;

export const setInputs = <C>(ref: ComponentRef<C>, inputs: ComponentInputs<C>) => {
  Object.entries(inputs).forEach(([key, value]) => ref.setInput(key, value));
  ref.changeDetectorRef.detectChanges();
};
