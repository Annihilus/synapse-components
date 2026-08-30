import { Component } from '@angular/core';
import { setupComponent } from '../../testing/setup';
import { SynapseDropdownItemComponent } from './dropdown-item.component';

@Component({
  imports: [SynapseDropdownItemComponent],
  template: `
    <div syn-dropdown-item [selected]="true" hint="⌘K" description="Secondary line">Label</div>
    <div syn-dropdown-item [disabled]="true" role="menuitem" icon="check">Disabled</div>
    <div syn-dropdown-item [checkbox]="true" [selected]="true">With checkbox</div>
  `,
})
class HostComponent {}

describe('SynapseDropdownItemComponent', () => {
  it('exposes the listbox option role and selection state', async () => {
    const fixture = await setupComponent(HostComponent);
    const [option] = fixture.nativeElement.querySelectorAll('[syn-dropdown-item]');

    expect(option.getAttribute('role')).toBe('option');
    expect(option.getAttribute('aria-selected')).toBe('true');
    expect(option.classList.contains('selected')).toBe(true);
    expect(option.getAttribute('tabindex')).toBe('0');
  });

  it('renders description and hint', async () => {
    const fixture = await setupComponent(HostComponent);
    const [option] = fixture.nativeElement.querySelectorAll('[syn-dropdown-item]');

    expect(option.querySelector('.description')?.textContent).toContain('Secondary line');
    expect(option.querySelector('.hint')?.textContent).toContain('⌘K');
  });

  it('drops out of the tab order and reports aria-disabled when disabled', async () => {
    const fixture = await setupComponent(HostComponent);
    const item = fixture.nativeElement.querySelectorAll('[syn-dropdown-item]')[1];

    expect(item.getAttribute('aria-disabled')).toBe('true');
    expect(item.getAttribute('tabindex')).toBe('-1');
    expect(item.classList.contains('disabled')).toBe(true);
  });

  it('omits aria-selected outside a listbox', async () => {
    const fixture = await setupComponent(HostComponent);
    const item = fixture.nativeElement.querySelectorAll('[syn-dropdown-item]')[1];

    expect(item.getAttribute('role')).toBe('menuitem');
    expect(item.getAttribute('aria-selected')).toBeNull();
  });

  it('shows a checkbox instead of the icon slot when asked', async () => {
    const fixture = await setupComponent(HostComponent);
    const item = fixture.nativeElement.querySelectorAll('[syn-dropdown-item]')[2];

    expect(item.querySelector('syn-checkbox')).toBeTruthy();
    expect(item.querySelector('.icon_placeholder')).toBeNull();
  });
});
