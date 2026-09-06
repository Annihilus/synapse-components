# dropdown-item

## Description

Description
Dropdown-Item — an auxiliary list item component inside the Dropdown slot. Not a standalone component.

States
- Default (not hover, not selected, not disabled) — background bg/surface-container (#2a2a2a)
- Hover — overlay background hover/hover-color (rgba(255,255,255,0.12))
- Selected=True — background bg/surface-high (#3b3b3b)
- Disabled — icon/text/hint with opacity disabled/disabled-number (0.32), click disabled

Element Anatomy
- Checkbox — optional 20x20px checkbox on the left (checkbox=True/False, multiple selection)
- Icon — optional 20px icon (icon=True/False)
- Text-block — main text (font/size/body1, 16px) + optional description (description=True/False, font/size/small, 12px, text-and-icons/on-surface-variant)
- Hint — optional text on the right (hint=True/False), text-and-icons/on-surface-low (#a5a5a5)

Sizes and Spacing
- Padding: 8px horizontal, 6px vertical
- Border-radius: radius/m (8px)
- Gap between elements: 6px

Customization
- checkbox: True/False, default False
- icon: True/False, default True
- description: True/False, default True
- hint: True/False, default True
- selected: True/False, default False
- disabled: True/False, default False

Tokens / Variables
- bg/surface-container — #2a2a2a
- bg/surface-high — #3b3b3b (Selected)
- hover/hover-color — rgba(255,255,255,0.12)
- disabled/disabled-number — 0.32
- text-and-icons/on-surface — #f1f1f1
- text-and-icons/on-surface-variant — #d7d7d7 (description)
- text-and-icons/on-surface-low — #a5a5a5 (hint)
- radius/m — 8px
- font/size/body1 — 16px
- font/size/small — 12px

Related Components
Dropdown — container using Dropdown-Item in the slot. Checkbox — used inside when checkbox=True.

## Variants

- `hover`: boolean
- `selected`: boolean
- `disabled`: boolean

## Structure

- RECTANGLE "state"
- INSTANCE "icon_placeholder" (component instance)
- FRAME "text_block"
  - TEXT "text"
- TEXT "hint"
