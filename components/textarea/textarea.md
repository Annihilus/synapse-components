# textarea

## Description

Description
Textarea is a multi-line text input field for entering extended text. It is used in forms where long text input is required (comments, descriptions, messages).

Behavior
The field supports an optional label (with a required marker * and a tooltip icon) and a hint below the field. When content overflows, a scrollbar appears (showScroll). On focus, a blinking caret cursor appears and the border changes color with a focus-ring effect. Unlike Input and Select, it does not have Stroke variants, leftIcon, rightIcon, or a reset button — it always displays as a full field with a border.

States
- Default — normal state, field is empty
- Filled — field contains entered text (Filled=True)
- Hover — cursor is over the field
- Focus — border changes color to border/outline (#d7d7d7) with a focus-ring shadow 0 0 0 2px border/outline-variant (#3b3b3b), caret cursor is shown (text-and-icons/on-surface, #f1f1f1)
- Active — field is active
- Disabled — field is not interactive
- Error — validation error, border border/outline-danger (#e64e41), hint text text-and-icons/danger (#e64e41)

Element Anatomy
- Label — optional label above the field, includes text, required marker (*) and question icon (tooltip)
- Textarea box — multi-line input field, fixed height 120px, background bg/surface-dim (#1e1e1e), border-radius radius/m (8px)
- Caret — blinking input cursor, visible in Focus state (text-and-icons/on-surface, #f1f1f1)
- Value / Placeholder — entered text (text-and-icons/on-surface, #f1f1f1) or placeholder (text-and-icons/on-surface-low, #a5a5a5)
- Scrollbar (showScroll) — optional scrollbar when text overflows, thumb bg/surface-high (#3b3b3b), width 6px, border-radius radius/2xs (2px)
- Hint — optional hint below the field (text-and-icons/on-surface-low, error state uses text-and-icons/danger)

Sizes and Spacing
Fixed field height, no Size variant.
- Field height (textarea box): 120px
- Field padding: 12px horizontal, 10px vertical
- Gap between Label / field / Hint: 6px
- Border-radius (field): radius/m — 8px
- Border-radius (Scrollbar thumb): radius/2xs — 2px
- Value text: font/size/body2 (14px), line-height body2 (20px)
- Label/hint text: font/size/body2 (14px), line-height body2-condensed (16px)

When to Use / Not Use
Use for entering extended multi-line text (comments, descriptions, messages).
Do not use for short single-line input (use Input), or selecting a value from a list (use Select).

Accessibility
Supports keyboard navigation and multi-line keyboard input. Disabled excludes the field from focus. The question icon in the label implies a tooltip for additional context.

Tokens / Variables
- bg/surface-dim — #1e1e1e (field background)
- bg/surface-high — #3b3b3b (scrollbar thumb)
- border/outline-variant — #3b3b3b (default border, focus-ring shadow)
- border/outline — #d7d7d7 (border on Focus)
- border/outline-danger — #e64e41 (border on Error)
- text-and-icons/on-surface — #f1f1f1 (value text, caret)
- text-and-icons/on-surface-low — #a5a5a5 (placeholder, label, hint)
- text-and-icons/danger — #e64e41 (hint text on error)
- radius/m — 8px (field)
- radius/2xs — 2px (Scrollbar thumb)
- font/size/body2 — 14px
- font/line-height/body2 — 20px (value)
- font/line-height/body2-condensed — 16px (label/hint)

Related Components
Input — single-line input analog. Select — alternative for choosing a value from a list.

## Variants

- `filled`: boolean
- `hover`: boolean
- `active`: boolean
- `focus`: boolean
- `disabled`: boolean
- `error`: boolean

## Structure

- INSTANCE "Label" (component instance)
- FRAME "textarea"
  - FRAME "text-block"
    - TEXT "text"
    - INSTANCE "_Caret" (component instance) — present in 4/12 variants
- TEXT "hint"
