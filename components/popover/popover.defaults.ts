import { type PopoverOptions, type PopoverVariant } from './popover.model';

const BASE: PopoverOptions = {
  content: '',
  side: 'bottom',
  align: 'middle',
  trigger: 'click',
  offset: 8,
  viewportPadding: 8,
  showDelay: 0,
  hideDelay: 0,
  arrow: false,
  matchTriggerWidth: false,
  disabled: false,
  context: {},
  role: null,
  panelClass: '',
};

/**
 * The three directives differ only by preset and the panel modifier class.
 */
export const POPOVER_DEFAULTS: Record<PopoverVariant, PopoverOptions> = {
  popover: { ...BASE },

  tooltip: {
    ...BASE,
    side: 'top',
    trigger: 'hover',
    arrow: true,
    showDelay: 500,
    hideDelay: 100,
    role: 'tooltip',
  },

  dropdown: {
    ...BASE,
    side: 'bottom',
    align: 'start',
    trigger: 'click',
    matchTriggerWidth: true,
  },
};
