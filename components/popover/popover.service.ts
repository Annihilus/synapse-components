import {
  DestroyRef,
  inject,
  Injectable,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';

import {
  IPopoverRef,
  IwPopoverRef,
} from './popover-ref';
import { IwPopoverOptions } from './popover.options';

@Injectable()
export class IwPopoverService {
  private readonly _renderer = inject(Renderer2);

  public registerPopover(
    destroy: DestroyRef,
    viewRef: ViewContainerRef,
    options?: Partial<IwPopoverOptions>,
    element?: HTMLElement,
  ): IPopoverRef {
    const popover = new IwPopoverRef(
      element,
      options,
      this._renderer,
      viewRef,
      destroy,
    );

    return popover;
  }
}
