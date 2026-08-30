import { type PopoverAlign, type PopoverSide } from './popover.model';

export interface PopoverRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface PopoverSize {
  width: number;
  height: number;
}

export interface PopoverPositionRequest {
  trigger: PopoverRect;
  panel: PopoverSize;
  viewport: PopoverSize;
  side: PopoverSide;
  align: PopoverAlign;
  offset: number;
  viewportPadding: number;
}

export interface PopoverPositionResult {
  top: number;
  left: number;
  /** The resolved side, which a flip may have changed. */
  side: PopoverSide;
  align: PopoverAlign;
}

const OPPOSITE: Record<PopoverSide, PopoverSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

const isVertical = (side: PopoverSide) => side === 'top' || side === 'bottom';

/**
 * Positioning in viewport coordinates, the panel being `position: fixed`.
 *
 * Only two behaviours are needed: flip when the chosen side has no room, and
 * clamp along the cross axis so the panel stays on screen.
 */
export function computePopoverPosition(request: PopoverPositionRequest): PopoverPositionResult {
  const side = resolveSide(request);

  return {
    ...mainAxis(request, side),
    ...crossAxis(request, side),
    side,
    align: request.align,
  } as PopoverPositionResult;
}

/** Room between the trigger and the viewport edge on the given side. */
function availableSpace(side: PopoverSide, request: PopoverPositionRequest): number {
  const { trigger, viewport } = request;

  switch (side) {
    case 'top': return trigger.top;
    case 'bottom': return viewport.height - (trigger.top + trigger.height);
    case 'left': return trigger.left;
    case 'right': return viewport.width - (trigger.left + trigger.width);
  }
}

function requiredSpace(side: PopoverSide, request: PopoverPositionRequest): number {
  const size = isVertical(side) ? request.panel.height : request.panel.width;

  return size + request.offset + request.viewportPadding;
}

function resolveSide(request: PopoverPositionRequest): PopoverSide {
  const preferred = request.side;

  if (availableSpace(preferred, request) >= requiredSpace(preferred, request)) {
    return preferred;
  }

  const opposite = OPPOSITE[preferred];

  if (availableSpace(opposite, request) >= requiredSpace(opposite, request)) {
    return opposite;
  }

  // Neither side fits: fall back to whichever has more room.
  return availableSpace(opposite, request) > availableSpace(preferred, request)
    ? opposite
    : preferred;
}

function mainAxis(request: PopoverPositionRequest, side: PopoverSide) {
  const { trigger, panel, offset } = request;

  switch (side) {
    case 'top': return { top: trigger.top - panel.height - offset };
    case 'bottom': return { top: trigger.top + trigger.height + offset };
    case 'left': return { left: trigger.left - panel.width - offset };
    case 'right': return { left: trigger.left + trigger.width + offset };
  }
}

function crossAxis(request: PopoverPositionRequest, side: PopoverSide) {
  const { trigger, panel, viewport, align, viewportPadding } = request;
  const vertical = isVertical(side);

  const triggerStart = vertical ? trigger.left : trigger.top;
  const triggerSize = vertical ? trigger.width : trigger.height;
  const panelSize = vertical ? panel.width : panel.height;
  const viewportSize = vertical ? viewport.width : viewport.height;

  let value: number;

  switch (align) {
    case 'start':
      value = triggerStart;
      break;
    case 'end':
      value = triggerStart + triggerSize - panelSize;
      break;
    default:
      value = triggerStart + triggerSize / 2 - panelSize / 2;
  }

  const clamped = clamp(value, viewportPadding, viewportSize - panelSize - viewportPadding);

  return vertical ? { left: clamped } : { top: clamped };
}

function clamp(value: number, min: number, max: number): number {
  // In a very narrow viewport max can fall below min; pin to min then.
  return Math.max(min, Math.min(value, Math.max(min, max)));
}
