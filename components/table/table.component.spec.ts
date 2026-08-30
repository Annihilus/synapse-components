import { setupComponent } from '../../testing/setup';
import { SynapseTableComponent } from './table.component';

describe('SynapseTableComponent', () => {
  it('starts empty and announces itself as a table', async () => {
    const fixture = await setupComponent(SynapseTableComponent);

    expect((fixture.nativeElement as HTMLElement).getAttribute('role')).toBe('table');
    expect(fixture.nativeElement.querySelectorAll('.table-cell').length).toBe(0);
  });

  it('renders headers and rows', async () => {
    const fixture = await setupComponent(SynapseTableComponent);
    fixture.componentRef.setInput('data', {
      headers: ['Name', 'Count'],
      rows: [['first', 1], ['second', 2]],
    });
    fixture.detectChanges();

    const headers = fixture.nativeElement.querySelectorAll('.table-header-cell');
    expect(headers.length).toBe(2);
    expect(headers[0].textContent).toContain('Name');
    expect(fixture.nativeElement.querySelectorAll('.row').length).toBe(2);
  });

  it('renders duplicate cells and headers without a tracking collision', async () => {
    const fixture = await setupComponent(SynapseTableComponent);

    expect(() => {
      fixture.componentRef.setInput('data', {
        headers: ['Name', 'Name'],
        rows: [['same', 'same'], ['same', 'same']],
      });
      fixture.detectChanges();
    }).not.toThrow();

    expect(fixture.nativeElement.querySelectorAll('.table-cell').length).toBe(4);
  });
});
