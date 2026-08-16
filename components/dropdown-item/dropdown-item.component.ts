import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SynapseCheckboxComponent } from '../checkbox/checkbox.component';
import { SynapseIconComponent } from '../icon/icon.component';

export type DropdownItemRole = 'option' | 'menuitem';

/**
 * A single row inside a dropdown / popover list. Meant to be placed in the
 * `syn-popover` content slot; the surrounding list owns the selection.
 */
@Component({
  selector: '[syn-dropdown-item]',
  imports: [SynapseCheckboxComponent, SynapseIconComponent],
  templateUrl: './dropdown-item.component.html',
  styleUrls: ['./dropdown-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'type': 'button',
    '[attr.role]': 'role()',
    '[class.selected]': 'selected()',
    '[class.disabled]': 'disabled()',
    '[attr.aria-selected]': "role() === 'option' ? selected() : null",
  },
})
export class SynapseDropdownItemComponent {
  /** Leading icon; ignored when [checkbox] is on, which occupies the same slot. */
  icon = input<string>('');

  /** Shows a leading checkbox mirroring [selected] — for multi-select lists. */
  checkbox = input(false);

  /** Secondary line under the label. */
  description = input<string>('');

  /** Trailing text, aligned to the far edge (shortcut, count, …). */
  hint = input<string>('');

  selected = input(false);

  disabled = input(false);

  /** `option` inside a listbox (the default), `menuitem` inside a menu. */
  role = input<DropdownItemRole>('option');
}
