# segmented

## Description

Description
Segmented is a segmented control switch. A container of auxiliary Segmented-Item elements among which the user selects one active option. Used as a compact replacement for a group of tabs/radio buttons.

Behavior
Auto-layout horizontal, gap 4px, padding 4px, wraps several Segmented-Item. Variant "number" (2-7) — demo parameter for number of items in container, not a production property.

States
- Default — container with items, background bg/surface-high (#3b3b3b)

Element Anatomy
- Segmented-Item (×N) — icon (optional) + text (optional), auxiliary component

Sizes and Spacing
- Gap between items: 4px
- Padding: 4px
- Border radius: radius/l (12px)
- Background: bg/surface-high (#3b3b3b)

When to Use / Not Use
Use: when you need to select one option from a small fixed set (2-7), all options must be visible simultaneously.
Do not use: many options (>7) — use Dropdown or Tab-Panel; need multiple selection — use Checkbox group.

Accessibility
- ARIA role: radiogroup (Segmented) / radio (Segmented-Item)
- ARIA attributes: aria-checked on selected item, aria-disabled
- Keyboard: Tab — focus on group, arrows — switch between items, focus-ring rgba(114,114,114,0.5) (= bg/surface-highest at 50% opacity)

Interactivity (Events)
- onClick — click on Segmented-Item (not disabled) — switch to Selected, deselect neighboring items
- onFocus — keyboard focus on Segmented-Item — show focus-ring

Tokens / Variables
- bg/surface-high — #3b3b3b
- radius/l — 12px

Related Components
Segmented-Item — auxiliary component used inside the container. Tab-Panel, Dropdown, Radio-Group — alternative selection patterns.

## Variants

- `icon`: boolean
- `text`: boolean

## Structure

- INSTANCE "Segmented-Item" (component instance)
