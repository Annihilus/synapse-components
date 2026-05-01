import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  AfterContentInit,
  AfterViewInit,
  ElementRef,
  inject,
  contentChild,
  forwardRef,
  Renderer2,
} from '@angular/core';

import { SynSize } from '../types';
import { SynapseIconComponent } from '../icon/icon.component';

export type ButtonType = 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger';
export type ButtonIcon = boolean | 'left' | 'right';

@Component({
  selector: 'button[syn-button]',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.disabled]': 'disabled() ? true : null',
  }
})
export class SynapseButtonComponent implements AfterContentInit, AfterViewInit {
  colorType = input<ButtonType>('primary');
  size = input<SynSize>('m');
  disabled = input<boolean>(false);
  loading = input(false);
  icon = contentChild(forwardRef(() => SynapseIconComponent));

  private iconPosition = signal<ButtonIcon>(false);

  protected classes = computed(() => {
    const size = `size-${this.size()}`;
    const type = `colorType-${this.colorType()}`;
    const iconClass = this.getIconClass();

    // The host `[class]` binding clobbers any consumer-set class, so the block
    // class must be emitted here — generated/preview CSS keys off `.syn-button`
    // (and `.syn-button .icon`, `.syn-button.size-l`, …); without it on the host
    // none of those selectors match.
    return `syn-button ${type} ${size} ${iconClass}`.trim();
  });

  private elementRef = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  ngAfterContentInit() {
    // Resolve left/right/icon-only from the projected order while it is still
    // intact. The class must be ready before the view renders the `.icon` slot,
    // and this hook has no DOM dependency on that slot.
    this.resolvePosition();
  }

  ngAfterViewInit() {
    // The `.icon` container is produced by `@if (icon())` in the template, which
    // only renders during the view-update pass — i.e. *after* ngAfterContentInit.
    // Relocating here (instead of in ngAfterContentInit, as a child directive
    // used to) guarantees the container exists so the `<syn-icon>` can move in.
    if (this.icon()) {
      this.relocateIcon(this.elementRef.nativeElement);
    }
  }

  private getIconClass(): string {
    const pos = this.iconPosition();

    if (pos === true) return 'icon';
    if (pos === 'left') return 'icon-left';
    if (pos === 'right') return 'icon-right';

    return '';
  }

  /**
   * Resolves the projected icon's position from its original DOM order. This
   * logic used to live in the `synIconContainer` directive on `.wrapper`; it now
   * runs against the host, so no wrapper element is needed. The actual DOM move
   * happens later in {@link relocateIcon} (see ngAfterViewInit).
   */
  private resolvePosition() {
    const icon = this.icon();
    if (!icon) {
      this.iconPosition.set(false);
      return;
    }

    const host = this.elementRef.nativeElement;
    const iconElement = icon.elementRef?.nativeElement as HTMLElement | undefined;

    this.iconPosition.set(this.resolveIconPosition(host, iconElement));
  }

  private resolveIconPosition(host: HTMLElement, iconElement?: HTMLElement): ButtonIcon {
    const childNodes: Node[] = Array.from(host.childNodes);

    const textContent = childNodes
      .filter((node) =>
        node instanceof Element
          ? node.tagName.toLowerCase() !== 'syn-icon'
          : node.nodeType === Node.TEXT_NODE,
      )
      .map((node) => (node instanceof Text ? node.textContent?.trim() || '' : ''))
      .join('')
      .trim();

    if (!textContent) return true;
    if (!iconElement) return 'left';

    const firstTextNode = childNodes.find(
      (node) => node instanceof Text && (node.textContent?.trim().length ?? 0) > 0,
    );
    if (!firstTextNode) return 'left';

    const iconIndex = childNodes.indexOf(iconElement);
    const textIndex = childNodes.indexOf(firstTextNode);

    return iconIndex < textIndex ? 'left' : 'right';
  }

  /** Moves the projected `<syn-icon>` into the `.icon` container, in its slot. */
  private relocateIcon(host: HTMLElement) {
    const synIcon = host.querySelector('syn-icon');
    const container = host.querySelector('div.icon');
    if (!synIcon || !container) return;

    const index = Array.prototype.indexOf.call(host.childNodes, synIcon);
    container.appendChild(synIcon);
    this.renderer.insertBefore(host, container, host.childNodes[index]);
  }
}