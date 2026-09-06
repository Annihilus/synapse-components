# icon-button

## Description

Description
Icon-Button — a compact button with a single icon and no text. Used for secondary actions in toolbars, headers, and lists (e.g., close, edit, more menu).

Behavior
Switches via props type (Primary/Secondary), hover, active, disabled. On hover, a semi-transparent overlay appears on top (hover/hover-color). On active, the background fills with bg/surface-high. Disabled reduces content opacity.

States
- Default — icon with no background, transparent container
- Hover — semi-transparent hover/hover-color layer (rgba(255,255,255,0.12)) on top
- Active — bg/surface-high (#3b3b3b) background, active color icon
- Disabled — content opacity reduced (disabled/disabled-number), no hover/active

Component types
- Primary — accent version (icon/color primary when active)
- Secondary — neutral version (default)

Element anatomy
- state — hover/active layer, absolute inset-0
- icon — 16x16px, centered

Sizes and spacing
- Size: 20x20px
- Padding: 2px
- Border radius: radius/xs (4px)
- icon: 16x16px

When to use / not to use
Use: need a compact action without a label (close, edit, menu), space is limited.
Do not use: action requires explicit text explanation — use Button; action is critical and must be prominent — use Button (Primary).

Customization
- type: Primary/Secondary, default Secondary
- hover: True/False, default False
- active: True/False, default False
- disabled: True/False, default False
- icon: any icon

Accessibility
- ARIA role: button
- ARIA attributes: aria-label is required (no visible text), aria-disabled
- Keyboard: Tab to focus, Enter/Space to activate

Interactivity (events)
- onClick — click on the button (not disabled)
- onFocus — keyboard focus

Tokens / variables
- bg/surface-high — #3b3b3b
- hover/hover-color — rgba(255,255,255,0.12)
- disabled/disabled-number — disabled state opacity value
- radius/xs — 4px

Related components
Button — full-size button with text, used when a label is needed. Tab — uses a similar action icon pattern internally.

## Variants

- `hover`: boolean
- `disabled`: boolean
- `active`: boolean
- `type`: 'secondary' | 'primary'

## Structure

- RECTANGLE "state"
- INSTANCE "icon" (component instance)
