import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { SynapseTabsService } from '../tabs.service';

@Component({
  selector: 'syn-tab',
  imports: [CommonModule],
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'syn-tab',
    '[class.selected]': 'isSelected()',
    '(click)': 'selectTab()'
  },
})
export class SynapseTabComponent {
  public selected = input(false);

  isSelected = signal(false);

  name = input('');

  // select = output<boolean>();

  private readonly _service = inject(SynapseTabsService);

  constructor() {
    effect(() => {
      this.isSelected.set(this.selected());
    });
  }

  deselectTab() {
    this.isSelected.set(false);
  }

  selectTab() {
    console.log('tt');
    this.isSelected.set(true);
    this._service.select(this);
  }
}