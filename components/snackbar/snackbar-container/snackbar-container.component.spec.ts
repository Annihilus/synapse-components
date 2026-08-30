import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SynapseSnackbarContainerComponent } from './snackbar-container.component';
import { SynapseSnackbarService } from '../snackbar.service';

describe('SynapseSnackbarContainerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => {
    document.querySelectorAll('syn-snackbar-container').forEach(el => el.remove());
  });

  it('renders the service messages with stacking classes', () => {
    const service = TestBed.inject(SynapseSnackbarService);
    service.clear();
    for (const title of ['a', 'b', 'c', 'd']) {
      service.show(title, title, 'default', 0);
    }

    const fixture = TestBed.createComponent(SynapseSnackbarContainerComponent);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('syn-snackbar');
    expect(items.length).toBe(4);
    expect(items[0].classList.contains('snackbar-front')).toBe(true);
    expect(items[1].classList.contains('snackbar-middle')).toBe(true);
    expect(items[2].classList.contains('snackbar-back')).toBe(true);
    expect(items[3].classList.contains('snackbar-hidden')).toBe(true);
  });

  it('forwards a dismiss to the service', () => {
    const service = TestBed.inject(SynapseSnackbarService);
    service.clear();
    service.show('only', 'only', 'default', 0);

    const fixture = TestBed.createComponent(SynapseSnackbarContainerComponent);
    fixture.detectChanges();

    const close = fixture.nativeElement.querySelector('syn-snackbar button') as HTMLElement;
    close.click();
    fixture.detectChanges();

    expect(service.messages$().length).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('syn-snackbar').length).toBe(0);
  });
});
