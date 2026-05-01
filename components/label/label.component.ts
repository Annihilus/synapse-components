import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

import { SynapseIconComponent } from '../icon/icon.component';

@Component({
  selector: 'label[syn-label]',
  imports: [SynapseIconComponent],
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'syn-label',
  },
})
export class SynapseLabelComponent {
  tooltip = input('');
  required = input(false);
}