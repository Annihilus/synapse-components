# checkbox

## Description

Description
Checkbox is the basic checkbox for binary selection (on/off) or part of a group (see Checkbox-Group). It supports an Indeterminate state for partial selection in groups.

Behavior
Clicking toggles the Checked state. Indeterminate=True is displayed alongside Checked=True as a separate icon (dash), used when some child elements of the group are selected while others are not. On focus, a background bg/surface-container (#2a2a2a) appears along with a focus-ring shadow 0 0 0 2px border/outline-variant (#3b3b3b).

States
- Default (Checked=False) — empty square, border border/outline (#d7d7d7)
- Checked=True — inside is a check icon (16px)
- Indeterminate=True (along with Checked=True) — inside is a remove/dash icon (16px), indicating partial selection
- Hover — cursor is over the checkbox (visual details not checked separately)
- Focus — background bg/surface-container (#2a2a2a), focus-ring shadow 0 0 0 2px border/outline-variant (#3b3b3b)
- Disabled — checkbox is not available for interaction (visual details not checked separately)

Anatomy of the element
- Box — square 20x20px, border 1px border/outline (#d7d7d7), border-radius radius/s (6px)
- Check icon — check icon 16px, visible when Checked=True
- Remove icon — dash icon 16px, visible when Indeterminate=True

Sizes and spacing
- Size: 20x20px (fixed, no Size variants)
- Border-radius: radius/s — 6px
- Border width: 1px

When to use / not use
Use: binary selection of a single value (agreement, enabling an option), multiple selection in a group (Checkbox-Group).
Do not use: selection of a single value from mutually exclusive options (use Radio).

Accessibility
Supports keyboard navigation (Tab, Space to toggle). Indeterminate conveys an intermediate state programmatically (not through user click).

Tokens / variables
- border/outline — #d7d7d7 (border)
- bg/surface-container — #2a2a2a (background in Focus)
- border/outline-variant — #3b3b3b (focus-ring shadow)
- radius/s — 6px

Related components
Checkbox-Label — the same Checkbox with a text label and optional description. Checkbox-Group — vertical group of Checkbox-Label with fixed spacing.

## Variants

- `checked`: boolean
- `indeterminate`: boolean
- `hover`: boolean
- `focus`: boolean
- `disabled`: boolean

## Structure

- RECTANGLE "state"
- INSTANCE "check" (component instance) — when `checked` is `true` and `indeterminate` is `false`
- INSTANCE "remove" (component instance) — when `indeterminate` is `true`
