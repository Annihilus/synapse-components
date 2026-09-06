import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SynapseCheckboxComponent } from '../checkbox/checkbox.component';
import { SynapseIconComponent } from '../icon/icon.component';

export type DropdownItemRole = 'option' | 'menuitem';

@Component({
  selector: '[syn-dropdown-item]',
  imports: [SynapseCheckboxComponent, SynapseIconComponent],
  templateUrl: './dropdown-item.component.html',
  styleUrls: ['./dropdown-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // Carried explicitly: the attribute is the selector, but the Figma CSS is
    // generated as `.syn-dropdown-item` rules.
    'class': 'syn-dropdown-item',
    // An attribute selector: this may sit on a div, so state goes through ARIA.
    '[attr.role]': 'role()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[class.selected]': 'selected()',
    '[class.disabled]': 'disabled()',
    '[attr.aria-selected]': "role() === 'option' ? selected() : null",
  },
})
export class SynapseDropdownItemComponent {
  icon = input<string>('');

  checkbox = input(false);

  description = input<string>('');

  hint = input<string>('');

  selected = input(false);

  disabled = input(false);

  role = input<DropdownItemRole>('option');
}
