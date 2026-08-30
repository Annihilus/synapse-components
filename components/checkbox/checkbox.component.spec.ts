import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { setupComponent } from '../../testing/setup';
import { SynapseCheckboxComponent } from './checkbox.component';

@Component({
  imports: [SynapseCheckboxComponent, ReactiveFormsModule],
  template: `<syn-checkbox [formControl]="control" (changeChecked)="last = $event" />`,
})
class FormHostComponent {
  control = new FormControl(false);
  last: boolean | null = null;
}

@Component({
  imports: [SynapseCheckboxComponent],
  template: `<syn-checkbox [indeterminate]="true" [disabled]="disabled" />`,
})
class PlainHostComponent {
  disabled = false;
}

describe('SynapseCheckboxComponent', () => {
  it('keeps the native input in the tab order', async () => {
    const fixture = await setupComponent(SynapseCheckboxComponent);
    const input = fixture.nativeElement.querySelector('.hidden-checkbox') as HTMLInputElement;

    expect(input.style.display).not.toBe('none');
  });

  it('reads the bound form value', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const host = fixture.nativeElement.querySelector('syn-checkbox') as HTMLElement;

    fixture.componentInstance.control.setValue(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.classList.contains('checked')).toBe(true);
  });

  it('writes back to the form and emits changeChecked', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const host = fixture.nativeElement.querySelector('syn-checkbox') as HTMLElement;

    host.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.control.value).toBe(true);
    expect(fixture.componentInstance.last).toBe(true);
  });

  it('marks the control touched on blur', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const input = fixture.nativeElement.querySelector('.hidden-checkbox') as HTMLInputElement;

    expect(fixture.componentInstance.control.touched).toBe(false);

    input.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('syn-checkbox') as HTMLElement).classList.contains('focus')).toBe(true);

    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.touched).toBe(true);
  });

  it('clears the indeterminate state once the user toggles', async () => {
    const fixture = await setupComponent(PlainHostComponent);
    const host = fixture.nativeElement.querySelector('syn-checkbox') as HTMLElement;

    expect(host.classList.contains('indeterminate')).toBe(true);

    host.click();
    fixture.detectChanges();

    expect(host.classList.contains('indeterminate')).toBe(false);
  });

  it('ignores host clicks while disabled', async () => {
    const fixture = await setupComponent(PlainHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('syn-checkbox') as HTMLElement;
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
});
