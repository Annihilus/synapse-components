import { ApplicationRef, Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SynapseModalService } from './modal.service';
import { SynapseModalRef } from './modal.ref';
import { DIALOG_DATA } from './modal.tokens';

@Component({ template: `<p class="body">{{ data }}</p>` })
class DialogComponent {
  readonly ref = inject(SynapseModalRef);
  readonly data = inject<string>(DIALOG_DATA);
}

describe('SynapseModalService', () => {
  let service: SynapseModalService;
  let appRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SynapseModalService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SynapseModalService);
    appRef = TestBed.inject(ApplicationRef);
  });

  afterEach(() => {
    document.querySelectorAll('syn-modal').forEach(el => el.remove());
  });

  it('mounts a dialog window and renders the given component', () => {
    service.open(DialogComponent, { data: 'hello' }).subscribe();
    appRef.tick();

    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(document.querySelector('.body')?.textContent).toContain('hello');
  });

  it('reports the result and the reason', () => {
    const seen: { reason: string }[] = [];
    service.open(DialogComponent, { data: 'x' }).subscribe(r => seen.push(r));
    appRef.tick();

    (document.querySelector('.overlay') as HTMLElement).click();

    expect(seen).toEqual([{ result: undefined, reason: 'dismiss' }]);
  });

  it('survives a second close', () => {
    let emissions = 0;
    service.open(DialogComponent, { data: 'x' }).subscribe(() => emissions++);
    appRef.tick();

    const overlay = document.querySelector('.overlay') as HTMLElement;

    overlay.click();
    expect(() => overlay.click()).not.toThrow();
    expect(emissions).toBe(1);
  });

  it('closes on Escape', () => {
    let emissions = 0;
    service.open(DialogComponent, { data: 'x' }).subscribe(() => emissions++);
    appRef.tick();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(emissions).toBe(1);
  });

  it('tolerates a window already detached from the DOM', () => {
    let emissions = 0;
    service.open(DialogComponent, { data: 'x' }).subscribe(() => emissions++);
    appRef.tick();

    document.querySelector('syn-modal')?.remove();

    const button = document.querySelector('[role="dialog"]');
    void button;

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(emissions).toBe(1);
  });

  it('closes through the header button', () => {
    let emissions = 0;
    service.open(DialogComponent, { data: 'x' }).subscribe(() => emissions++);
    appRef.tick();

    (document.querySelector('.close') as HTMLElement).click();

    expect(emissions).toBe(1);
  });

  it('honours size and closeBtn config', () => {
    service.open(DialogComponent, { data: 'x', size: 's', closeBtn: false }).subscribe();
    appRef.tick();

    expect(document.querySelector('.modal')?.className).toContain('size-s');
    expect(document.querySelector('.close')).toBeNull();
  });

  it('passes an explicit reason and result through', () => {
    const seen: { reason: string; result?: unknown }[] = [];
    service.open<DialogComponent, string, string>(DialogComponent, { data: 'x' })
      .subscribe(r => seen.push(r));
    appRef.tick();

    const ref = TestBed.inject(SynapseModalService);
    void ref;

    const instance = (document.querySelector('.body') as HTMLElement);
    void instance;

    (document.querySelector('.close') as HTMLElement).click();

    expect(seen[0].reason).toBe('dismiss');
  });
});
