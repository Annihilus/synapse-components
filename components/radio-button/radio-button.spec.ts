import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { setupComponent } from '../../testing/setup';
import { SynapseRadioGroupComponent } from './radio-group/radio-group.component';
import { SynapseRadioButtonComponent } from './radio-button/radio-button.component';

@Component({
  imports: [SynapseRadioGroupComponent, SynapseRadioButtonComponent, ReactiveFormsModule],
  template: `
    <syn-radio-group [formControl]="control">
      <syn-radio-button value="one" (focused)="focusEvents = focusEvents + 1" />
      <syn-radio-button value="two" />
      <syn-radio-button value="three" [disabled]="true" />
    </syn-radio-group>
  `,
})
class FormHostComponent {
  control = new FormControl<string | null>(null);
  focusEvents = 0;
}

interface Plan { id: number }

@Component({
  imports: [SynapseRadioGroupComponent, SynapseRadioButtonComponent],
  template: `
    <syn-radio-group [value]="picked" [compareWith]="sameId" (valueChanged)="picked = $event!">
      <syn-radio-button [value]="plans[0]" />
      <syn-radio-button [value]="plans[1]" />
    </syn-radio-group>
  `,
})
class ObjectHostComponent {
  plans: Plan[] = [{ id: 1 }, { id: 2 }];
  picked: Plan = { id: 2 };
  sameId = (a: Plan, b: Plan) => a.id === b.id;
}

@Component({
  imports: [SynapseRadioButtonComponent],
  template: `<syn-radio-button value="lonely" />`,
})
class StandaloneHostComponent {}

const buttons = (fixture: { nativeElement: HTMLElement }) =>
  Array.from(fixture.nativeElement.querySelectorAll('syn-radio-button')) as HTMLElement[];

const inputs = (fixture: { nativeElement: HTMLElement }) =>
  Array.from(fixture.nativeElement.querySelectorAll('.hidden-radio')) as HTMLInputElement[];

describe('SynapseRadioButtonComponent', () => {
  it('announces the group and keeps the native input focusable', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const group = fixture.nativeElement.querySelector('syn-radio-group') as HTMLElement;

    expect(group.getAttribute('role')).toBe('radiogroup');
    expect(inputs(fixture)[0].style.display).not.toBe('none');
  });

  it('groups the native inputs under one name, which is what gives arrow keys', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const names = inputs(fixture).map(input => input.getAttribute('name'));

    expect(names[0]).toMatch(/^syn-radio-group-\d+$/);
    expect(new Set(names).size).toBe(1);
  });

  it('writes the picked value into the form', async () => {
    const fixture = await setupComponent(FormHostComponent);

    buttons(fixture)[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.control.value).toBe('two');
  });

  it('reads the value back out of the form', async () => {
    const fixture = await setupComponent(FormHostComponent);

    fixture.componentInstance.control.setValue('three');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(buttons(fixture)[2].classList.contains('checked')).toBe(true);
    expect(buttons(fixture)[0].classList.contains('checked')).toBe(false);
  });

  it('selects exactly one button at a time', async () => {
    const fixture = await setupComponent(FormHostComponent);

    buttons(fixture)[0].click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.checked').length).toBe(1);

    buttons(fixture)[1].click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.checked').length).toBe(1);
    expect(buttons(fixture)[1].classList.contains('checked')).toBe(true);
  });

  it('ignores a disabled button', async () => {
    const fixture = await setupComponent(FormHostComponent);

    buttons(fixture)[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBeNull();
  });

  it('disables every button when the group control is disabled', async () => {
    const fixture = await setupComponent(FormHostComponent);

    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(buttons(fixture).every(b => b.classList.contains('disabled'))).toBe(true);
    expect(inputs(fixture).every(i => i.disabled)).toBe(true);
  });

  it('carries object values, matched through compareWith', async () => {
    const fixture = await setupComponent(ObjectHostComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(buttons(fixture)[1].classList.contains('checked')).toBe(true);

    buttons(fixture)[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.picked).toEqual({ id: 1 });
  });

  it('reports focus state', async () => {
    const fixture = await setupComponent(FormHostComponent);
    const input = inputs(fixture)[0];

    input.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(buttons(fixture)[0].classList.contains('focus')).toBe(true);
    expect(fixture.componentInstance.focusEvents).toBe(1);

    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(buttons(fixture)[0].classList.contains('focus')).toBe(false);
  });

  it('does not re-toggle when the click came from the input itself', async () => {
    const fixture = await setupComponent(FormHostComponent);

    inputs(fixture)[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.control.value).toBe('one');
  });

  it('renders standalone, outside any group, without crashing', async () => {
    const fixture = await setupComponent(StandaloneHostComponent);
    const input = inputs(fixture)[0];

    expect(input.getAttribute('name')).toBeNull();
    expect(() => buttons(fixture)[0].click()).not.toThrow();
  });
});
