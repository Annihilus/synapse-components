import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { SynapseIconComponent } from '../icon/icon.component';
import { IconButtonType } from './icon-button.types';

export type { IconButtonType } from './icon-button.types';

@Component({
  selector: 'button[syn-icon-button]',
  imports: [CommonModule, SynapseIconComponent],
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // The attribute is the selector, but the Figma CSS is generated as
    // `.syn-icon-button` rules — the preview iframe has nothing else to match.
    'class': 'syn-icon-button',
    '[class]': 'classes()',
  },
})
export class SynapseIconButtonComponent {
  type = input<IconButtonType>('primary');
  count = input<number | null>(null);

  protected classes = computed(() => {
    const type = `type-${this.type()}`;

    return `${type}`;
  });
}
