import { ChangeDetectionStrategy, Component, input, output, signal } from "@angular/core";
import { SynapseButtonComponent } from "../button/button.component";
import { SynapseIconComponent } from "../icon/icon.component";

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
  },
})
export class SynapseSnackbarComponent {
  public dismiss = output();

  public type = input('');

  public title = input('');

  public message = input('');

  public icon = signal('info');

  protected getTypeModifier() {
    return `type-${this.type()}`
  }
}