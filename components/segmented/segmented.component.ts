import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  output,
  signal,
} from '@angular/core';

import { SynapseSegmentedItemComponent } from './segmented-item/segmented-item.component';

@Component({
  selector: 'syn-segmented',
  template: '<ng-content />',
  styleUrls: ['./segmented.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'syn-segmented',
    'role': 'group',
  },
})
export class SynapseSegmentedComponent {
  selectedValue = signal<string | number | null>(null);
  valueChange = output<string | number>();

  items = contentChildren(SynapseSegmentedItemComponent);

  constructor() {
    effect((onCleanup) => {
      const subscriptions = this.items().map(item =>
        item.selected.subscribe(value => this.selectItem(value)),
      );

      onCleanup(() => subscriptions.forEach(sub => sub.unsubscribe()));
    });
  }

  private selectItem(value: string | number) {
    this.selectedValue.set(value);
    this.valueChange.emit(value);

    this.items().forEach(item => {
      item.setSelected(item.name() === value);
    });
  }
}
