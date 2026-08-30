import { Component, signal } from '@angular/core';
import { setupComponent } from '../../testing/setup';
import { SynapseTagComponent } from './tag.component';

@Component({
  imports: [SynapseTagComponent],
  template: `
    <syn-tag
      color="red"
      icon="check"
      [canBeDeleted]="true"
      removeLabel="Remove tag"
      (closed)="closedCount.set(closedCount() + 1)"
    >Tag</syn-tag>
  `,
})
class HostComponent {
  closedCount = signal(0);
}

describe('SynapseTagComponent', () => {
  it('emits closed when the remove button is pressed', async () => {
    const fixture = await setupComponent(HostComponent);
    const close = fixture.nativeElement.querySelector('.close') as HTMLElement;

    expect(close.getAttribute('aria-label')).toBe('Remove tag');

    close.click();
    expect(fixture.componentInstance.closedCount()).toBe(1);
  });

  it('renders the leading icon and colour modifier', async () => {
    const fixture = await setupComponent(HostComponent);
    const tag = fixture.nativeElement.querySelector('syn-tag') as HTMLElement;

    expect(tag.className).toContain('color-red');
    expect(tag.querySelector('syn-icon.icon')).toBeTruthy();
  });

  it('defaults to the cyan colour and renders no affordances', async () => {
    const fixture = await setupComponent(SynapseTagComponent);
    const tag = fixture.nativeElement as HTMLElement;

    expect(tag.className).toContain('color-cyan');
    expect(tag.querySelector('.close')).toBeNull();
    expect(tag.querySelector('syn-icon.icon')).toBeNull();
  });
});
