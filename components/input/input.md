# input

## Description

Description
Input is a text field for user data entry. It is used in forms to collect arbitrary text.

Behavior
The field supports an optional label (with a required mark * and a tooltip icon), left and right icons, and a reset button (IconButton). When focused, a blinking caret cursor appears and the border changes color with a focus-ring effect. There is a compact version without border, label, and tooltip (Stroke=False) for inline use, and a full version with border, label, and tooltip (Stroke=True).

States
- Default — normal state, field is empty
- Filled — field contains entered text (Filled=True)
- Hover — cursor is over the field
- Focus — border changes color to border/outline (#d7d7d7) with a focus-ring shadow 0 0 0 2px border/outline-variant (#3b3b3b), caret cursor is visible inside the field (text-and-icons/on-surface, #f1f1f1)
- Active — field is active
- Disabled — field is not interactive
- Error — validation error, border border/outline-danger (#e64e41), hint text text-and-icons/danger (#e64e41)

Component variants (Stroke)
- Stroke=True — full version: border, background bg/surface-dim (#1e1e1e), supports label and hint, border-radius radius/m (8px), field height 40px
- Stroke=False — compact version without border, label, and hint, for inline use, border-radius radius/s (6px), padding 4px, gap 8px

Element anatomy
- Label — optional label above the field, contains text, required mark (*) and question icon (tooltip), only with Stroke=True
- Left icon — optional icon on the left (leftIcon)
- Caret — blinking input cursor, visible in Focus state (text-and-icons/on-surface, #f1f1f1)
- Value / Placeholder — entered text (text-and-icons/on-surface, #f1f1f1) or placeholder (text-and-icons/on-surface-low, #a5a5a5)
- Right icon — optional icon on the right (rightIcon)
- Button (IconButton) — reset button, 20px, border-radius radius/xs (4px), contains 16px icon
- Hint — optional hint below the field (text-and-icons/on-surface-low, on error — text-and-icons/danger), only with Stroke=True

Sizes and spacing
Fixed size, no Size variant.
- Field height (Stroke=True): 40px
- Field padding (Stroke=True): 12px horizontal, 8px vertical
- Gap between elements inside the field: 8px
- Gap between Label / field / Hint: 6px
- Padding (Stroke=False): 4px, gap 8px
- Border-radius (Stroke=True): radius/m — 8px
- Border-radius (Stroke=False): radius/s — 6px
- Border-radius (Button): radius/xs — 4px
- Value text: font/size/body2 (14px), line-height body2 (20px)
- Label/hint text: font/size/body2 (14px), line-height body2-condensed (16px)

When to use / not use
Use for free text, numbers, or other arbitrary data entry in forms.
Do not use for selecting a value from a closed list of options (use Select).

Accessibility
Supports keyboard navigation and input. Disabled state excludes the field from focus. The question icon in the label implies a tooltip for additional context.

Tokens / variables
- bg/surface-dim — #1e1e1e (field background)
- border/outline-variant — #3b3b3b (default border, focus-ring shadow)
- border/outline — #d7d7d7 (border in Focus)
- border/outline-danger — #e64e41 (border in Error)
- text-and-icons/on-surface — #f1f1f1 (value text, caret)
- text-and-icons/on-surface-low — #a5a5a5 (placeholder, label, hint)
- text-and-icons/danger — #e64e41 (hint text on error)
- radius/m — 8px (Stroke=True)
- radius/s — 6px (Stroke=False)
- radius/xs — 4px (Button/IconButton)
- font/size/body2 — 14px
- font/line-height/body2 — 20px (value)
- font/line-height/body2-condensed — 16px (label/hint)

Related components
Select — alternative for choosing a value from a list. Button — used together in forms.

## Variants

- `filled`: boolean
- `hover`: boolean
- `active`: boolean
- `focus`: boolean
- `disabled`: boolean
- `error`: boolean
- `inline`: boolean

## Structure

- INSTANCE "Label" (component instance) — when `inline` is `false`
- FRAME "input"
  - INSTANCE "icon" (component instance)
  - FRAME "text-block"
    - TEXT "text"
    - INSTANCE "_Caret" (component instance) — present in 8/24 variants
  - INSTANCE "Icon-Button" (component instance)
- TEXT "hint" — when `inline` is `false`
