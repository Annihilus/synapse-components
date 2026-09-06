# radio-button

## Description

Description
Radiobutton is a toggle for selecting one value from multiple mutually exclusive options within a group. It does not support Indeterminate or multiple selections.

Behavior
Click toggles the Checked state (in a group, selecting one radio button deselects others — group logic). On Hover — overlay hover/hover-color (rgba(255,255,255,0.12)) over the circle. On Focus — background bg/surface-container (#2a2a2a) + focus-ring shadow 0 0 0 2px border/outline-variant (#3b3b3b). When Checked=True, an 8px dot text-and-icons/primary (#b299e7) appears inside.

States
- Default (Checked=False) — empty circle, border border/outline (#d7d7d7)
- Hover — overlay hover/hover-color (rgba(255,255,255,0.12))
- Focus — background bg/surface-container (#2a2a2a) + focus-ring shadow 0 0 0 2px border/outline-variant (#3b3b3b)
- Disabled — border border/disabled-outline (rgba(215,215,215,0.32))
- Checked=True — 8px dot text-and-icons/primary (#b299e7)
- Checked=True + Disabled — border border/disabled-outline, dot opacity disabled/disabled-number (0.32)

Element Anatomy
- Circle — 20x20px circle, 1px border border/outline (#d7d7d7), border-radius radius/full (1000px)
- Dot (check) — inner 8px circle, text-and-icons/primary (#b299e7), visible when Checked=True
- State overlay — inset -1px layer over the circle for hover effect

Sizes and Spacing
- Size: 20x20px (fixed, no Size variants)
- Border-radius: radius/full — 1000px
- Border width: 1px
- Dot size: 8px

When to Use / Not Use
Use: selecting one value from mutually exclusive options (in a group).
Do not use: multiple selection (use Checkbox-Group); independent instant on/off (use Toggle).

Accessibility
role="radiogroup" on container, radio on elements. Keyboard navigation: Tab to group, arrows between options, Space to select.

Tokens / Variables
- border/outline — #d7d7d7 (border)
- border/disabled-outline — rgba(215,215,215,0.32) (border, Disabled)
- bg/surface-container — #2a2a2a (background on Focus)
- border/outline-variant — #3b3b3b (focus-ring shadow)
- text-and-icons/primary — #b299e7 (dot, Checked)
- disabled/disabled-number — 0.32
- radius/full — 1000px

Related Components
Radiobutton-Label — same Radiobutton with text label and optional description. Radio-Group — vertical group of Radiobutton-Label. Checkbox — alternative for multiple selection. Toggle — alternative for independent on/off.

## Variants

- `checked`: boolean
- `hover`: boolean
- `focus`: boolean
- `disabled`: boolean

## Structure

- RECTANGLE "state"
- RECTANGLE "check" — when `checked` is `true`
