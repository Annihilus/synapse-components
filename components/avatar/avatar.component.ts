import { ChangeDetectionStrategy, Component, computed, input, inject } from "@angular/core";
import { SynapseIconComponent } from "../icon/icon.component";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "syn-avatar",
  templateUrl: "./avatar.component.html",
  styleUrls: ["./avatar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SynapseIconComponent,
  ],
  host: {
    '[class.initials]': 'initials()',
    '[class.image]': 'src()',
    '[class.upload]': 'upload()',
    '[style.width]': 'sizeValue()',
    '[style.height]': 'sizeValue()',
  },
})
export class SynapseAvatarComponent {
  src = input<string | undefined>(undefined);
  initials = input('');
  upload = input(false);
  size = input<string | number>(36);

  /** Avatars usually sit next to a name, so they are decorative by default. */
  alt = input('');

  protected readonly url = computed(() => this.getUrl(this.src()));

  /**
   * A number is read as pixels, a string as a ready CSS value.
   */
  protected readonly sizeValue = computed(() => {
    const size = this.size();

    return typeof size === 'number' ? `${size}px` : size;
  });

  private sanitizer = inject(DomSanitizer);

  private getUrl(src?: string): SafeUrl | string {
    if (!src) return '';

    // Bare base64 gets the data: prefix added; anything else — a plain URL or
    // a ready data: URI — is passed through untouched, mime included.
    const url = this._isBase64(src) ? `data:image/png;base64,${src}` : src;

    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  private _isBase64(str: string) {
    const base64Regex = /^(?:[\d+/a-z]{4})*(?:[\d+/a-z]{2}==|[\d+/a-z]{3}=|[\d+/a-z]{4})$/i;

    return base64Regex.test(str);
  }
}
