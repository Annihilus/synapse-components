# select

## Description

Description
Select is a dropdown list for choosing a single value from a set of options. It is used in forms to collect structured data.

Behavior
Clicking the field opens the list of options. The field supports optional label and hint, as well as a left icon. When a value is selected, a reset button may appear. There is a compact variant without a border (Stroke=False) for inline use, and a full variant with border, label, and hint (Stroke=True).

States
- Default — normal state, field is empty
- Filled — field contains a selected value (Filled=True)
- Hover — cursor is over the field
- Focus — field is focused, border changes color to border/outline (#d7d7d7) with a focus-ring shadow 0 0 0 2px border/outline-variant (#3b3b3b)
- Active — field is active (list is open)
- Disabled — field is not interactive
- Error — validation error, border is border/outline-danger (#e64e41), hint text is text-and-icons/danger (#e64e41)

Component variants (Stroke)
- Stroke=True — full variant: border, background bg/surface-dim (#1e1e1e), supports label and hint, border-radius radius/m (8px)
- Stroke=False — compact variant without border, for inline use inside other components, border-radius radius/s (6px)

Element anatomy
- Label — optional label above the field
- Field — the selection field with background and border (only with Stroke=True)
- Left icon — optional icon on the left (leftIcon)
- Value / Placeholder — selected value (text-and-icons/on-surface, #f1f1f1) or placeholder (text-and-icons/on-surface-low, #a5a5a5)
- Reset button — button to clear the value (showReset), border-radius radius/xs (4px), visible only when Filled=True
- Chevron icon — icon on the right indicating the dropdown
- Hint — optional hint below the field (text-and-icons/on-surface-low, or text-and-icons/danger if error)

Sizes and spacing
Fixed size, no Size variant.
- Border-radius (Stroke=True): radius/m — 8px
- Border-radius (Stroke=False): radius/s — 6px
- Border-radius (Reset button): radius/xs — 4px
- Value text height: font/size/body2 (14px), line-height body2 (20px)
- Label/hint text height: font/size/body2 (14px), line-height body2-condensed (16px)

When to use / not use
Use for selecting a single value from a closed list of options in a form.
Do not use for multiple selection (use Multiselect) or free text input (use Input).

Accessibility
Supports keyboard navigation (opening list, moving through options, selection). Disabled state excludes the field from focus.

Tokens / variables
- bg/surface-dim — #1e1e1e (field background)
- border/outline-variant — #3b3b3b (default border, focus-ring shadow)
- border/outline — #d7d7d7 (border on Focus)
- border/outline-danger — #e64e41 (border on Error)
- text-and-icons/on-surface — #f1f1f1 (value text)
- text-and-icons/on-surface-low — #a5a5a5 (placeholder, hint)
- text-and-icons/danger — #e64e41 (hint text on error)
- radius/m — 8px (Stroke=True)
- radius/s — 6px (Stroke=False)
- radius/xs — 4px (Reset button)
- font/size/body2 — 14px
- font/line-height/body2 — 20px (value)
- font/line-height/body2-condensed — 16px (label/hint)

Related components
Button — used together in forms. Input — alternative for free text input.

## Variants

- `filled`: boolean
- `hover`: boolean
- `active`: boolean
- `focus`: boolean
- `disabled`: boolean
- `error`: boolean
- `inline`: boolean

## Structure

- INSTANCE "label" (component instance) — when `inline` is `false`
- FRAME "select"
  - INSTANCE "icon" (component instance)
  - FRAME "text-block"
    - TEXT "text"
  - INSTANCE "open-btn" (component instance) — present in 20/24 variants
  - INSTANCE "reset" (component instance) — when `filled` is `true` and `inline` is `false`
  - INSTANCE "chevron_up" (component instance) — present in 4/24 variants
- TEXT "hint" — when `inline` is `false`
