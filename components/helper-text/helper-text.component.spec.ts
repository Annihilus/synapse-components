import { setupComponent } from '../../testing/setup';
import { SynapseHelperTextComponent } from './helper-text.component';

describe('SynapseHelperTextComponent', () => {
  it('renders no icon unless asked', async () => {
    const fixture = await setupComponent(SynapseHelperTextComponent);

    expect(fixture.nativeElement.querySelector('syn-icon')).toBeNull();
    expect((fixture.nativeElement as HTMLElement).className).toContain('type-info');
  });

  it('picks the icon from the type', async () => {
    const fixture = await setupComponent(SynapseHelperTextComponent);
    fixture.componentRef.setInput('icon', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('syn-icon.icon')).toBeTruthy();

    for (const [type, icon] of [
      ['info', 'info'],
      ['success', 'approve'],
      ['warning', 'alert_triangle'],
      ['error', 'alert_circle'],
    ] as const) {
      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();

      expect((fixture.nativeElement as HTMLElement).className).toContain(`type-${type}`);
      expect(fixture.componentInstance['iconName']()).toBe(icon);
    }
  });

  it('renders the title and description', async () => {
    const fixture = await setupComponent(SynapseHelperTextComponent);
    fixture.componentRef.setInput('title', 'Heads up');
    fixture.componentRef.setInput('description', 'Something to know');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.title')?.textContent).toContain('Heads up');
    expect(fixture.nativeElement.textContent).toContain('Something to know');
  });

  it('emits closed from the close button', async () => {
    const fixture = await setupComponent(SynapseHelperTextComponent);
    fixture.componentRef.setInput('canBeClosed', true);
    fixture.detectChanges();

    let closed = 0;
    fixture.componentInstance.closed.subscribe(() => closed++);

    (fixture.nativeElement.querySelector('.close') as HTMLElement).click();
    expect(closed).toBe(1);
  });

  it('falls back to the info icon for an unknown type', async () => {
    const fixture = await setupComponent(SynapseHelperTextComponent);
    fixture.componentRef.setInput('type', 'unknown');
    fixture.detectChanges();

    expect(fixture.componentInstance['iconName']()).toBe('info');
  });
});
