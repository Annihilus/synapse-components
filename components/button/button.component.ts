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

    // The host `[class]` binding clobbers any consumer-set class, so the block
    // class must be emitted here — generated/preview CSS keys off `.syn-button`
    // (and `.syn-button .icon`, `.syn-button.size-l`, …); without it on the host
    // none of those selectors match.
    return `syn-button ${type} ${size} ${iconClass}`.trim();
  });

  private elementRef = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  /** The icon/text order is read once, before the first relocation. */
  private positionResolved = false;

  constructor() {
    // Runs after render: at ngAfterContentInit the projected content is not
    // reliably in `host.childNodes` — `<ng-content>` lives inside the
    // `@if (loading()) {} @else {}` branch, so reading the order there can miss
    // the text node and mistake a text+icon button for an icon-only one.
    //
    // An effect rather than afterNextRender, because that `@else` branch — and
    // with it the `div.icon` container — is rebuilt on every loading toggle.
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

  /**
   * Resolves the projected icon's position from its original DOM order. This
   * logic used to live in the `synIconContainer` directive on `.wrapper`; it now
   * runs against the host, so no wrapper element is needed. The actual DOM move
   * happens later in {@link relocateIcon} (see ngAfterViewInit).
   */
  private resolvePosition() {
    const icon = this.icon();
    const host = this.elementRef.nativeElement;
    const iconElement = icon.elementRef.nativeElement as HTMLElement;

    this.iconPosition.set(this.resolveIconPosition(host, iconElement));
  }

  private resolveIconPosition(host: HTMLElement, iconElement: HTMLElement): ButtonIcon {
    const childNodes: Node[] = Array.from(host.childNodes);

    // Ignore the projected icon and the component's own `.icon`/`.state` helper
    // divs; everything else contributes the button's text (a raw text node or
    // text wrapped in an element).
    const isIcon = (node: Node): boolean =>
      node instanceof Element &&
      (node.tagName.toLowerCase() === 'syn-icon' ||
        node.classList.contains('icon') ||
        node.classList.contains('state'));

    // Control-flow blocks leave comment anchors behind whose textContent reads
    // "container"; counting those would make every button look like it has text.
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

  /** Moves the projected `<syn-icon>` into the `.icon` container, in its slot. */
  private relocateIcon(host: HTMLElement) {
    const synIcon = host.querySelector('syn-icon');
    const container = host.querySelector('div.icon');
    if (!synIcon || !container) return;

    // Idempotent: after a re-render the icon may already sit in its slot.
    if (synIcon.parentElement === container) return;

    const index = Array.prototype.indexOf.call(host.childNodes, synIcon);
    container.appendChild(synIcon);
    this.renderer.insertBefore(host, container, host.childNodes[index]);
  }
}