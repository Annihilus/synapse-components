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

  alt = input('');

  protected readonly url = computed(() => this.getUrl(this.src()));

  protected readonly sizeValue = computed(() => {
    const size = this.size();

    return typeof size === 'number' ? `${size}px` : size;
  });

  private sanitizer = inject(DomSanitizer);

  private getUrl(src?: string): SafeUrl | string {
    if (!src) return '';

    const url = this._isBase64(src) ? `data:image/png;base64,${src}` : src;

    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  private _isBase64(str: string) {
    const base64Regex = /^(?:[\d+/a-z]{4})*(?:[\d+/a-z]{2}==|[\d+/a-z]{3}=|[\d+/a-z]{4})$/i;

    return base64Regex.test(str);
  }
}
