import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { setupComponent } from '../../testing/setup';
import { SynapseInputComponent } from './input.component';

@Component({
  imports: [SynapseInputComponent, ReactiveFormsModule],
  template: `<syn-input [formControl]="control" label="Name" [error]="'Required field'" />`,
})
class HostComponent {
  control = new FormControl('', [Validators.required]);
}

@Component({
  imports: [SynapseInputComponent, ReactiveFormsModule],
  template: `<syn-input [formControl]="control" [inline]="true" label="Hidden" placeholder="Type" />`,
})
class InlineHostComponent {
  control = new FormControl('');
}

@Component({
  imports: [SynapseInputComponent],
  template: `<syn-input placeholder="Type" [value]="value" />`,
})
class PlainHostComponent {
  value: string | undefined = undefined;
}

describe('SynapseInputComponent', () => {
  it('pushes the initial form value into the field', async () => {
    const fixture = await setupComponent(HostComponent);
    fixture.componentInstance.control.setValue('Alex');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('Alex');
  });

  it('hides the error until the field is touched', async () => {
    const fixture = await setupComponent(HostComponent);
    const host = fixture.nativeElement.querySelector('syn-input') as HTMLElement;

    expect(host.classList.contains('error')).toBe(false);
    expect(fixture.nativeElement.querySelector('.hint')).toBeNull();
  });

  it('shows the error after blurring an invalid field', async () => {
    const fixture = await setupComponent(HostComponent);
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('syn-input') as HTMLElement;
    expect(host.classList.contains('error')).toBe(true);
    expect(fixture.nativeElement.querySelector('.hint')?.textContent).toContain('Required field');
  });

  it('tracks focus, rewinding the scroll on blur, and pressed state', async () => {
    const fixture = await setupComponent(HostComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('syn-input') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(host.classList.contains('focus')).toBe(true);

    input.scrollLeft = 40;
    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(host.classList.contains('focus')).toBe(false);
    expect(input.scrollLeft).toBe(0);

    input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.detectChanges();
    expect(host.classList.contains('active')).toBe(true);

    input.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    fixture.detectChanges();
    expect(host.classList.contains('active')).toBe(false);
  });

  it('sizes the inline variant from the placeholder until a value arrives', async () => {
    const fixture = await setupComponent(InlineHostComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('syn-input') as HTMLElement;
    expect(host.classList.contains('inline')).toBe(true);
    expect(host.querySelector('label')).toBeNull();
    expect(host.querySelectorAll('.sizer').length).toBe(2);

    fixture.componentInstance.control.setValue('typed');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.querySelectorAll('.sizer').length).toBe(1);
  });

  it('shows the placeholder sizer until a value arrives', async () => {
    const fixture = await setupComponent(PlainHostComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.sizer').length).toBe(2);

    fixture.componentInstance.value = 'typed';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.sizer').length).toBe(1);
  });
});
