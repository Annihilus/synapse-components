import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { SynapseIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'button[syn-segmented-item]',
  imports: [CommonModule, SynapseIconComponent],
  templateUrl: './segmented-item.component.html',
  styleUrls: ['./segmented-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'syn-segmented-item',
    '[class.selected]': 'isSelected()',
    '[class.text]': 'text()',
    '[class.icon]': 'icon()',
    '(click)': 'onClick()',
  },
})
export class SynapseSegmentedItemComponent {
  icon = input<string>('');
  text = signal<boolean>(false);
  name = input.required<string | number>();
  isSelected = signal<boolean>(false);
  disabled = input<boolean>(false);

  selected = output<string | number>();

  private readonly element = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => {
      const el = this.element.nativeElement;

      const hasTextContent = Array
        .from(el.childNodes)
        .some(node => {
          // if (node.nodeType === Node.TEXT_NODE) {
          //   return node.textContent?.trim().length ?? 0 > 0;
          // }
          return false;
        });

      this.text.set(hasTextContent);
    });
  }

  onClick() {
    if (!this.disabled()) {
      this.selected.emit(this.name());
    }
  }

  setSelected(selected: boolean) {
    this.isSelected.set(selected);
  }
}
