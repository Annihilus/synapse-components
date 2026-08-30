import { type ApplicationRef, type ComponentRef } from '@angular/core';
import { SynapseModalRef } from './modal.ref';

function stubWindowRef(attached: boolean) {
  const element = document.createElement('div');
  if (attached) document.body.appendChild(element);

  let destroyed = false;

  const ref = {
    location: { nativeElement: element },
    hostView: {} as never,
    destroy: () => { destroyed = true; },
  } as unknown as ComponentRef<unknown>;

  return { ref, element, isDestroyed: () => destroyed };
}

const appRefStub = { detachView: () => undefined } as unknown as ApplicationRef;

describe('SynapseModalRef', () => {
  it('emits the default dismiss reason', () => {
    const { ref } = stubWindowRef(true);
    const modalRef = new SynapseModalRef({}, ref, appRefStub);

    const seen: unknown[] = [];
    modalRef.afterClosed().subscribe(v => seen.push(v));

    modalRef.close();

    expect(seen).toEqual([{ result: undefined, reason: 'dismiss' }]);
  });

  it('carries an explicit reason and result', () => {
    const { ref } = stubWindowRef(true);
    const modalRef = new SynapseModalRef<unknown, string>({}, ref, appRefStub);

    const seen: { reason: string; result?: string }[] = [];
    modalRef.afterClosed().subscribe(v => seen.push(v));

    modalRef.close({ reason: 'ok', result: 'saved' });

    expect(seen).toEqual([{ result: 'saved', reason: 'ok' }]);
  });

  it('removes the host element and destroys the view once', () => {
    const { ref, element, isDestroyed } = stubWindowRef(true);
    const modalRef = new SynapseModalRef({}, ref, appRefStub);

    modalRef.close();

    expect(element.parentNode).toBeNull();
    expect(isDestroyed()).toBe(true);
  });

  it('tolerates a host element that was never attached', () => {
    const { ref } = stubWindowRef(false);
    const modalRef = new SynapseModalRef({}, ref, appRefStub);

    expect(() => modalRef.close()).not.toThrow();
  });

  it('ignores a second close', () => {
    const { ref } = stubWindowRef(true);
    const modalRef = new SynapseModalRef({}, ref, appRefStub);

    let emissions = 0;
    modalRef.afterClosed().subscribe(() => emissions++);

    modalRef.close();
    modalRef.close();

    expect(emissions).toBe(1);
  });
});
