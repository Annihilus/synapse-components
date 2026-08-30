import { ChangeDetectionStrategy, Component } from "@angular/core";
import { SynapseButtonComponent } from "../../button/button.component";

@Component({
  selector: 'syn-modal-footer',
  imports: [SynapseButtonComponent],
  templateUrl: './modal-footer.component.html',
  styleUrls: ['./modal-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SynapseModalFooterComponent {}