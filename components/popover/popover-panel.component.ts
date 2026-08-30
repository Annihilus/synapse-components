import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  input,
} from '@angular/core';

import { PopoverAlign, PopoverContext, PopoverSide, PopoverVariant } from './popover.model';

let nextPanelId = 0;

/**
 * The popover surface. It lives in the body-level overlay and is positioned
 * from outside: the directive computes the coordinates and passes them in.
 *
 * The `.side-*` / `.position-*` classes are the contract of the Figma-generated
 * mixins, which key the arrow geometry off them.
 */
@Component({
  selector: 'syn-popover-panel',
  imports: [NgTemplateOutlet],
  templateUrl: './popover-panel.component.html',
  styleUrls: ['./popover-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'syn-popover-panel',
    '[id]': 'panelId',
    '[attr.role]': 'role()',
    '[class.side-top]': "side() === 'top'",
    '[class.side-bottom]': "side() === 'bottom'",
    '[class.side-left]': "side() === 'left'",
    '[class.side-right]': "side() === 'right'",
    '[class.position-start]': "align() === 'start'",
    '[class.position-middle]': "align() === 'middle'",
    '[class.position-end]': "align() === 'end'",
    '[class.variant-popover]': "variant() === 'popover'",
    '[class.variant-tooltip]': "variant() === 'tooltip'",
    '[class.variant-dropdown]': "variant() === 'dropdown'",
    '[class.with-arrow]': 'arrow()',
    '[class.measuring]': '!positioned()',
    '[style.top.px]': 'top()',
    '[style.left.px]': 'left()',
    '[style.min-width.px]': 'minWidth()',
  },
})
export class SynapsePopoverPanelComponent {
  readonly panelId = `syn-popover-${nextPanelId++}`;

  readonly text = input('');
  readonly template = input<TemplateRef<unknown> | null>(null);
  readonly context = input<PopoverContext>({});

  readonly side = input<PopoverSide>('bottom');
  readonly align = input<PopoverAlign>('middle');
  readonly variant = input<PopoverVariant>('popover');
  readonly arrow = input(false);
  readonly role = input<string | null>(null);

  readonly top = input(0);
  readonly left = input(0);
  readonly minWidth = input<number | null>(null);

  /** Hidden until first measured, otherwise it flashes in the top-left corner. */
  readonly positioned = input(false);
}
