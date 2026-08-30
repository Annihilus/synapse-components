import { setupComponent } from '../../testing/setup';
import { SynapseModalWindowComponent } from './modal-window/modal-window.component';
import { DIALOG_CLOSE_BTN, DIALOG_SIZE } from './modal.tokens';

describe('SynapseModalWindowComponent', () => {
  it('is inert until a modal ref is attached', async () => {
    const fixture = await setupComponent(SynapseModalWindowComponent, [
      { provide: DIALOG_SIZE, useValue: 'm' },
      { provide: DIALOG_CLOSE_BTN, useValue: true },
    ]);

    const overlay = fixture.nativeElement.querySelector('.overlay') as HTMLElement;

    expect(() => overlay.click()).not.toThrow();
    expect(() =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })),
    ).not.toThrow();
  });
});
