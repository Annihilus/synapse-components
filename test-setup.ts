import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

// jsdom ships neither PointerEvent nor the pointer-capture methods, both of
// which the slider relies on.
if (typeof PointerEvent === 'undefined') {
  class PointerEventPolyfill extends MouseEvent {
    readonly pointerId: number;

    constructor(type: string, init: MouseEventInit & { pointerId?: number } = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 0;
    }
  }

  (globalThis as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventPolyfill;
}

const capture = new WeakMap<Element, Set<number>>();

Element.prototype.setPointerCapture ??= function (this: Element, pointerId: number) {
  const ids = capture.get(this) ?? new Set<number>();
  ids.add(pointerId);
  capture.set(this, ids);
};

Element.prototype.releasePointerCapture ??= function (this: Element, pointerId: number) {
  capture.get(this)?.delete(pointerId);
};

Element.prototype.hasPointerCapture ??= function (this: Element, pointerId: number) {
  return capture.get(this)?.has(pointerId) ?? false;
};

// jsdom has no ResizeObserver; the slider measures its track through one.
if (typeof ResizeObserver === 'undefined') {
  class ResizeObserverPolyfill {
    observe(): void { /* layout never changes in jsdom */ }
    unobserve(): void { /* no-op */ }
    disconnect(): void { /* no-op */ }
  }

  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverPolyfill;
}
