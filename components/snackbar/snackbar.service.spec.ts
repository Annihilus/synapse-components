import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SynapseSnackbarService } from './snackbar.service';

describe('SynapseSnackbarService', () => {
  let service: SynapseSnackbarService;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SynapseSnackbarService);
  });

  afterEach(() => {
    service.destroy();
    jest.useRealTimers();
    document.querySelectorAll('syn-snackbar-container').forEach(el => el.remove());
  });

  it('mounts a container on the first message and reuses it', () => {
    service.show('First', 'a');
    service.show('Second', 'b');

    expect(document.querySelectorAll('syn-snackbar-container').length).toBe(1);
    expect(service.messages$().length).toBe(2);
  });

  it('puts the newest message first', () => {
    service.show('First', 'a');
    service.show('Second', 'b');

    expect(service.messages$()[0].title).toBe('Second');
  });

  it('auto-dismisses after five seconds by default', () => {
    service.show('Title', 'Body');
    expect(service.messages$().length).toBe(1);

    jest.advanceTimersByTime(4999);
    expect(service.messages$().length).toBe(1);

    jest.advanceTimersByTime(2);
    expect(service.messages$().length).toBe(0);
  });

  it('keeps a message with a non-positive duration', () => {
    service.show('Sticky', 'stays', 'error', 0);

    jest.advanceTimersByTime(60_000);

    expect(service.messages$().length).toBe(1);
  });

  it('clears the timer on a manual dismiss', () => {
    // zone.js schedules timers of its own, so the count is not a reliable
    // signal; assert on the release itself.
    const clearSpy = jest.spyOn(globalThis, 'clearTimeout');
    service.show('A', 'a');
    const id = service.messages$()[0].id;

    service.dismiss(id);

    expect(service.messages$().length).toBe(0);
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it('ignores a dismiss for an unknown id', () => {
    service.show('A', 'a');

    expect(() => service.dismiss('nope')).not.toThrow();
    expect(service.messages$().length).toBe(1);
  });

  it('drops every message and timer on clear', () => {
    const clearSpy = jest.spyOn(globalThis, 'clearTimeout');
    service.show('A', 'a');
    service.show('B', 'b');

    service.clear();

    expect(service.messages$().length).toBe(0);
    expect(clearSpy).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(10_000);
    expect(service.messages$().length).toBe(0);
    clearSpy.mockRestore();
  });

  it('tears the container down on destroy and can mount it again', () => {
    service.show('A', 'a');
    service.destroy();

    expect(document.querySelectorAll('syn-snackbar-container').length).toBe(0);

    service.show('B', 'b');
    expect(document.querySelectorAll('syn-snackbar-container').length).toBe(1);
  });

  it('is a no-op when destroyed twice', () => {
    service.show('A', 'a');
    service.destroy();

    expect(() => service.destroy()).not.toThrow();
  });
});
