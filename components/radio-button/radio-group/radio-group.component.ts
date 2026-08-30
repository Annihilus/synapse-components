import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';

import { SynapseControlDirective } from '../../control-directives';
import { SynapseRadioService } from '../radio.service';

@Component({
  selector: 'syn-radio-group',
  providers: [SynapseRadioService],
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'syn-radio-group',
    'role': 'radiogroup',
  },
  hostDirectives: [
    {
      directive: SynapseControlDirective,
      inputs: ['value', 'error', 'disabled'],
      outputs: ['valueChanged'],
    },
  ],
})
export class SynapseRadioGroupComponent<T = unknown> {
  /** How a button's value is matched against the group's, for object values. */
  compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);

  private readonly control = inject(SynapseControlDirective<T>);

  private readonly service = inject(SynapseRadioService<T>);

  constructor() {
    this.service.select = (value: T) => this.control.setValue(value);

    effect(() => this.service.selected.set(this.control.current()));
    effect(() => this.service.disabled.set(this.control.disabled()));
    effect(() => this.service.compareWith.set(this.compareWith()));
  }
}
