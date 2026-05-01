import { Component, viewChild, inject, ViewContainerRef } from '@angular/core';
import { SynapseModalRef } from '../modal.ref';
import { ModalSize } from '../modal.service';
import { DIALOG_CLOSE_BTN, DIALOG_SIZE } from '../modal.tokens';
import { SynapseButtonComponent } from '../../button/button.component';
import { SynapseIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'syn-modal',
  imports: [
    SynapseButtonComponent,
    SynapseIconComponent,
  ],
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss'],
})
export class SynapseModalWindowComponent {
  content = viewChild('content', { read: ViewContainerRef });

  size = inject<ModalSize>(DIALOG_SIZE);

  closeBtn = inject<boolean>(DIALOG_CLOSE_BTN);

  private modalRef!: SynapseModalRef<unknown, unknown>;

  setModalRef(ref: SynapseModalRef<unknown, unknown>) {
    this.modalRef = ref;
  }

  protected close() {
    if (this.modalRef) this.modalRef.close();
  }
}
