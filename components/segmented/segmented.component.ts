import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
  contentChildren,
  effect,
} from '@angular/core';
import { SynapseSegmentedItemComponent } from './segmented-item/segmented-item.component';

@Component({
  selector: 'syn-segmented',
  imports: [CommonModule, SynapseSegmentedItemComponent],
  template: '<ng-content />',
  styleUrls: ['./segmented.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'syn-segmented',
    '(selected)': 'onItemSelected($event)',
  },
})
export class SynapseSegmentedComponent {
  selectedValue = signal<string | number | null>(null);
  valueChange = output<string | number>();

  items = contentChildren(SynapseSegmentedItemComponent);

  constructor() {
    effect(() => {
      const allItems = this.items();
      allItems.forEach(item => {
        item.selected.subscribe((value) => {
          this.selectItem(value);
        });
      });
    });
  }

  onItemSelected(event: Event) {
    const customEvent = event as CustomEvent<string | number>;
    this.selectItem(customEvent.detail);
  }

  private selectItem(value: string | number) {
    this.selectedValue.set(value);
    this.valueChange.emit(value);

    // Deselect all items, then select the clicked one
    this.items().forEach(item => {
      item.setSelected(item.name() === value);
    });
  }
}