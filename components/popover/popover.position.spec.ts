import { computePopoverPosition, type PopoverPositionRequest } from './popover.position';

const base: PopoverPositionRequest = {
  trigger: { top: 300, left: 300, width: 100, height: 40 },
  panel: { width: 200, height: 100 },
  viewport: { width: 1000, height: 800 },
  side: 'bottom',
  align: 'middle',
  offset: 8,
  viewportPadding: 8,
};

const req = (patch: Partial<PopoverPositionRequest>) => ({ ...base, ...patch });

describe('computePopoverPosition', () => {
  it('places the panel below the trigger, honouring the offset', () => {
    const result = computePopoverPosition(base);

    expect(result.side).toBe('bottom');
    expect(result.top).toBe(348); // 300 + 40 + 8
  });

  it('centres on the cross axis for align=middle', () => {
    const result = computePopoverPosition(base);

    expect(result.left).toBe(250); // 300 + 50 - 100
  });

  it('aligns to the trigger edges for start and end', () => {
    expect(computePopoverPosition(req({ align: 'start' })).left).toBe(300);
    expect(computePopoverPosition(req({ align: 'end' })).left).toBe(200); // 300 + 100 - 200
  });

  it('flips the side when there is no room below', () => {
    const result = computePopoverPosition(req({
      trigger: { top: 740, left: 300, width: 100, height: 40 },
    }));

    expect(result.side).toBe('top');
    expect(result.top).toBe(632); // 740 - 100 - 8
  });

  it('flips horizontally too', () => {
    const result = computePopoverPosition(req({
      side: 'right',
      trigger: { top: 300, left: 900, width: 90, height: 40 },
    }));

    expect(result.side).toBe('left');
    expect(result.left).toBe(692); // 900 - 200 - 8
  });

  it('keeps the panel off the left edge', () => {
    const result = computePopoverPosition(req({
      trigger: { top: 300, left: 0, width: 20, height: 40 },
    }));

    expect(result.left).toBe(8); // pinned to viewportPadding
  });

  it('keeps the panel off the right edge', () => {
    const result = computePopoverPosition(req({
      trigger: { top: 300, left: 980, width: 20, height: 40 },
    }));

    expect(result.left).toBe(792); // 1000 - 200 - 8
  });

  it('picks the roomier side when neither fits', () => {
    const result = computePopoverPosition(req({
      viewport: { width: 1000, height: 150 },
      trigger: { top: 60, left: 300, width: 100, height: 40 },
    }));

    // 50 below versus 60 above: the roomier side wins
    expect(result.side).toBe('top');
  });

  it('keeps the preferred side when it has the most room', () => {
    const result = computePopoverPosition(req({
      side: 'top',
      viewport: { width: 1000, height: 150 },
      trigger: { top: 60, left: 300, width: 100, height: 40 },
    }));

    expect(result.side).toBe('top');
  });

  it('aligns along the vertical axis for a horizontal side', () => {
    const start = computePopoverPosition(req({ side: 'right', align: 'start' }));
    expect(start.top).toBe(300);

    const end = computePopoverPosition(req({ side: 'right', align: 'end' }));
    expect(end.top).toBe(240);

    const middle = computePopoverPosition(req({ side: 'right', align: 'middle' }));
    expect(middle.top).toBe(270);
    expect(middle.left).toBe(408);
  });

  it('pins to the padding when the panel is larger than the viewport', () => {
    const result = computePopoverPosition(req({
      panel: { width: 2000, height: 100 },
    }));

    expect(result.left).toBe(8);
  });
});
