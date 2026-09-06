import {
  ChangeDetectionStrategy,
  Component,
  afterRenderEffect,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { SynapseIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'button[syn-segmented-item]',
  imports: [SynapseIconComponent],
  templateUrl: './segmented-item.component.html',
  styleUrls: ['./segmented-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'syn-segmented-item',
    'type': 'button',
    '[class.selected]': 'isSelected()',
    '[class.text]': 'text()',
    '[class.icon]': 'icon()',
    '[disabled]': 'disabled()',
    '[attr.aria-pressed]': 'isSelected()',
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
    afterRenderEffect(() => {
      const el = this.element.nativeElement as HTMLElement;

      const hasTextContent = Array
        .from(el.childNodes)
        .some(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            return (node.textContent?.trim().length ?? 0) > 0;
          }

          return node instanceof Element
            && node.tagName.toLowerCase() !== 'syn-icon'
            && (node.textContent?.trim().length ?? 0) > 0;
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
