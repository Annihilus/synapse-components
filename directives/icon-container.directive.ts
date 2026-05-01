import {
  AfterContentInit,
  Directive,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[synIconContainer]',
})
export class SynIconContainerDirective implements AfterContentInit {
  synIconContainer = input('icon');

  private readonly _el = inject(ElementRef);
  private readonly _renderer = inject(Renderer2);

  ngAfterContentInit(): void {
    const container = this.synIconContainer() || 'icon';
    const el = this._el.nativeElement;
    const [icon] = el.querySelectorAll('syn-icon');

    if (icon) {
      const index = Array.prototype.indexOf.call(el.childNodes, icon);

      const iconContainer = el.querySelector(`div.${container}`);

      iconContainer.appendChild(icon);

      this._renderer.insertBefore(el, iconContainer, el.childNodes[index]);
    }
  }
}
