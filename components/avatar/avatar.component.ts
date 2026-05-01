import { Component, computed, effect, ElementRef, inject, input, Renderer2 } from "@angular/core";
import { SynapseIconComponent } from "../icon/icon.component";
import { DomSanitizer } from "@angular/platform-browser";

// The SynapseAvatarComponent is a component that displays an avatar image, initials, or a photo add icon.
@Component({
  selector: "syn-avatar",
  templateUrl: "./avatar.component.html",
  styleUrls: ["./avatar.component.scss"],
  imports: [
    SynapseIconComponent,
  ],
  host: {
    '[class.initials]': 'initials()',
    '[class.image]': 'src()',
    '[class.upload]': 'upload()',
  },
})
export class SynapseAvatarComponent {
  // The signal input for the avatar source
  src = input<string | undefined>(undefined);
  // The signal input for the avatar initials
  initials = input('');
  // The signal input for the avatar upload
  upload = input(false);  
  // The signal input for the avatar size
  size = input<string | number>(36);
  // The computed signal for the avatar URL

  protected readonly url = computed(() => this.getUrl(this.src()));

  private sanitizer = inject(DomSanitizer);
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  constructor() {
    effect(() => {
      const size = this.size();
      this.renderer.setStyle(this.el.nativeElement, 'width', `${size}px`);
      this.renderer.setStyle(this.el.nativeElement, 'height', `${size}px`);
    });
  }

  private getUrl(src?: string) {
    if (src) {
      const prefix = this._isBase64(src) && !src.startsWith('data:image') ? 'data:image/png;base64,' : '';
      const base64 = prefix ? src : this._setMimeType(src);

      return this.sanitizer.bypassSecurityTrustUrl(`${prefix}${base64}`);
    }

    return '';
  }

  private _isBase64(str: string) {
    const base64Regex = /^(?:[\d+/a-z]{4})*(?:[\d+/a-z]{2}==|[\d+/a-z]{3}=|[\d+/a-z]{4})$/i;

    return base64Regex.test(str);
  }

  private _setMimeType(dataUri: string): string {
    return dataUri.replace(/^data:[^;]+;base64,/, 'data:image/png;base64,');
  }
}