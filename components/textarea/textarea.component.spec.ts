import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { setupComponent } from '../../testing/setup';
import { SynapseTextareaComponent } from './textarea.component';

@Component({
  imports: [SynapseTextareaComponent, ReactiveFormsModule],
  template: `<syn-textarea [formControl]="control" label="Description" />`,
})
class HostComponent {
  control = new FormControl('start');
}

@Component({
  imports: [SynapseTextareaComponent],
  template: `<syn-textarea [error]="['Too short', 'Not unique']" />`,
})
class PlainErrorHostComponent {}

describe('SynapseTextareaComponent', () => {
  it('updates the field when the form value changes', async () => {
    const fixture = await setupComponent(HostComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('start');

    fixture.componentInstance.control.setValue('updated');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(textarea.value).toBe('updated');
  });

  it('pushes user input into the form', async () => {
    const fixture = await setupComponent(HostComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'typed';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.control.value).toBe('typed');
  });

  it('tracks focus and pressed state', async () => {
    const fixture = await setupComponent(HostComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('syn-textarea') as HTMLElement;
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    textarea.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(host.classList.contains('focus')).toBe(true);

    textarea.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(host.classList.contains('focus')).toBe(false);

    textarea.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.detectChanges();
    expect(host.classList.contains('active')).toBe(true);

    textarea.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    fixture.detectChanges();
    expect(host.classList.contains('active')).toBe(false);
  });

  it('renders the label and marks it required', async () => {
    const fixture = await setupComponent(HostComponent);

    expect(fixture.nativeElement.querySelector('label')?.textContent).toContain('Description');
  });

  it('joins several direct errors into the hint', async () => {
    const fixture = await setupComponent(PlainErrorHostComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.hint')?.textContent)
      .toContain('Too short, Not unique');
  });
});
