import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { SynapseIconComponent } from '../icon/icon.component';
import { SynapseIconButtonComponent } from '../icon-button/icon-button.component';

export type HelperType = 'info' | 'success' | 'warning' | 'error';

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
  type = input<HelperType>('info');
  icon = input<boolean>(false);
  title = input<string>('');
  description = input<string>('');
  canBeClosed = input<boolean>(false);

  protected classes = computed(() => {
    const type = `type-${this.type()}`;

    return `${type}`;
  })

  constructor() {
    console.log('Icon button component loaded');
  }
}
