import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { SynapseIconButtonComponent } from '../icon-button/icon-button.component';
import { SynapseIconComponent } from '../icon/icon.component';
import {
  IwElementFilledStateDirective,
  IwElementFormControlDirective,
  IwElementValidStateDirective,
} from '../control-directives';
import { IwPopoverModule, SynPopoverDirective } from "../popover";

export interface SelectItem<T> {
  original: T;
  displayName: string;
  disabled?: boolean;
}

@Component({
  selector: 'syn-select',
  imports: [CommonModule, SynapseIconComponent, SynapseIconButtonComponent, IwPopoverModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: IwElementFormControlDirective,
      inputs: ['formControlName', 'formControl', 'errors'],
    },
    {
      directive: IwElementFilledStateDirective,
      inputs: ['value'],
    },
    {
      directive: IwElementValidStateDirective,
      inputs: ['errors:error'],
    },
  ],
  host: {
    'class.filled': 'selectedValue()',
  }
})
export class SynapseSelectComponent<T> {
  valueChanged = output<T>();

  label = input<string | null>(null);
  hint = input<string | null>(null);
  icon = input<string | null>(null);
  selector = input<string | null>(null);
  placeholder = input<string>('Select an option');
  canClear = input<boolean>(false);
  hideSelected = input<boolean>(true);
  value = input<T | null>(null);
  items = input<T[]>([]);

  displayWith = input<(item: T) => string>((item) => String(item));
  compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);
  disabledFn = input<(item: T) => boolean>(() => false);

  // Internal selected value state
  private _selectedValue = signal<T | null>(null);

  // The actual selected value (prioritize input value over internal state)
  selectedValue = computed(() => this.value() ?? this._selectedValue());

  // Display name for selected value
  selectedDisplayName = computed(() => {
    const selected = this.selectedValue();
    return selected ? this.displayWith()(selected) : null;
  });

  // Items with metadata for dropdown
  itemsWithMetadata = computed(() => {
    const displayFn = this.displayWith();
    const disabledFn = this.disabledFn();
    const compareFn = this.compareWith();
    const selectedValue = this.selectedValue();

    return this.items()
      .map((item): SelectItem<T> => ({
        original: item,
        displayName: displayFn(item),
        disabled: disabledFn(item)
      }))
      .filter(item => {
        // Optionally exclude the selected item from the dropdown
        if (!this.hideSelected()) return true;
        return selectedValue === null || !compareFn(item.original, selectedValue);
      });
  });

  protected readonly dropdown = viewChild.required(SynPopoverDirective);

  selectItem(item: SelectItem<T>) {
    // Update internal state
    this._selectedValue.set(item.original);

    // Close dropdown
    this.dropdown().hide();

    // Emit the change
    this.valueChanged.emit(item.original);
  }

  clearSelection() {
    this._selectedValue.set(null);
    this.valueChanged.emit(null as any); // Or handle this based on your needs
  }
}
