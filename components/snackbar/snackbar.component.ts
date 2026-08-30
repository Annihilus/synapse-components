import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";
import { SynapseButtonComponent } from "../button/button.component";
import { SynapseIconComponent } from "../icon/icon.component";
import { SnackbarType } from "./model";

const ICON_BY_TYPE: Record<SnackbarType, string> = {
  default: 'info',
  success: 'approve',
  warning: 'alert_triangle',
  error: 'alert_circle',
};

@Component({
  selector: 'syn-snackbar',
  imports: [
    SynapseButtonComponent,
    SynapseIconComponent,
  ],
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'getTypeModifier()',
    'role': 'status',
    'aria-live': 'polite',
  },
})
export class SynapseSnackbarComponent {
  public dismiss = output<void>();

  public type = input<SnackbarType>('default');

  public title = input('');

  public message = input('');

  public dismissLabel = input('Close');

  public icon = computed(() => ICON_BY_TYPE[this.type()] ?? ICON_BY_TYPE.default);

  protected getTypeModifier() {
    return `type-${this.type()}`
  }
}
