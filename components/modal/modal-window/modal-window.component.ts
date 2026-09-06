import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewContainerRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { DIALOG_CLOSE_BTN, DIALOG_SIZE, ModalSize } from '../modal.tokens';
import { SynapseButtonComponent } from '../../button/button.component';
import { SynapseIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'syn-modal-window',
  imports: [
    SynapseButtonComponent,
    SynapseIconComponent,
  ],
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape($event)',
    '(click)': 'onRootClick($event)',
  },
})
export class SynapseModalWindowComponent {
  content = viewChild.required('content', { read: ViewContainerRef });

  size = inject<ModalSize>(DIALOG_SIZE);

  closeBtn = inject<boolean>(DIALOG_CLOSE_BTN);

  private readonly dialog = viewChild.required<ElementRef<HTMLElement>>('dialog');

  private readonly host = inject(ElementRef<HTMLElement>);

  private modalRef?: { close(): void };

  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    afterNextRender(() => {
      this.previouslyFocused = document.activeElement as HTMLElement | null;
      this.dialog().nativeElement.focus();
    });
  }

  setModalRef(ref: { close(): void }) {
    this.modalRef = ref;
  }

  protected onRootClick(event: MouseEvent) {
    if (!this.dialog().nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  protected onEscape(event: Event) {
    event.preventDefault();
    this.close();
  }

  protected close() {
    if (!this.modalRef) return;

    this.modalRef.close();
    this.previouslyFocused?.focus();
  }
}
