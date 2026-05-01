import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

import { SynapseRadioService } from '../radio.service';

@Component({
  selector: 'syn-radio-group',
  providers: [SynapseRadioService],
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'syn-radio-group',
  }
})
export class SynapseRadioGroupComponent {}