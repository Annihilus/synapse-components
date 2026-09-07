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
import { SynapseDropdownItemComponent } from '../dropdown-item/dropdown-item.component';

let nextSelectId = 0;

export interface SelectItem<T> {
  original: T;
  displayName: string;
  disabled?: boolean;
}

@Component({
  selector: 'syn-select',
  imports: [
    SynapseIconComponent,
    SynapseIconButtonComponent,
    SynapseDropdownDirective,
    SynapseDropdownItemComponent,
  ],
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
    '[class.focus]': 'isFocused()',
  }
})
export class SynapseSelectComponent<T> {
  valueChanged = output<T>();

  /** Separate from `valueChanged`, which would otherwise widen to `T | null`. */
  cleared = output<void>();

  label = input<string | null>(null);
  hint = input<string | null>(null);
  icon = input<string | null>(null);
  selector = input<string | null>(null);
  placeholder = input<string>('Select an option');
  canClear = input<boolean>(false);
  hideSelected = input<boolean>(true);
  inline = input<boolean>(false);
  items = input<T[]>([]);

  active = signal(false);

  /**
   * Keyboard focus on the combobox. `.focus` drives the generated focus style
   * now that only `hover` stays a pseudo-state; a mouse click opens the
   * dropdown, which is affordance enough on its own.
   */
  isFocused = signal(false);

  displayWith = input<(item: T) => string>((item) => String(item));
  compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);
  disabledFn = input<(item: T) => boolean>(() => false);

  private readonly control = inject(SynapseControlDirective<T | null>);

  selectedValue = computed(() => this.control.current() ?? null);

  selectedDisplayName = computed(() => {
    const selected = this.selectedValue();
    return selected ? this.displayWith()(selected) : null;
  });

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

  protected readonly labelId = `syn-select-label-${nextSelectId++}`;

  protected setFocusState(state: boolean, event?: FocusEvent) {
    this.isFocused.set(state && !!(event?.target as Element | undefined)?.matches(':focus-visible'));
  }

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

  close() {
    this.dropdown().hide();
  }

  clearSelection() {
    this.control.setValue(null);
    this.cleared.emit();
  }
}
