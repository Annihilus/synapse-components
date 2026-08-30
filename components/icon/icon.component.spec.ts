import { HttpTestingController } from '@angular/common/http/testing';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { setupComponent } from '../../testing/setup';
import { SYNAPSE_ICON_BASE_PATH, SynapseIconComponent } from './icon.component';

@Component({
  imports: [SynapseIconComponent],
  template: `<syn-icon name="check" /><syn-icon name="check" /><syn-icon name="check" />`,
})
class ThreeIconsComponent {}

@Component({
  imports: [SynapseIconComponent],
  template: `<syn-icon [name]="name()" />`,
})
class SwitchingIconComponent {
  name = signal('close');
}

const iconEl = (fixture: { nativeElement: HTMLElement }) =>
  fixture.nativeElement.querySelector('syn-icon') as HTMLElement;

describe('SynapseIconComponent', () => {
  it('caches by url: three identical icons issue one request', async () => {
    await setupComponent(ThreeIconsComponent);

    expect(TestBed.inject(HttpTestingController).match('/icons/check.svg').length).toBe(1);
  });

  it('honours SYNAPSE_ICON_BASE_PATH', async () => {
    const fixture = await setupComponent(SwitchingIconComponent, [
      { provide: SYNAPSE_ICON_BASE_PATH, useValue: '/assets/svg' },
    ]);
    void fixture;

    expect(TestBed.inject(HttpTestingController).match('/assets/svg/close.svg').length).toBe(1);
  });

  it('renders the fetched svg with currentColor', async () => {
    const fixture = await setupComponent(SwitchingIconComponent);
    const http = TestBed.inject(HttpTestingController);

    http.expectOne('/icons/close.svg').flush('<svg viewBox="0 0 16 16"><path/></svg>');
    fixture.detectChanges();

    const html = iconEl(fixture).innerHTML;
    expect(html).toContain('fill="currentColor"');
    expect(html).toContain('<path');
  });

  it('swaps the icon when the name changes', async () => {
    const fixture = await setupComponent(SwitchingIconComponent);
    const http = TestBed.inject(HttpTestingController);

    http.expectOne('/icons/close.svg').flush('<svg id="a"></svg>');
    fixture.detectChanges();

    fixture.componentInstance.name.set('search');
    fixture.detectChanges();

    http.expectOne('/icons/search.svg').flush('<svg id="b"></svg>');
    fixture.detectChanges();

    expect(iconEl(fixture).innerHTML).toContain('id="b"');
  });

  it('renders nothing when the name is empty', async () => {
    const fixture = await setupComponent(SwitchingIconComponent);
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/icons/close.svg').flush('<svg id="a"></svg>');

    fixture.componentInstance.name.set('');
    fixture.detectChanges();

    expect(iconEl(fixture).innerHTML).toBe('');
  });

  it('survives a missing icon file', async () => {
    const fixture = await setupComponent(SwitchingIconComponent);
    const http = TestBed.inject(HttpTestingController);

    http.expectOne('/icons/close.svg')
      .flush('not found', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    expect(iconEl(fixture).innerHTML).toBe('');
  });
});
