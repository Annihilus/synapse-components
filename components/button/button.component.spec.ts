import { Component, signal } from '@angular/core';
import { setupComponent } from '../../testing/setup';
import { SynapseButtonComponent } from './button.component';
import { SynapseIconComponent } from '../icon/icon.component';

@Component({
  imports: [SynapseButtonComponent, SynapseIconComponent],
  template: `
    <button syn-button [loading]="loading()">
      <syn-icon name="check" />
      Save
    </button>
  `,
})
class HostComponent {
  loading = signal(false);
}

@Component({
  imports: [SynapseButtonComponent, SynapseIconComponent],
  template: `<button syn-button><syn-icon name="check" /></button>`,
})
class IconOnlyComponent {}

@Component({
  imports: [SynapseButtonComponent, SynapseIconComponent],
  template: `<button syn-button>Save<syn-icon name="check" /></button>`,
})
class TrailingIconComponent {}

@Component({
  imports: [SynapseButtonComponent],
  template: `<button syn-button colorType="danger" size="l">Plain</button>`,
})
class PlainComponent {}

@Component({
  imports: [SynapseButtonComponent, SynapseIconComponent],
  template: `<button syn-button><syn-icon name="check" />Save</button>`,
})
class LeadingIconComponent {}

describe('SynapseButtonComponent', () => {
  it('moves the projected icon into the .icon slot', async () => {
    const fixture = await setupComponent(HostComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('div.icon') as HTMLElement;
    expect(container?.querySelector('syn-icon')).toBeTruthy();
  });

  it('puts the icon back in its slot after a loading toggle', async () => {
    const fixture = await setupComponent(HostComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.loading.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('div.icon') as HTMLElement;
    expect(container?.querySelector('syn-icon')).toBeTruthy();
  });

  it('marks an icon-only button', async () => {
    const fixture = await setupComponent(IconOnlyComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.classList.contains('icon')).toBe(true);
    expect(button.classList.contains('icon-left')).toBe(false);
    expect(button.classList.contains('icon-right')).toBe(false);
  });

  it('detects a trailing icon', async () => {
    const fixture = await setupComponent(TrailingIconComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.className).toContain('icon-right');
  });

  it('carries the size and colour modifiers and no icon class', async () => {
    const fixture = await setupComponent(PlainComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.className).toContain('syn-button');
    expect(button.className).toContain('colorType-danger');
    expect(button.className).toContain('size-l');
    expect(button.querySelector('div.icon')).toBeNull();
  });

  it('reflects the disabled input on the host', async () => {
    const fixture = await setupComponent(PlainComponent);
    const button = fixture.debugElement.children[0];
    button.componentInstance.disabled = () => true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });

  it('detects a leading icon', async () => {
    const fixture = await setupComponent(LeadingIconComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.className).toContain('icon-left');
  });
});
