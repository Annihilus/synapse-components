import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { setupComponent } from '../../testing/setup';
import { SynapseToggleComponent } from './toggle.component';

@Component({
  imports: [SynapseToggleComponent, ReactiveFormsModule],
  template: `<syn-toggle [formControl]="control" (changeValue)="last = $event" />`,
})
class FormHostComponent {
  control = new FormControl(false);
  last: boolean | null = null;
}

@Component({
  imports: [SynapseToggleComponent],
  template: `<syn-toggle [disabled]="disabled" />`,
})
class PlainHostComponent {
  disabled = true;
}

describe('SynapseToggleComponent', () => {
  it('keeps the native input in the tab order', async () => {
    const fixture = await setupComponent(SynapseToggleComponent);
    const input = fixture.nativeElement.querySelector('.hidden-checkbox') as HTMLInputElement;

    expect(input.style.display).not.toBe('none');
  });

  it('reads the bound form value', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const host = fixture.nativeElement.querySelector('syn-toggle') as HTMLElement;

    fixture.componentInstance.control.setValue(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.classList.contains('checked')).toBe(true);
  });

  it('writes back to the form and emits changeValue', async () => {
    const fixture = await setupComponent(FormHostComponent);

    (fixture.nativeElement.querySelector('syn-toggle') as HTMLElement).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.control.value).toBe(true);
    expect(fixture.componentInstance.last).toBe(true);
  });

  it('tracks focus and marks the control touched on blur', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const host = fixture.nativeElement.querySelector('syn-toggle') as HTMLElement;
    const input = fixture.nativeElement.querySelector('.hidden-checkbox') as HTMLInputElement;

    input.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(host.classList.contains('focus')).toBe(true);

    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(host.classList.contains('focus')).toBe(false);
    expect(fixture.componentInstance.control.touched).toBe(true);
  });

  it('takes its disabled state from the form', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const host = fixture.nativeElement.querySelector('syn-toggle') as HTMLElement;

    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.classList.contains('disabled')).toBe(true);
  });

  it('ignores host clicks while disabled through the input', async () => {
    const fixture = await setupComponent(PlainHostComponent);
    const host = fixture.nativeElement.querySelector('syn-toggle') as HTMLElement;

    host.click();
    fixture.detectChanges();

    expect(host.classList.contains('checked')).toBe(false);
  });

  it('does not double-toggle when the click came from the input', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const input = fixture.nativeElement.querySelector('.hidden-checkbox') as HTMLInputElement;

    input.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.control.value).toBe(true);
  });

  it('names the switch from [description]', async () => {
    const fixture = await setupComponent(SynapseToggleComponent);
    const input = fixture.nativeElement.querySelector('.hidden-checkbox') as HTMLInputElement;

    expect(input.getAttribute('aria-label')).toBeNull();

    fixture.componentRef.setInput('description', 'Dark theme');
    fixture.detectChanges();

    expect(input.getAttribute('aria-label')).toBe('Dark theme');
  });
});
