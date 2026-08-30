import { Component } from '@angular/core';
import { setupComponent } from '../../../testing/setup';
import { SynapseTabsComponent } from '../tabs.component';
import { SynapseTabComponent } from './tab.component';

@Component({
  imports: [SynapseTabsComponent, SynapseTabComponent],
  template: `
    <syn-tabs>
      <syn-tab name="one" [selected]="preselect">One</syn-tab>
      <syn-tab name="two">Two</syn-tab>
    </syn-tabs>
  `,
})
class HostComponent {
  preselect = false;
}

describe('SynapseTabComponent', () => {
  it('honours the [selected] input', async () => {
    const fixture = await setupComponent(HostComponent);
    fixture.componentInstance.preselect = true;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const first = fixture.nativeElement.querySelector('syn-tab') as HTMLElement;
    expect(first.classList.contains('selected')).toBe(true);
  });

  it('activates on Enter', async () => {
    const fixture = await setupComponent(HostComponent);
    const second = fixture.nativeElement.querySelectorAll('syn-tab')[1] as HTMLElement;

    second.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(second.getAttribute('aria-selected')).toBe('true');
  });

  it('activates on Space without scrolling the page', async () => {
    const fixture = await setupComponent(HostComponent);
    const second = fixture.nativeElement.querySelectorAll('syn-tab')[1] as HTMLElement;

    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    second.dispatchEvent(event);
    fixture.detectChanges();

    expect(second.getAttribute('aria-selected')).toBe('true');
    expect(event.defaultPrevented).toBe(true);
  });

  it('keeps only the selected tab reachable by Tab', async () => {
    const fixture = await setupComponent(HostComponent);
    const [first, second] = fixture.nativeElement.querySelectorAll('syn-tab');

    (second as HTMLElement).click();
    fixture.detectChanges();

    expect(second.getAttribute('tabindex')).toBe('0');
    expect(first.getAttribute('tabindex')).toBe('-1');
  });
});
