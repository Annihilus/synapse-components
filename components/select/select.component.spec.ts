import { Component, signal } from '@angular/core';
import { setupComponent } from '../../testing/setup';
import { SynapseSelectComponent } from './select.component';

interface Option { id: number; label: string }

@Component({
  imports: [SynapseSelectComponent],
  template: `
    <syn-select
      [items]="items()"
      [canClear]="true"
      [hideSelected]="false"
      [displayWith]="display"
      [disabledFn]="isDisabled"
      (valueChanged)="picked.set($event)"
      (cleared)="clearedCount.set(clearedCount() + 1)"
    />
  `,
})
class HostComponent {
  items = signal<Option[]>([
    { id: 1, label: 'First' },
    { id: 2, label: 'Second (disabled)' },
  ]);
  picked = signal<Option | null>(null);
  clearedCount = signal(0);

  display = (item: Option) => item.label;
  isDisabled = (item: Option) => item.id === 2;
}

@Component({
  imports: [SynapseSelectComponent],
  template: `<syn-select [items]="items" [displayWith]="display" />`,
})
class HideSelectedHostComponent {
  items: Option[] = [{ id: 1, label: 'First' }, { id: 2, label: 'Second' }];
  display = (item: Option) => item.label;
}

@Component({
  imports: [SynapseSelectComponent],
  template: `<syn-select [items]="items" [hideSelected]="false" />`,
})
class DefaultsHostComponent {
  items = ['alpha', 'beta'];
}

@Component({
  imports: [SynapseSelectComponent],
  template: `<syn-select [items]="[]" label="Pick one" hint="Helper" icon="search" />`,
})
class DecoratedHostComponent {}

async function openDropdown(fixture: Awaited<ReturnType<typeof setupComponent<HostComponent>>>) {
  const trigger = fixture.nativeElement.querySelector('.select') as HTMLElement;
  trigger.click();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('SynapseSelectComponent', () => {
  it('gives the trigger a combobox role and keyboard focus', async () => {
    const fixture = await setupComponent(HostComponent);
    const trigger = fixture.nativeElement.querySelector('.select') as HTMLElement;

    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('tabindex')).toBe('0');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('refuses to select a disabled option', async () => {
    const fixture = await setupComponent(HostComponent);
    await openDropdown(fixture);

    const options = document.querySelectorAll('.option');
    expect(options.length).toBe(2);
    expect(options[1].classList.contains('disabled')).toBe(true);
    expect(options[1].getAttribute('aria-disabled')).toBe('true');

    (options[1] as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.picked()).toBeNull();
  });

  it('selects an enabled option', async () => {
    const fixture = await setupComponent(HostComponent);
    await openDropdown(fixture);

    (document.querySelectorAll('.option')[0] as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.picked()?.id).toBe(1);
  });

  it('reports clearing through its own cleared event', async () => {
    const fixture = await setupComponent(HostComponent);
    await openDropdown(fixture);
    (document.querySelectorAll('.option')[0] as HTMLElement).click();
    fixture.detectChanges();

    const reset = fixture.nativeElement.querySelector('.reset') as HTMLElement;
    expect(reset).toBeTruthy();

    reset.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.clearedCount()).toBe(1);
    expect(fixture.componentInstance.picked()?.id).toBe(1);
  });

  it('hides the selected option by default', async () => {
    const fixture = await setupComponent(HideSelectedHostComponent);
    const trigger = fixture.nativeElement.querySelector('.select') as HTMLElement;

    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(document.querySelectorAll('.option').length).toBe(2);

    (document.querySelectorAll('.option')[0] as HTMLElement).click();
    fixture.detectChanges();

    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelectorAll('.option').length).toBe(1);
  });

  it('opens from the keyboard', async () => {
    const fixture = await setupComponent(HostComponent);
    const trigger = fixture.nativeElement.querySelector('.select') as HTMLElement;

    for (const key of ['Enter', ' ', 'ArrowDown']) {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(document.querySelector('syn-popover-panel')).toBeTruthy();

      document.body.click();
      fixture.detectChanges();
    }
  });

  it('falls back to String() and identity comparison by default', async () => {
    const fixture = await setupComponent(DefaultsHostComponent);
    const trigger = fixture.nativeElement.querySelector('.select') as HTMLElement;

    expect(trigger.textContent).toContain('Select an option');

    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelectorAll('.option')[0].textContent).toContain('alpha');

    (document.querySelectorAll('.option')[0] as HTMLElement).click();
    fixture.detectChanges();

    expect(trigger.textContent).toContain('alpha');
  });

  it('renders the label, hint and leading icon', async () => {
    const fixture = await setupComponent(DecoratedHostComponent);
    const host = fixture.nativeElement as HTMLElement;

    const label = host.querySelector('.label');
    const trigger = host.querySelector('.select');
    expect(label?.textContent).toContain('Pick one');
    expect(trigger?.getAttribute('aria-labelledby')).toBe(label?.id);
    expect(host.querySelector('.hint')?.textContent).toContain('Helper');
    expect(host.querySelector('syn-icon.icon')).toBeTruthy();
  });
});
