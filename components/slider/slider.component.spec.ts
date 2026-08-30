import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { setupComponent } from '../../testing/setup';
import { SynapseSliderComponent } from './slider.component';

@Component({
  imports: [SynapseSliderComponent, ReactiveFormsModule],
  template: `<syn-slider [formControl]="control" [step]="5" (changeValue)="last = $event" />`,
})
class FormHostComponent {
  control = new FormControl(0);
  last: number | null = null;
}

/** jsdom has no layout, so the host is given a measurable box by hand. */
function stubRect(element: HTMLElement, rect: Partial<DOMRect>) {
  element.getBoundingClientRect = () => ({
    top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, width: 0, height: 0,
    toJSON: () => ({}), ...rect,
  }) as DOMRect;
}

describe('SynapseSliderComponent', () => {
  it('exposes the range through ARIA', async () => {
    const fixture = await setupComponent(SynapseSliderComponent);
    const host = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('role')).toBe('slider');
    expect(host.getAttribute('aria-valuemin')).toBe('0');
    expect(host.getAttribute('aria-valuemax')).toBe('100');
    expect(host.getAttribute('aria-valuenow')).toBe('0');
    expect(host.getAttribute('tabindex')).toBe('0');
  });

  it('steps with the arrow keys and jumps with Home/End', async () => {
    const fixture = await setupComponent(SynapseSliderComponent);
    fixture.componentRef.setInput('step', 5);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const press = (key: string) => {
      host.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      fixture.detectChanges();
    };

    press('ArrowRight');
    expect(fixture.componentInstance.value()).toBe(5);
    press('ArrowUp');
    expect(fixture.componentInstance.value()).toBe(10);
    press('ArrowLeft');
    expect(fixture.componentInstance.value()).toBe(5);
    press('ArrowDown');
    expect(fixture.componentInstance.value()).toBe(0);

    press('End');
    expect(fixture.componentInstance.value()).toBe(100);
    press('Home');
    expect(fixture.componentInstance.value()).toBe(0);
  });

  it('ignores unrelated keys', async () => {
    const fixture = await setupComponent(SynapseSliderComponent);

    (fixture.nativeElement as HTMLElement)
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe(0);
  });

  it('ignores keys while disabled', async () => {
    const fixture = await setupComponent(SynapseSliderComponent);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('tabindex')).toBe('-1');

    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe(0);
  });

  it('writes the stepped value to the form on pointer drag', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const host = fixture.nativeElement.querySelector('syn-slider') as HTMLElement;
    stubRect(host, { left: 0, width: 124 });

    host.dispatchEvent(new PointerEvent('pointerdown', { clientX: 62, bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.control.value).toBe(fixture.componentInstance.last);
    expect(fixture.componentInstance.last).toBeGreaterThan(0);
  });

  it('only tracks pointer moves while the primary button is down', async () => {
    const fixture = await setupComponent(SynapseSliderComponent);
    const host = fixture.nativeElement as HTMLElement;
    stubRect(host, { left: 0, width: 124 });

    host.dispatchEvent(new PointerEvent('pointermove', { clientX: 100, buttons: 0, bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(0);

    host.dispatchEvent(new PointerEvent('pointermove', { clientX: 100, buttons: 1, bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBeGreaterThan(0);
  });

  it('releases pointer capture on pointerup', async () => {
    const fixture = await setupComponent(SynapseSliderComponent);
    const host = fixture.nativeElement as HTMLElement;
    host.setPointerCapture(1);
    expect(host.hasPointerCapture(1)).toBe(true);

    host.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, bubbles: true }));

    expect(host.hasPointerCapture(1)).toBe(false);
  });

  it('leaves capture alone when it was never taken', async () => {
    const fixture = await setupComponent(SynapseSliderComponent);
    const host = fixture.nativeElement as HTMLElement;
    expect(() =>
      host.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, bubbles: true })),
    ).not.toThrow();
  });

  it('ignores pointerdown while disabled', async () => {
    const fixture = await setupComponent(SynapseSliderComponent);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    stubRect(host, { left: 0, width: 124 });

    host.dispatchEvent(new PointerEvent('pointerdown', { clientX: 62, bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe(0);
  });

  it('clamps a form value into the range and tracks focus', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const host = fixture.nativeElement.querySelector('syn-slider') as HTMLElement;

    fixture.componentInstance.control.setValue(500);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(host.getAttribute('aria-valuenow')).toBe('100');

    host.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(host.classList.contains('focus')).toBe(true);

    host.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(host.classList.contains('focus')).toBe(false);
    expect(fixture.componentInstance.control.touched).toBe(true);
  });

  it('reports zero progress for a collapsed range', async () => {
    const fixture = await setupComponent(SynapseSliderComponent);
    fixture.componentRef.setInput('min', 10);
    fixture.componentRef.setInput('max', 10);
    fixture.detectChanges();

    expect(fixture.componentInstance.percent()).toBe(0);
  });

  it('re-measures the track when the host resizes', async () => {
    const observed: Element[] = [];
    let notify = () => { /* replaced below */ };

    class SpyResizeObserver {
      constructor(callback: () => void) { notify = callback; }
      observe(target: Element) { observed.push(target); }
      unobserve() { /* no-op */ }
      disconnect() { /* no-op */ }
    }

    const original = globalThis.ResizeObserver;
    (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = SpyResizeObserver;

    try {
      const fixture = await setupComponent(SynapseSliderComponent);
      await fixture.whenStable();

      expect(observed).toContain(fixture.nativeElement);
      expect(() => notify()).not.toThrow();
    } finally {
      (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = original;
    }
  });

  it('still measures once where ResizeObserver is unavailable', async () => {
    const original = globalThis.ResizeObserver;
    delete (globalThis as unknown as { ResizeObserver?: unknown }).ResizeObserver;

    try {
      const fixture = await setupComponent(SynapseSliderComponent);
      await fixture.whenStable();

      expect(fixture.componentInstance.thumbLeft()).toBe(0);
    } finally {
      (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = original;
    }
  });

  it('does not re-emit when the stepped value is unchanged', async () => {
    const fixture = await setupComponent(SynapseSliderComponent);
    let emissions = 0;
    fixture.componentInstance.changeValue.subscribe(() => emissions++);

    const host = fixture.nativeElement as HTMLElement;
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe(0);
    expect(emissions).toBe(0);
  });
});
