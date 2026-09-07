import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewContainerRef,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ModalSize } from './modal.tokens';
import { SynapseButtonComponent } from '../button/button.component';
import { SynapseIconComponent } from '../icon/icon.component';

@Component({
  selector: 'syn-modal',
  imports: [
    SynapseButtonComponent,
    SynapseIconComponent,
  ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape($event)',
    '(click)': 'onRootClick($event)',
  },
})
export class SynapseModalComponent {
  content = viewChild.required('content', { read: ViewContainerRef });

  size = input<ModalSize>('m');

  closeBtn = input(true);

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
