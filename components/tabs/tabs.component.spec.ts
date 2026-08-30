import { Component } from '@angular/core';
import { setupComponent } from '../../testing/setup';
import { SynapseTabsComponent } from './tabs.component';
import { SynapseTabComponent } from './tab/tab.component';

@Component({
  imports: [SynapseTabsComponent, SynapseTabComponent],
  template: `
    <syn-tabs [initialActiveTab]="initial" (changed)="last = $event">
      <syn-tab name="one">One</syn-tab>
      <syn-tab name="two">Two</syn-tab>
      <syn-tab name="three">Three</syn-tab>
    </syn-tabs>
  `,
})
class HostComponent {
  initial = 'one';
  last = '';
}

@Component({
  imports: [SynapseTabsComponent, SynapseTabComponent],
  template: `
    <syn-tabs initialActiveTab="missing">
      <syn-tab name="one">One</syn-tab>
    </syn-tabs>
  `,
})
class NoMatchHostComponent {}

@Component({
  imports: [SynapseTabsComponent],
  template: `<syn-tabs />`,
})
class EmptyHostComponent {}

const selected = (fixture: { nativeElement: HTMLElement }) =>
  fixture.nativeElement.querySelector('[aria-selected="true"]')?.textContent?.trim();

describe('SynapseTabsComponent', () => {
  it('applies the tablist ARIA roles', async () => {
    const fixture = await setupComponent(HostComponent);
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('syn-tabs')?.getAttribute('role')).toBe('tablist');
    expect(host.querySelectorAll('[role="tab"]').length).toBe(3);
  });

  it('activates the initial tab and reports it', async () => {
    const fixture = await setupComponent(HostComponent);

    expect(selected(fixture)).toBe('One');
    expect(fixture.componentInstance.last).toBe('one');
  });

  it('selects on click, keeping exactly one tab active', async () => {
    const fixture = await setupComponent(HostComponent);

    (fixture.nativeElement.querySelectorAll('syn-tab')[2] as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.selected').length).toBe(1);
    expect(selected(fixture)).toBe('Three');
    expect(fixture.componentInstance.last).toBe('three');
  });

  it('moves through the tabs with arrows, wrapping at both ends', async () => {
    const fixture = await setupComponent(HostComponent);
    const tablist = fixture.nativeElement.querySelector('syn-tabs') as HTMLElement;
    const press = (key: string) => {
      tablist.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      fixture.detectChanges();
    };

    press('ArrowRight');
    expect(selected(fixture)).toBe('Two');
    press('ArrowDown');
    expect(selected(fixture)).toBe('Three');
    press('ArrowRight');
    expect(selected(fixture)).toBe('One');
    press('ArrowLeft');
    expect(selected(fixture)).toBe('Three');
    press('ArrowUp');
    expect(selected(fixture)).toBe('Two');
  });

  it('jumps to the ends with Home and End', async () => {
    const fixture = await setupComponent(HostComponent);
    const tablist = fixture.nativeElement.querySelector('syn-tabs') as HTMLElement;

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(selected(fixture)).toBe('Three');

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(selected(fixture)).toBe('One');
  });

  it('ignores unrelated keys', async () => {
    const fixture = await setupComponent(HostComponent);
    const tablist = fixture.nativeElement.querySelector('syn-tabs') as HTMLElement;

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    fixture.detectChanges();

    expect(selected(fixture)).toBe('One');
  });

  it('starts with nothing selected when the initial name matches no tab', async () => {
    const fixture = await setupComponent(NoMatchHostComponent);

    expect(fixture.nativeElement.querySelectorAll('.selected').length).toBe(0);
    expect(fixture.nativeElement.querySelector('[aria-selected="true"]')).toBeNull();
  });

  it('ignores arrow keys when there are no tabs', async () => {
    const fixture = await setupComponent(EmptyHostComponent);
    const tablist = fixture.nativeElement.querySelector('syn-tabs') as HTMLElement;

    expect(() => {
      tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('starts from the first tab when none is selected yet', async () => {
    const fixture = await setupComponent(NoMatchHostComponent);
    const tablist = fixture.nativeElement.querySelector('syn-tabs') as HTMLElement;

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(selected(fixture)).toBe('One');
  });
});
