import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  afterRenderEffect,
  ElementRef,
  inject,
  contentChild,
  forwardRef,
  Renderer2,
} from '@angular/core';

import { SynapseIconComponent } from '../icon/icon.component';
import { ButtonColorType, ButtonIcon, ButtonSize } from './button.types';

@Component({
  selector: 'button[syn-button]',
  imports: [CommonModule, SynapseIconComponent],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.disabled]': 'disabled() ? true : null',
  }
})
export class SynapseButtonComponent {
  colorType = input<ButtonColorType>('primary');
  size = input<ButtonSize>('m');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  icon = contentChild(forwardRef(() => SynapseIconComponent));

  private iconPosition = signal<ButtonIcon>(false);

  protected classes = computed(() => {
    const size = `size-${this.size()}`;
    const type = `colorType-${this.colorType()}`;
    const iconClass = this.getIconClass();

    // The host `[class]` binding replaces consumer classes, so `.syn-button` —
    // which the generated CSS keys off — has to be emitted here.
    return `syn-button ${type} ${size} ${iconClass}`.trim();
  });

  private elementRef = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  private positionResolved = false;

  constructor() {
    // Not ngAfterContentInit: the content sits inside `@if (loading())`, so the
    // order is unreadable there, and the branch is rebuilt on every toggle.
    afterRenderEffect(() => {
      const isLoading = this.loading();
      const icon = this.icon();

      if (isLoading || !icon) return;

      if (!this.positionResolved) {
        this.resolvePosition();
        this.positionResolved = true;
      }

      this.relocateIcon(this.elementRef.nativeElement);
    });
  }

  private getIconClass(): string {
    const pos = this.iconPosition();

    if (pos === true) return 'icon';
    if (pos === 'left') return 'icon-left';
    if (pos === 'right') return 'icon-right';

    return '';
  }

  private resolvePosition() {
    const icon = this.icon();
    const host = this.elementRef.nativeElement;
    const iconElement = icon.elementRef.nativeElement as HTMLElement;

    this.iconPosition.set(this.resolveIconPosition(host, iconElement));
  }

  private resolveIconPosition(host: HTMLElement, iconElement: HTMLElement): ButtonIcon {
    const childNodes: Node[] = Array.from(host.childNodes);

    const isIcon = (node: Node): boolean =>
      node instanceof Element &&
      (node.tagName.toLowerCase() === 'syn-icon' ||
        node.classList.contains('icon') ||
        node.classList.contains('state'));

    // Control-flow anchors are comment nodes whose textContent reads "container".
    const contentNodes = childNodes.filter(
      (node) => node.nodeType !== Node.COMMENT_NODE && !isIcon(node),
    );

    const textContent = contentNodes
      .map((node) => node.textContent?.trim() || '')
      .join('')
      .trim();

    if (!textContent) return true;

    const firstTextNode = contentNodes.find(
      (node) => (node.textContent?.trim().length ?? 0) > 0,
    ) as Node;

    const iconIndex = childNodes.indexOf(iconElement);
    const textIndex = childNodes.indexOf(firstTextNode);

    return iconIndex < textIndex ? 'left' : 'right';
  }

  private relocateIcon(host: HTMLElement) {
    const synIcon = host.querySelector('syn-icon');
    const container = host.querySelector('div.icon');
    if (!synIcon || !container) return;

    if (synIcon.parentElement === container) return;

    const index = Array.prototype.indexOf.call(host.childNodes, synIcon);
    container.appendChild(synIcon);
    this.renderer.insertBefore(host, container, host.childNodes[index]);
  }
}