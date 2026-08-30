import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { setupComponent } from '../../testing/setup';
import { SynapseControlDirective } from './control.directive';

@Component({
  selector: 'syn-test-field',
  template: '<input #el />',
  hostDirectives: [{
    directive: SynapseControlDirective,
    inputs: ['value', 'error', 'disabled'],
    outputs: ['valueChanged'],
  }],
})
class FieldComponent {
  readonly control = inject(SynapseControlDirective<string>);
}

@Component({
  imports: [FieldComponent, ReactiveFormsModule],
  template: `<syn-test-field [formControl]="form" />`,
})
class FormHostComponent {
  form = new FormControl('');
}

@Component({
  imports: [FieldComponent],
  template: `<syn-test-field [value]="value" [error]="error" [disabled]="disabled" />`,
})
class PlainHostComponent {
  value: string | undefined = undefined;
  error: boolean | string | string[] = false;
  disabled = false;
}

interface Range { from: number; to: number }

@Component({
  selector: 'syn-test-range',
  template: '',
  hostDirectives: [{ directive: SynapseControlDirective, inputs: ['value'] }],
})
class RangeComponent {
  readonly control = inject(SynapseControlDirective<Range>);
}

@Component({
  imports: [RangeComponent],
  template: `<syn-test-range />`,
})
class RangeHostComponent {}

const directiveOf = (fixture: { debugElement: { children: { componentInstance: FieldComponent }[] } }) =>
  fixture.debugElement.children[0].componentInstance.control;

describe('SynapseControlDirective', () => {
  it('reports no control when used outside a form', async () => {
    const fixture = await setupComponent(PlainHostComponent);

    expect(directiveOf(fixture).control()).toBeNull();
  });

  it('resolves the bound control from NgControl', async () => {
    const fixture = await setupComponent(FormHostComponent);

    expect(directiveOf(fixture).control()).toBe(fixture.componentInstance.form);
  });

  it('normalises errors passed as a boolean, a string or a list', async () => {
    const fixture = await setupComponent(PlainHostComponent);
    const control = directiveOf(fixture);

    expect(control.errorList()).toEqual([]);
    expect(control.invalid()).toBe(false);

    fixture.componentInstance.error = 'Required';
    fixture.detectChanges();
    expect(control.errorList()).toEqual(['Required']);
    expect(control.invalid()).toBe(true);
    expect(control.showError()).toBe(true);

    fixture.componentInstance.error = ['One', 'Two'];
    fixture.detectChanges();
    expect(control.errorList()).toEqual(['One', 'Two']);

    fixture.componentInstance.error = true;
    fixture.detectChanges();
    expect(control.errorList()).toEqual([]);
    expect(control.invalid()).toBe(true);

    fixture.componentInstance.error = '';
    fixture.detectChanges();
    expect(control.errorList()).toEqual([]);
    expect(control.invalid()).toBe(false);
  });

  it('derives the filled state from strings, arrays and plain values', async () => {
    const fixture = await setupComponent(PlainHostComponent);
    const control = directiveOf(fixture);

    expect(control.filled()).toBe(false);

    fixture.componentInstance.value = 'text';
    fixture.detectChanges();
    expect(control.filled()).toBe(true);

    fixture.componentInstance.value = '';
    fixture.detectChanges();
    expect(control.filled()).toBe(false);
  });

  it('lets a form disable win over the input', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const control = directiveOf(fixture);

    expect(control.disabled()).toBe(false);

    fixture.componentInstance.form.disable();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(control.disabled()).toBe(true);
  });

  it('takes the disabled input when no form is bound', async () => {
    const fixture = await setupComponent(PlainHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    expect(directiveOf(fixture).disabled()).toBe(true);
  });

  it('only shows a form error once the control has been touched', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const control = directiveOf(fixture);
    fixture.componentInstance.form.setValidators(() => ({ required: true }));
    fixture.componentInstance.form.updateValueAndValidity();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(control.invalid()).toBe(true);
    expect(control.showError()).toBe(false);

    control.markTouched();
    fixture.detectChanges();

    expect(control.touched()).toBe(true);
    expect(control.showError()).toBe(true);
    expect(fixture.componentInstance.form.touched).toBe(true);
  });

  it('pushes setValue into the form and out through valueChanged', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const control = directiveOf(fixture);
    const seen: (string | undefined)[] = [];
    control.valueChanged.subscribe(v => seen.push(v));

    control.setValue('typed');
    await fixture.whenStable();

    expect(fixture.componentInstance.form.value).toBe('typed');
    expect(control.current()).toBe('typed');
    expect(seen).toEqual(['typed']);
  });

  it('takes values from a registered source stream', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const control = directiveOf(fixture);
    const source = new Subject<string>();

    control.registerSource(source);

    source.next('from stream');
    await fixture.whenStable();

    expect(control.current()).toBe('from stream');
    expect(fixture.componentInstance.form.value).toBe('from stream');
  });

  it('is not tied to strings: a composite value round-trips', async () => {
    const fixture = await setupComponent(RangeHostComponent);
    const control = fixture.debugElement.children[0].componentInstance.control;
    const source = new Subject<{ from: number; to: number }>();

    control.registerSource(source);
    source.next({ from: 2, to: 8 });
    await fixture.whenStable();

    expect(control.current()).toEqual({ from: 2, to: 8 });
    expect(control.filled()).toBe(true);
  });

  it('works standalone, with no form callbacks registered', async () => {
    const fixture = await setupComponent(PlainHostComponent);
    const control = directiveOf(fixture);

    expect(() => control.setValue('typed')).not.toThrow();
    expect(() => control.markTouched()).not.toThrow();

    expect(control.current()).toBe('typed');
    expect(control.touched()).toBe(true);
  });
});
