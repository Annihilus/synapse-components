import { setupComponent } from '../../testing/setup';
import { SynapseSnackbarComponent } from './snackbar.component';

describe('SynapseSnackbarComponent', () => {
  it('renders the title and message', async () => {
    const fixture = await setupComponent(SynapseSnackbarComponent);
    fixture.componentRef.setInput('title', 'Saved');
    fixture.componentRef.setInput('message', 'The profile has been updated');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.title')?.textContent).toContain('Saved');
    expect(fixture.nativeElement.querySelector('.message')?.textContent)
      .toContain('The profile has been updated');
  });

  it('omits the message line when empty', async () => {
    const fixture = await setupComponent(SynapseSnackbarComponent);

    expect(fixture.nativeElement.querySelector('.message')).toBeNull();
  });

  it('picks the icon from the type', async () => {
    const fixture = await setupComponent(SynapseSnackbarComponent);
    expect(fixture.componentInstance.icon()).toBe('info');

    for (const [type, icon] of [
      ['success', 'approve'],
      ['warning', 'alert_triangle'],
      ['error', 'alert_circle'],
      ['default', 'info'],
    ] as const) {
      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();

      expect(fixture.componentInstance.icon()).toBe(icon);
      expect((fixture.nativeElement as HTMLElement).className).toContain(`type-${type}`);
    }
  });

  it('is announced politely and emits dismiss', async () => {
    const fixture = await setupComponent(SynapseSnackbarComponent);
    const host = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('role')).toBe('status');
    expect(host.getAttribute('aria-live')).toBe('polite');

    let dismissed = 0;
    fixture.componentInstance.dismiss.subscribe(() => dismissed++);

    (host.querySelector('button') as HTMLElement).click();
    expect(dismissed).toBe(1);
  });

  it('falls back to the default icon for an unknown type', async () => {
    const fixture = await setupComponent(SynapseSnackbarComponent);
    fixture.componentRef.setInput('type', 'unknown');
    fixture.detectChanges();

    expect(fixture.componentInstance.icon()).toBe('info');
  });
});
