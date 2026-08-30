import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: 'syn-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SynapseModalContentComponent {}