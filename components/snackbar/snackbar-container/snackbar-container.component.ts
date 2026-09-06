import { ChangeDetectionStrategy, Component, inject, Signal } from "@angular/core";
import { SynapseSnackbarService } from "../snackbar.service";
import { SynapseSnackbarComponent } from "../snackbar.component";
import { SnackbarMessage } from "../model";

@Component({
  selector: 'syn-snackbar-container',
  templateUrl: './snackbar-container.component.html',
  imports: [SynapseSnackbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SynapseSnackbarContainerComponent {
  public messages: Signal<readonly SnackbarMessage[]>;

  private readonly snackbarService = inject(SynapseSnackbarService);

  constructor() {
    this.messages = this.snackbarService.messages$;
  }

  dismiss(id: string) {
    this.snackbarService.dismiss(id);
  }
}