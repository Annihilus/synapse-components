# tab

## Description

Description
Tab — a tab within a Tab-Panel. Not a standalone component.

Behavior
On Hover — hover overlay background/hover-color (rgba(255,255,255,0.12)). Selected=True — permanent background bg/surface-high (#3b3b3b) and active text text-and-icons/on-surface (#f1f1f1) instead of muted text-and-icons/on-surface-variant (#d7d7d7). Disabled — transparency disabled/disabled-number (0.32), click unavailable.

States
- Default (not selected, not hover, not disabled) — no background, text on-surface-variant (#d7d7d7)
- Hover — hover overlay background color (rgba(255,255,255,0.12))
- Disabled — transparency 0.32, click unavailable
- Selected=True — background bg/surface-high (#3b3b3b), text on-surface (#f1f1f1)
- Selected=True + Hover — background bg/surface-high + hover overlay on top

Anatomy of the element
- Icon — optional 16px icon on the left (icon=True/False)
- Text — tab text, font/size/body2 (14px), font/line-height/body2 (20px)
- Actions — optional button on the right 20px (button=True/False, e.g., close tab)

Sizes and spacing
- Padding: 12px horizontally, 6px vertically
- Gap between icon/text/actions: 4px
- Border-radius: radius/s (6px)

Customization
- icon: True/False, default True
- button: True/False, default True
- selected: True/False, default False
- disabled: True/False, default False

Tokens / variables
- bg/surface-high — #3b3b3b (Selected)
- hover/hover-color — rgba(255,255,255,0.12)
- disabled/disabled-number — 0.32
- text-and-icons/on-surface — #f1f1f1 (Selected)
- text-and-icons/on-surface-variant — #d7d7d7 (Default)
- radius/s — 6px
- font/size/body2 — 14px

Related components
Tab-Panel — a container that gathers Tabs in a row.

## Variants

- `hover`: boolean
- `selected`: boolean
- `disabled`: boolean

## Structure

- RECTANGLE "state"
- INSTANCE "icon_placeholder" (component instance)
- TEXT "text"
- INSTANCE "actions" (component instance)
