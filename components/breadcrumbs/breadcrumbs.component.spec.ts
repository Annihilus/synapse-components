import { Component } from '@angular/core';
import { setupComponent } from '../../testing/setup';
import {
  SynapseBreadcrumbsComponent,
  SynapseBreadcrumbsItemComponent,
  SynapseBreadcrumbsSeparatorComponent,
} from './index';

@Component({
  imports: [
    SynapseBreadcrumbsComponent,
    SynapseBreadcrumbsItemComponent,
    SynapseBreadcrumbsSeparatorComponent,
  ],
  template: `
    <syn-breadcrumbs>
      <syn-breadcrumbs-item>Home</syn-breadcrumbs-item>
      <syn-breadcrumbs-separator />
      <a class="custom" href="/x">Custom node</a>
      <syn-breadcrumbs-separator />
      <syn-breadcrumbs-item [selected]="true">Current</syn-breadcrumbs-item>
    </syn-breadcrumbs>
  `,
})
class HostComponent {}

describe('SynapseBreadcrumbsComponent', () => {
  it('projects arbitrary content, including foreign elements', async () => {
    const fixture = await setupComponent(HostComponent);
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelectorAll('syn-breadcrumbs-item').length).toBe(2);
    expect(host.querySelector('.custom')?.textContent).toBe('Custom node');
    expect(host.textContent).toContain('Home');
    expect(host.textContent).not.toContain('Base');
  });

  it('marks the current crumb as selected', async () => {
    const fixture = await setupComponent(HostComponent);
    const items = fixture.nativeElement.querySelectorAll('syn-breadcrumbs-item');

    expect(items[0].classList.contains('selected')).toBe(false);
    expect(items[1].classList.contains('selected')).toBe(true);
  });

  it('hides separators from screen readers', async () => {
    const fixture = await setupComponent(HostComponent);
    const separators = fixture.nativeElement.querySelectorAll('syn-breadcrumbs-separator');

    expect(separators.length).toBe(2);
    separators.forEach((s: HTMLElement) => expect(s.getAttribute('aria-hidden')).toBe('true'));
  });
});
