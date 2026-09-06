# tag

## Description

Description
Tag — a small colored label (chip) with an icon, text, and a close button. Used for marking/categorizing items, displaying statuses, and filters. A single component with 14 color variants.

Behavior
Static compact container (auto-layout horizontal), has no hover/focus states by default. The close button is an interactive element inside; clicking it removes/hides the tag.

States
- Default — icon + text + close, background in the variant color

Component types
- Gray — bg gray/50 (#fdfdfd), text on-inverse-surface (#2a2a2a)
- Red — bg red/100 (#fbd0ca), text red/700 (#852119)
- Yellow — bg yellow/100 (#ffecce), text yellow/800 (#8f6007)
- Green — bg green/50 (#d1ffeb), text green/800 (#015b34)
- Blue — bg blue/50 (#ebf3ff), text blue/800 (#0d346e)
- Indigo — bg indigo/50 (#e9e9ff), text indigo/800 (#181c8a)
- Purple — bg purple/50 (#e8e3ff), text purple/800 (#34128c)
- Pink — bg pink/50 (#fdebf5), text pink/800 (#631543)
- Orange — bg orange/50 (#ffe7dd), text orange/800 (#632409)
- Teal — bg teal/50 (#d6faf7), text teal/800 (#114f4c)
- Cyan — bg cyan/50 (#e0f9fb), text cyan/800 (#135259)
- Lime — bg lime/50 (#f9fac6), text lime/800 (#4b4b0f)
- Brown — bg brown/50 (#fceeec), text brown/800 (#4d322d)
- BlueGray — bg blue-gray/50 (#dbdffa), text blue-gray/800 (#373d6e)

Element anatomy
- icon — 16x16px, left
- Text — label text
- close — 16x16px close icon, right

Sizes and spacing
- Gap: 4px
- Padding: 6px (x) / 2px (y)
- Border radius: radius/m (8px)
- Text: font/size/body2 (14px) / font/line-height/body2-condensed (16px), weight Medium

When to use / not to use
Use: need to mark/categorize an item (tag, status, filter), need a compact removable element.
Do not use: need an interactive toggleable status — use Toggle/Checkbox; need a large accent status — use Badge.

Customization
- color: Gray/Red/Yellow/Green/Blue/Indigo/Purple/Pink/Orange/Teal/Cyan/Lime/Brown/BlueGray, default Gray
- icon: any icon
- text: arbitrary text

Accessibility
- ARIA role: status / group (depending on usage context)
- ARIA attributes: aria-label on the close button ("Remove tag")
- Keyboard: Tab to the close button, Enter/Space to remove

Interactivity (events)
- onClose — click on the close icon — removes/hides the tag

Tokens / variables
- gray/50 — #fdfdfd
- red/100 — #fbd0ca, red/700 — #852119
- yellow/100 — #ffecce, yellow/800 — #8f6007
- green/50 — #d1ffeb, green/800 — #015b34
- blue/50 — #ebf3ff, blue/800 — #0d346e
- indigo/50 — #e9e9ff, indigo/800 — #181c8a
- purple/50 — #e8e3ff, purple/800 — #34128c
- pink/50 — #fdebf5, pink/800 — #631543
- orange/50 — #ffe7dd, orange/800 — #632409
- teal/50 — #d6faf7, teal/800 — #114f4c
- cyan/50 — #e0f9fb, cyan/800 — #135259
- lime/50 — #f9fac6, lime/800 — #4b4b0f
- brown/50 — #fceeec, brown/800 — #4d322d
- blue-gray/50 — #dbdffa, blue-gray/800 — #373d6e
- radius/m — 8px

Related components
Badge — parent group/frame in Figma where Tag is placed. Dropdown-Item — often used together with Tag (multi-select with tags).

## Variants

- `color`: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'orange' | 'teal' | 'cyan' | 'lime' | 'brown' | 'blueGray'

## Structure

- INSTANCE "container" (component instance)
