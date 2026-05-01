import { Component, inject, input } from "@angular/core";
import { SynapseModalHeaderComponent } from "./modal-header/modal-header.component";
import { SynapseModalContentComponent } from "./modal-content/modal-content.component";
import { SynapseModalFooterComponent } from "./modal-footer/modal-footer.component";
import { SynapseModalRef } from "./modal.ref";
import { SynapseButtonComponent } from "../button/button.component";

@Component({
  selector: 'syn-modal',
  imports: [
    SynapseModalHeaderComponent,
    SynapseModalContentComponent,
    SynapseModalFooterComponent,
    SynapseButtonComponent,
],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  host: {
    '[class]': 'getClasses()',
  }
})
export class SynapseModalComponent {
  size = input('l');

  modalRef = inject(SynapseModalRef);

  protected getClasses() {
    const size = `size-${this.size()}`;

    return `${size}`;
  }
}