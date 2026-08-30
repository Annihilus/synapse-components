import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Injectable,
  InjectionToken,
  inject,
  input,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  DomSanitizer,
  SafeHtml,
} from '@angular/platform-browser';
import {
  Observable,
  catchError,
  map,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';

/**
 * Base path for the icon files, so the library can live in an app that serves
 * them from somewhere other than `/icons`.
 */
export const SYNAPSE_ICON_BASE_PATH = new InjectionToken<string>(
  'SYNAPSE_ICON_BASE_PATH',
  { providedIn: 'root', factory: () => '/icons' },
);

/** Without the cache every `<syn-icon>` would request the same file again. */
@Injectable({ providedIn: 'root' })
export class SynapseIconLoader {
  private readonly http = inject(HttpClient);

  private readonly basePath = inject(SYNAPSE_ICON_BASE_PATH);

  private readonly cache = new Map<string, Observable<string>>();

  load(name: string): Observable<string> {
    const url = `${this.basePath}/${name}.svg`;
    const cached = this.cache.get(url);

    if (cached) return cached;

    const request$ = this.http.get(url, { responseType: 'text' }).pipe(
      map(rawSvg => rawSvg.replace(
        /^<svg/,
        `<svg fill="currentColor" style="display:inline-block;vertical-align:middle"`,
      )),
      // A missing icon must not kill the stream and strand the component.
      catchError(() => of('')),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.cache.set(url, request$);

    return request$;
  }
}

@Component({
  selector: 'syn-icon',
  template: '',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SynapseIconComponent {
  readonly name = input.required<string>();

  /** Exposed so hosts such as `syn-button` can locate the projected icon. */
  readonly elementRef = inject(ElementRef<HTMLElement>);

  private readonly loader = inject(SynapseIconLoader);

  private readonly sanitizer = inject(DomSanitizer);

  /** switchMap keeps a late response from overwriting a newer icon. */
  private readonly svgHtml = toSignal(
    toObservable(this.name).pipe(
      switchMap(iconName => iconName ? this.loader.load(iconName) : of('')),
      map((raw): SafeHtml | '' => raw ? this.sanitizer.bypassSecurityTrustHtml(raw) : ''),
    ),
    { initialValue: '' as SafeHtml | '' },
  );

  @HostBinding('innerHTML')
  get innerHTML(): SafeHtml | '' {
    return this.svgHtml();
  }
}
