import { type TemplateRef } from '@angular/core';

/** The side of the trigger the panel opens from. */
export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';

/**
 * Alignment along the cross axis. The values match the `.position-*` classes
 * the generated mixins key their arrow geometry off.
 */
export type PopoverAlign = 'start' | 'middle' | 'end';

export type PopoverVariant = 'popover' | 'tooltip' | 'dropdown';

export type PopoverTrigger = 'hover' | 'click' | 'manual';

export type PopoverContent = string | TemplateRef<unknown>;

export type PopoverContext = Record<string, unknown>;

export interface PopoverOptions {
  content: PopoverContent;

  /** Preferred side; flipped automatically when it does not fit. */
  side: PopoverSide;

  align: PopoverAlign;

  trigger: PopoverTrigger;

  /** Gap between trigger and panel, in px. */
  offset: number;

  /** Minimum distance the panel keeps from the viewport edge, in px. */
  viewportPadding: number;

  showDelay: number;

  hideDelay: number;

  arrow: boolean;

  /** Stretch the panel to the trigger width, as the select needs. */
  matchTriggerWidth: boolean;

  disabled: boolean;

  context: PopoverContext;

  /** Panel ARIA role: `listbox` for the select, `tooltip` for hints. */
  role: string | null;

  panelClass: string;
}

/** What a directive accepts: content directly, or an options object. */
export type PopoverInput = PopoverContent | Partial<PopoverOptions>;
