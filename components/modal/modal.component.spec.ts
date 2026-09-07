import { Component } from '@angular/core';
import { setupComponent } from '../../testing/setup';
import { SynapseModalComponent } from './modal.component';
import { ModalSize } from './modal.tokens';

@Component({
  imports: [SynapseModalComponent],
  template: `
    <syn-modal [size]="size" [closeBtn]="closeBtn">
      <p class="projected">Body</p>
    </syn-modal>
  `,
})
class HostComponent {
  size: ModalSize = 's';
  closeBtn = false;
}

describe('SynapseModalComponent', () => {
  it('is inert until a modal ref is attached', async () => {
    const fixture = await setupComponent(SynapseModalComponent);

    const overlay = fixture.nativeElement.querySelector('.overlay') as HTMLElement;

    expect(() => overlay.click()).not.toThrow();
    expect(() =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })),
    ).not.toThrow();
  });

  it('falls back to the medium window with a close button', async () => {
    const fixture = await setupComponent(SynapseModalComponent);

    expect(fixture.nativeElement.querySelector('.modal').className).toContain('size-m');
    expect(fixture.nativeElement.querySelector('.close')).not.toBeNull();
  });

  it('takes size and closeBtn from the template, for use outside the service', async () => {
    const fixture = await setupComponent(HostComponent);

    expect(fixture.nativeElement.querySelector('.modal').className).toContain('size-s');
    expect(fixture.nativeElement.querySelector('.close')).toBeNull();
    expect(fixture.nativeElement.querySelector('.projected')?.textContent).toContain('Body');
  });
});
