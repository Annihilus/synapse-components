import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { SynapseIconButtonComponent } from '../icon-button/icon-button.component';
import { SynapseIconComponent } from '../icon/icon.component';
import { SynapseControlDirective } from '../control-directives';
import { SynapseDropdownDirective } from "../popover";

let nextSelectId = 0;

export interface SelectItem<T> {
  original: T;
  displayName: string;
  disabled?: boolean;
}

@Component({
  selector: 'syn-select',
  imports: [CommonModule, SynapseIconComponent, SynapseIconButtonComponent, SynapseDropdownDirective],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: SynapseControlDirective,
      inputs: ['value', 'error', 'disabled'],
    },
  ],
  host: {
    '[class.inline]': 'inline()',
    '[class.active]': 'active()',
  }
})
export class SynapseSelectComponent<T> {
  /** A concrete item picked by the user. */
  valueChanged = output<T>();

  /**
   * Clearing the selection (`[canClear]`). A separate event rather than
   * `valueChanged(null)`, which would widen the output type for every consumer.
   */
  cleared = output<void>();

  label = input<string | null>(null);
  hint = input<string | null>(null);
  icon = input<string | null>(null);
  selector = input<string | null>(null);
  placeholder = input<string>('Select an option');
  canClear = input<boolean>(false);
  hideSelected = input<boolean>(true);
  /** Compact inline variant (no frame, no label/hint). `false` = full bordered. */
  inline = input<boolean>(false);
  items = input<T[]>([]);

  /** Whether the options dropdown is open (drives the `.active` class + chevron). */
  active = signal(false);

  displayWith = input<(item: T) => string>((item) => String(item));
  compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);
  disabledFn = input<(item: T) => boolean>(() => false);

  private readonly control = inject(SynapseControlDirective<T | null>);

  selectedValue = computed(() => this.control.current() ?? null);

  selectedDisplayName = computed(() => {
    const selected = this.selectedValue();
    return selected ? this.displayWith()(selected) : null;
  });

  // Field text: the selected value's name, or the placeholder when empty. The
  // placeholder vs value colour is handled by the `.filled` class in the mixin.
  displayText = computed(() => this.selectedDisplayName() ?? this.placeholder());


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
        if (!this.hideSelected()) return true;
        return selectedValue === null || !compareFn(item.original, selectedValue);
      });
  });

  protected readonly dropdown = viewChild.required(SynapseDropdownDirective);

  /** Ties the <label> to the combobox; otherwise the label owns no control. */
  protected readonly labelId = `syn-select-label-${nextSelectId++}`;

  /** The trigger is a div, so keyboard opening is wired by hand. */
  protected openDropdown(event: Event) {
    event.preventDefault();
    this.dropdown().show();
  }

  isSelected(item: SelectItem<T>): boolean {
    const selected = this.selectedValue();
    return selected !== null && this.compareWith()(item.original, selected);
  }

  selectItem(item: SelectItem<T>) {
    if (item.disabled) return;

    this.control.setValue(item.original);
    this.dropdown().hide();
    this.valueChanged.emit(item.original);
  }

  clearSelection() {
    this.control.setValue(null);
    this.cleared.emit();
  }
}
