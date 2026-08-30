import { Component } from '@angular/core';
import { setupComponent } from '../../testing/setup';
import { SynapseModalHeaderComponent } from './modal-header/modal-header.component';
import { SynapseModalContentComponent } from './modal-content/modal-content.component';
import { SynapseModalFooterComponent } from './modal-footer/modal-footer.component';

@Component({
  imports: [
    SynapseModalHeaderComponent,
    SynapseModalContentComponent,
    SynapseModalFooterComponent,
  ],
  template: `
    <syn-modal-header title="Edit name" caption="Shown under the title" />
    <syn-modal-content><p class="projected">Body</p></syn-modal-content>
    <syn-modal-footer><button class="action">Save</button></syn-modal-footer>
  `,
})
class HostComponent {}

describe('modal parts', () => {
  it('renders the header title and caption', async () => {
    const fixture = await setupComponent(HostComponent);
    const header = fixture.nativeElement.querySelector('syn-modal-header') as HTMLElement;

    expect(header.textContent).toContain('Edit name');
    expect(header.querySelector('.caption')?.textContent).toContain('Shown under the title');
  });

  it('omits the caption when it is empty', async () => {
    const fixture = await setupComponent(SynapseModalHeaderComponent);
    fixture.componentRef.setInput('title', 'Only a title');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.caption')).toBeNull();
  });

  it('projects content and footer actions', async () => {
    const fixture = await setupComponent(HostComponent);

    expect(fixture.nativeElement.querySelector('.projected')?.textContent).toBe('Body');
    expect(fixture.nativeElement.querySelector('.action')?.textContent).toBe('Save');
  });
});
