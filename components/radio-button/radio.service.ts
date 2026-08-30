import { Injectable, signal } from '@angular/core';

let nextGroupId = 0;

@Injectable()
export class SynapseRadioService<T = unknown> {
  /** Grouping the native inputs is what gives arrow keys and one tab stop. */
  readonly groupName = `syn-radio-group-${nextGroupId++}`;

  readonly selected = signal<T | undefined>(undefined);

  readonly disabled = signal(false);

  readonly compareWith = signal<(a: T, b: T) => boolean>((a, b) => a === b);

  /** Installed by the group so a button can request a new value. */
  select: (value: T) => void = () => { /* set by the group */ };

  isSelected(value: T): boolean {
    const current = this.selected();

    return current !== undefined && this.compareWith()(value, current);
  }
}
