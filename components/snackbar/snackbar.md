# snackbar

## Description

Description
Popup notification of the Synapse Design System. Briefly reports the result of an action (info/success/warning/error), appears on top of the interface and disappears automatically or when dismissed by the user.

Behavior
Appears in the bottom-right corner of the screen with an entrance animation (slide/fade in). When multiple snackbars appear simultaneously, they stack vertically in the same corner. Dismissed by clicking the close button (close=True) or automatically by timeout (logic is outside the component).

States
- Default — appearance, message display
- Focus — on the close button, keyboard focus
- Active/Disabled/Loading — not applicable

Component types (Type)
- default — neutral icon
- success — check icon
- warning — exclamation triangle icon
- error — exclamation circle icon
The title text color does not change (always on-surface), only the icon changes.

Appearance on different devices
- Mobile — no separate variant, recommended to adapt position/width for smaller screens
- Desktop — fixed width 360px, position — bottom-right corner of the screen

Element anatomy
- icon_container — icon container, padding 4px
- icon — message type icon, 24x24px
- block — horizontal block text + close button
- Title — message text, text-and-icons/on-surface (#f1f1f1), Medium 16/20
- close button — optional (close=True/False), 24x24px, 16px icon inside

Sizes and spacing
- Height: 48px (fixed)
- Width: 360px (fixed)
- Padding: 8px
- Gap icon_container/block: 4px
- Border-radius: radius/l — 12px
- Border: 1px border/outline-variant (#3b3b3b)
- Background: bg/surface-container (#2a2a2a)
- Shadow: shadow/m
- block gap text/button: 8px
- close button: padding 4px, radius/btn-radius-small 6px

When to use / not to use
Use: brief notification about the result of an action, not interrupting the workflow.
Do not use: message is tied to a content block/form (use Helper-Text); user confirmation is required (use Modal); detailed actions/buttons are needed inside the notification (use Helper-Text).

Customization
- type: default / success / warning / error, default default
- close: True / False, default True

Accessibility
- ARIA role: status (alert for type=error)
- ARIA attributes: aria-live="polite" (assertive for error)
- Keyboard: Tab to the close button, Enter/Space to dismiss

Interactivity (events)
- onClose — click on the close button, hides the snackbar
- auto-dismiss — automatic hiding by timeout (logic is outside the component)

Tokens / variables
- bg/surface-container — #2a2a2a
- border/outline-variant — #3b3b3b
- text-and-icons/on-surface — #f1f1f1
- radius/l — 12px
- radius/btn-radius-small — 6px
- font/size/body1 — 16px
- font/line-height/body1-condensed — 20px
- shadow/m — 0px 4px 8px rgba(0,0,0,0.08), 0px 0px 4px rgba(0,0,0,0.04)

Related components
Icon-Button — close button pattern. Helper-Text — alternative for contextual messages tied to a content block, with action support.

## Variants

- `type`: 'default' | 'success' | 'warning' | 'error'

## Structure

- FRAME "icon_container"
  - INSTANCE "icon" (component instance)
- FRAME "block"
  - TEXT "title"
  - FRAME "container"
    - INSTANCE "Button" (component instance) — when `type` is `default` or `error` or `warning`
    - INSTANCE "Button11" (component instance) — when `type` is `success`
