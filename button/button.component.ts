import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  AfterContentInit,
  ElementRef,
  inject,
  contentChild,
  forwardRef,
} from '@angular/core';

import { SynSize } from '../types';
import { SynapseIconComponent } from '../icon/icon.component';
import { SynIconContainerDirective } from '../directives/icon-container.directive';

export type ButtonType = 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger';
export type ButtonIcon = boolean | 'left' | 'right';

@Component({
  selector: 'button[syn-button]',
  imports: [CommonModule, SynIconContainerDirective, SynapseIconComponent],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.disabled]': 'disabled() ? true : null',
  }
})
export class SynapseButtonComponent implements AfterContentInit {
  type = input<ButtonType>('primary');
  size = input<SynSize>('m');
  disabled = input<boolean>(false);
  icon = contentChild(forwardRef(() => SynapseIconComponent));
  loading = input(false);

  private iconPosition = signal<ButtonIcon>(false);

  protected classes = computed(() => {
    const size = `size-${this.size()}`;
    const type = `type-${this.type()}`;
    const iconClass = this.getIconClass();

    return `${type} ${size} ${iconClass}`.trim();
  });

  private elementRef = inject(ElementRef<HTMLElement>);

  ngAfterContentInit() {
    this.detectIconPosition();
  }

  private getIconClass(): string {
    const pos = this.iconPosition();

    if (pos === true) return 'icon';
    if (pos === 'left') return 'icon-left';
    if (pos === 'right') return 'icon-right';

    return '';
  }

  private detectIconPosition() {
    const icon = this.icon();
    if (!icon) {
      this.iconPosition.set(false);
      return;
    }

    const button = this.elementRef.nativeElement;
    const wrapper = button.querySelector('.wrapper');
    
    if (!wrapper) {
      this.iconPosition.set(true);
      return;
    }

    const childNodes: Node[] = Array.from(wrapper.childNodes);
    
    const textContent = childNodes
      .filter((node) => {
        if (node instanceof Element) {
          return node.tagName.toLowerCase() !== 'syn-icon';
        }
        return node.nodeType === Node.TEXT_NODE;
      })
      .map((node) => {
        if (node instanceof Text) {
          return node.textContent?.trim() || '';
        }
        return '';
      })
      .join('')
      .trim();

    if (!textContent) {
      this.iconPosition.set(true);
      return;
    }

    const iconElement = icon.elementRef?.nativeElement;
    if (!iconElement) {
      this.iconPosition.set('left');
      return;
    }

    const firstTextNode = childNodes.find((node) => {
      if (node instanceof Text) {
        return (node.textContent?.trim().length ?? 0) > 0;
      }
      return false;
    });

    if (!firstTextNode) {
      this.iconPosition.set('left');
      return;
    }

    const iconIndex = childNodes.indexOf(iconElement);
    const textIndex = childNodes.indexOf(firstTextNode);

    this.iconPosition.set(iconIndex < textIndex ? 'left' : 'right');
  }
}