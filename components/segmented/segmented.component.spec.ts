import { Component, signal } from '@angular/core';
import { setupComponent } from '../../testing/setup';
import { SynapseSegmentedComponent } from './segmented.component';
import { SynapseSegmentedItemComponent } from './segmented-item/segmented-item.component';

@Component({
  imports: [SynapseSegmentedComponent, SynapseSegmentedItemComponent],
  template: `
    <syn-segmented (valueChange)="picked.set($event)">
      @for (item of items(); track item) {
        <button syn-segmented-item [name]="item" [disabled]="item === 'c'">{{ item }}</button>
      }
    </syn-segmented>
  `,
})
class HostComponent {
  items = signal(['a', 'b', 'c']);
  picked = signal<string | number | null>(null);
}

describe('SynapseSegmentedComponent', () => {
  it('groups its items for assistive technology', async () => {
    const fixture = await setupComponent(HostComponent);
    const group = fixture.nativeElement.querySelector('syn-segmented') as HTMLElement;

    expect(group.getAttribute('role')).toBe('group');
  });

  it('selects the clicked item and deselects the rest', async () => {
    const fixture = await setupComponent(HostComponent);
    const [first, second] = fixture.nativeElement.querySelectorAll('button');

    first.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.picked()).toBe('a');
    expect(first.getAttribute('aria-pressed')).toBe('true');

    second.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.picked()).toBe('b');
    expect(first.getAttribute('aria-pressed')).toBe('false');
    expect(second.getAttribute('aria-pressed')).toBe('true');
  });

  it('ignores a disabled item', async () => {
    const fixture = await setupComponent(HostComponent);
    const disabled = fixture.nativeElement.querySelectorAll('button')[2];

    disabled.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.picked()).toBeNull();
  });

  it('emits once per click after the item set changes', async () => {
    const fixture = await setupComponent(HostComponent);
    let emissions = 0;
    fixture.nativeElement.querySelector('syn-segmented');
    const component = fixture.debugElement.children[0].componentInstance as SynapseSegmentedComponent;
    component.valueChange.subscribe(() => emissions++);

    fixture.componentInstance.items.set(['a', 'b', 'c', 'd']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    (fixture.nativeElement.querySelectorAll('button')[0] as HTMLElement).click();

    expect(emissions).toBe(1);
  });
});
