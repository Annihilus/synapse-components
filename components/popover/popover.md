# popover

## Description

Description
A floating container with free-form content (children slot). Unlike Tooltip, it can contain any content (not just text): lists, forms, buttons, arbitrary markup. Opens on hover OR on click.

Behavior
Appears next to the trigger element. The direction and arrow anchor point are set by the Side and Position variants. Opens on hover/focus (like Tooltip) or on click — with a click trigger, it usually requires dismissal by clicking outside the popover or re-clicking the trigger. The Side=No/Position=No variant has no arrow, for arbitrary positioning.

States
- Default — the only container state, differences only in direction (Side/Position)

Component types
- Side=Top / Bottom / Left / Right — display direction, arrow points to the trigger
- Side=No, Position=No — no arrow, arbitrary positioning
- Position=Start / Middle / End — arrow offset along the side

Appearance on different devices
- Mobile: hover trigger is unavailable, click/tap trigger is recommended
- Desktop: supports hover/focus and click

Element anatomy
- Popover-Base — base block with shadow
- content — slot container, bg bg/surface-high (#3b3b3b), padding 12/8px, gap 4px, radius/m (8px)
- children (slot) — arbitrary content, default text example (small 12/16, on-surface)
- arrow — pointer triangle 16x6px (Top/Bottom) or 6x16px (Left/Right), absent for Side=No/Position=No

Sizes and spacing
- Content padding: 12px horizontal, 8px vertical
- Content gap: 4px
- Border radius: radius/m — 8px
- Shadow: shadow/lg 0px 12px 16px rgba(10,13,18,0.08), 0px 4px 6px rgba(10,13,18,0.03)
- arrow offset (Start/End): 8px from edge; (Middle): centered 50%
- arrow distance from block: 6px

Min / Max sizes
- Min/Max width: not set — by slot content
- Min/Max height: not set — by content

When to use / not to use
- Use: need a container with arbitrary content (form, list, actions); need opening on both hover and click
- Do not use: simple text tooltip — Tooltip; modal blocking dialog — Modal; required information — move to permanent UI text

Customization
- side: Top / Bottom / Left / Right / No, default Bottom
- position: Start / Middle / End / No, default Middle
- children: arbitrary content (slot)

Accessibility
- ARIA role: dialog (click trigger with interactive content) / tooltip (hover trigger with text content)
- ARIA attributes: aria-describedby or aria-controls on the trigger; aria-expanded for click trigger
- Keyboard: appears on trigger focus/click (Tab/Enter), disappears on focus loss or Escape; Tab moves through interactive content inside

Interactivity (events)
- onShow — hover/focus on trigger (hover mode) or click on trigger (click mode)
- onHide — cursor leaves/focus lost (hover mode), click outside popover or re-click trigger (click mode), Escape

Related components
- Tooltip — simplified variant with text-only content on hover/focus only
- Helper-Text — contextual messages with actions, tied to a content block
- Modal — blocking dialogs requiring mandatory interaction

Tokens / variables
- bg/surface-high: #3b3b3b
- text-and-icons/on-surface: #f1f1f1
- radius/m: 8px
- font/size/small: 12px
- font/line-height/small: 16px
- shadow/lg: 0px 12px 16px rgba(10,13,18,0.08), 0px 4px 6px rgba(10,13,18,0.03)

## Variants

- `position`: 'middle' | 'no' | 'start' | 'end'
- `side`: 'bottom' | 'no' | 'top' | 'left' | 'right'

## Structure

- INSTANCE "wrap" (component instance)
- FRAME "arrow" — when `position` is `end` or `middle` or `start`
  - VECTOR "bottom-center"
