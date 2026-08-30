import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import { SynapseIconComponent } from '../icon/icon.component';
import { SynapseIconButtonComponent } from '../icon-button/icon-button.component';
import { HelperTextType } from './helper-text.types';

export type { HelperTextType } from './helper-text.types';

const ICON_BY_TYPE: Record<HelperTextType, string> = {
  info: 'info',
  success: 'approve',
  warning: 'alert_triangle',
  error: 'alert_circle',
};

@Component({
  selector: 'syn-helper-text',
  imports: [CommonModule, SynapseIconComponent, SynapseIconButtonComponent],
  templateUrl: './helper-text.component.html',
  styleUrls: ['./helper-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
  },
})
export class SynapseHelperTextComponent {
  type = input<HelperTextType>('info');
  icon = input<boolean>(false);
  title = input<string>('');
  description = input<string>('');
  canBeClosed = input<boolean>(false);
  closeLabel = input('Close');

  /** `[canBeClosed]` renders the button; hiding the block is up to the consumer. */
  closed = output<void>();

  protected iconName = computed(() => ICON_BY_TYPE[this.type()] ?? ICON_BY_TYPE.info);

  protected classes = computed(() => {
    const type = `type-${this.type()}`;

    return `${type}`;
  })
}
