import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

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
    '[class.inline]': 'inline()',
    '[class.active]': 'active()',
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
  /** Compact inline variant (no frame, no label/hint). `false` = full bordered. */
  inline = input<boolean>(false);
  value = input<T | null>(null);
  items = input<T[]>([]);

  /** Whether the options dropdown is open (drives the `.active` class + chevron). */
  active = signal(false);

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

  // Field text: the selected value's name, or the placeholder when empty. The
  // placeholder vs value colour is handled by the `.filled` class in the mixin.
  displayText = computed(() => this.selectedDisplayName() ?? this.placeholder());

  // Feed the filled-state directive from the resolved selection so `.filled`
  // reflects both a bound [value] and an in-component selection.
  private readonly _filledState = inject(IwElementFilledStateDirective<T | null>);

  // Bridges the component to a reactive form ([formControl]/[formControlName]).
  private readonly _formControl = inject(IwElementFormControlDirective<T | null>);

  constructor() {
    this._filledState.registerStream(toObservable(this.selectedValue));

    // Reflect the reactive-form value into the displayed selection — covers the
    // initial value and any external form updates.
    effect((onCleanup) => {
      const control = this._formControl.control();
      if (!control) return;

      this._selectedValue.set((control.value ?? null) as T | null);
      const sub = control.valueChanges.subscribe((value) =>
        this._selectedValue.set((value ?? null) as T | null),
      );
      onCleanup(() => sub.unsubscribe());
    });
  }

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

  isSelected(item: SelectItem<T>): boolean {
    const selected = this.selectedValue();
    return selected !== null && this.compareWith()(item.original, selected);
  }

  selectItem(item: SelectItem<T>) {
    // Update internal state
    this._selectedValue.set(item.original);

    // Push to the reactive form (ControlValueAccessor) so [formControl] updates.
    this._formControl.changeValue(item.original);

    // Close dropdown
    this.dropdown().hide();

    // Emit the change
    this.valueChanged.emit(item.original);
  }

  clearSelection() {
    this._selectedValue.set(null);
    this._formControl.changeValue(null);
    this.valueChanged.emit(null as any); // Or handle this based on your needs
  }
}
