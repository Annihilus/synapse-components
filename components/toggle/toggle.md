# toggle

## Description

Description
Toggle is a switch for instant on/off of a single option (unlike Checkbox, it does not require form confirmation; changes apply immediately). There is no indeterminate state.

Behavior
Click toggles the Checked state instantly. On hover over the track — hover overlay hover/hover-color (rgba(255,255,255,0.12)). On focus — focus-ring shadow 0 0 0 2px border/outline-variant (#3b3b3b), track background does not change. Thumb shifts right when Checked=True.

States
- Default (Checked=False) — track bg/surface-highest (#727272), thumb bg/surface-container (#2a2a2a)
- Hover — track + overlay hover/hover-color (rgba(255,255,255,0.12))
- Focus — focus-ring shadow 0 0 0 2px border/outline-variant (#3b3b3b)
- Disabled — track bg/disabled-surface (#3b3b3b)
- Checked=True — track bg/primary (#7f56d9), thumb text-and-icons/on-primary (#f1f1f1), shifted right
- Checked=True + Disabled — track bg/disabled-surface (#3b3b3b), thumb text-and-icons/on-surface (#f1f1f1) opacity disabled/disabled-number (0.32)

Element Anatomy
- Track — pill shape 36x20px, border-radius radius/full (1000px), padding 2px
- Thumb (indicator) — circle 16px, shadow shadow/sm
- State overlay — layer over track for hover effect

Sizes and Spacing
- Track size: 36x20px (fixed, no Size variants)
- Border-radius: radius/full — 1000px
- Padding: 2px
- Thumb: 16px

When to Use / Not Use
Use: instant on/off of a single option without form confirmation.
Do not use: when change requires form confirmation (use Checkbox); selecting one of several mutually exclusive options (use Radio).

Accessibility
Keyboard navigation: Tab to focus, Space to toggle.

Tokens / Variables
- bg/surface-highest — #727272 (track, Checked=False)
- bg/primary — #7f56d9 (track, Checked=True)
- bg/disabled-surface — #3b3b3b (track, Disabled)
- bg/surface-container — #2a2a2a (thumb, Checked=False)
- text-and-icons/on-primary — #f1f1f1 (thumb, Checked=True)
- text-and-icons/on-surface — #f1f1f1 (thumb, Checked=True+Disabled, opacity 0.32)
- border/outline-variant — #3b3b3b (focus-ring shadow)
- hover/hover-color — rgba(255,255,255,0.12) (hover overlay)
- disabled/disabled-number — 0.32
- radius/full — 1000px

Related Components
Toggle-Label — the same Toggle with a text label and optional description. Toggle-Group — vertical group of Toggle-Labels. Checkbox — alternative when form confirmation is needed. Radio — alternative for mutually exclusive selection.

## Variants

- `checked`: boolean
- `hover`: boolean
- `focus`: boolean
- `disabled`: boolean

## Structure

- RECTANGLE "state"
- RECTANGLE "indicator"
