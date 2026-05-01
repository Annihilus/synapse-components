import { HttpClient } from '@angular/common/http';
import {
  Component,
  effect,
  HostBinding,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
} from '@angular/platform-browser';

@Component({
  selector: 'syn-icon',
  template: '',
  styleUrls: ['./icon.component.scss'],
})
export class SynapseIconComponent {
  // 1️⃣ The signal input for the icon name
  readonly name = input.required<string>();

  // 2️⃣ Inject HttpClient + DomSanitizer
  private readonly http = inject(HttpClient);
  
  private readonly sanitizer = inject(DomSanitizer);

  // 3️⃣ A signal to hold our sanitized SVG
  private readonly svgHtml = signal<SafeHtml | ''>('');

  // 4️⃣ Load on instantiation (field‐initializer = injection context)
  private readonly loadIcon = effect(() => {
    const iconName = this.name();
    if (!iconName) {
      this.svgHtml.set('');
      return;
    }

    this.http
      .get(`/icons/${iconName}.svg`, { responseType: 'text' })
      .subscribe(rawSvg => {
        // Optional: inject styling attributes on the <svg> tag
        const patched = rawSvg.replace(
          /^<svg/,
          `<svg fill="currentColor" style="display:inline-block;vertical-align:middle"`
        );

        // Bypass Angular’s sanitizer for our trusted asset
        const safe = this.sanitizer.bypassSecurityTrustHtml(patched);
        this.svgHtml.set(safe);
      });
  });

  @HostBinding('innerHTML')
  get innerHTML(): SafeHtml | '' {
    return this.svgHtml();
  }
}
