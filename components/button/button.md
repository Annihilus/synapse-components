# button

## Description

Button

Description
Basic button component of the Synapse Design System. Used to request an action: confirmation, form submission, navigation, destructive operations.

Behavior
Responds to hover / focus / disabled / loading states via component variants. In Loading state, label/icon are replaced by a spinner, click is blocked. In Disabled state, click and hover reactions are disabled.

States
- Default — basic appearance
- Hover — cursor hovered
- Focus — keyboard focus (focus ring), Focused variant
- Active — not separately highlighted in the component
- Disabled — unavailable, click and hover reactions blocked
- Loading — asynchronous action in progress, spinner instead of content, click blocked
- Error — not applicable, no separate Error variant

Types (ColorType)
- Primary — main action on screen (one per group)
- Secondary — secondary action
- Outlined — alternative action, less prominent
- Ghost — minimal emphasis, tertiary action
- Danger — destructive operations (deletion, etc.)

Appearance on different devices
- Mobile — no separate variant, size chosen via Size (usually m/s for touch target)
- Desktop — no separate variant, all Sizes available (xs–l)

Element anatomy
- State layer — transparent overlay over entire button, changes on hover/focus/loading
- Label — button text (optional, hidden when Icon=True)
- Icon — optional icon, position set by Icon=Left/Right/True

Sizes (Size) and padding
- l — 48px height, padding 24/12px (lr/tb), radius 8px (btn-radius-large), typography Body1 16/24
- m — 40px height, padding 16/12px (lr/tb), radius 8px (btn-radius-large), typography Body2 14/16
- s — 32px height, padding 12/8px (lr/tb), radius 8px (btn-radius-large), typography Body2 14/16
- xs — 24px height, padding 8/4px (lr/tb), radius 6px (btn-radius-small), typography Small 12/16

Min / Max sizes
- Min width: not set — width fits content (hug), except Icon=True (square = height)
- Max width: not set
- Min height: 24px (Size=xs)
- Max height: 48px (Size=l)

Icon (Icon)
- False — text only
- Left — icon before text
- Right — icon after text
- True — icon only, no text (square button)

When to use
✅ Primary/secondary user action requiring click
✅ Destructive operations — Danger variant
❌ Do not use for page navigation (use Link)
❌ Do not use Primary more than once in a group of actions

Customization
- ColorType: Primary / Secondary / Outlined / Ghost / Danger (default Primary)
- Size: xs / s / m / l (default m)
- Icon: False / Left / Right / True (default False)
- Text: arbitrary string (default "Button")

Accessibility
- ARIA role: button
- ARIA attributes: aria-disabled on Disabled, aria-busy on Loading
- Keyboard: Tab — focus, Enter/Space — activate
- Disabled excludes element from tab order
- Focused variant required for visible focus ring

Interactivity (events)
- onClick — click/Enter/Space, if not Disabled and not Loading

Tokens / variables (Primary, default)
- bg/primary = #7f56d9
- text-and-icons/on-primary = #f1f1f1
- radius/btn-radius-large = 8px
- radius/btn-radius-small = 6px (only Size=xs)
- font/family = Inter
- font/size/body2 = 14px
- font/line-height/body2-condensed = 16px
- Other ColorTypes use similar tokens from their group (bg/{colortype}, text-and-icons/on-{colortype})

Related components
- Icon — used inside Icon=Left/Right/True variants
- Link — for navigation actions instead of button

## Variants

- `colorType`: 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger'
- `size`: 'm' | 's' | 'xs' | 'l'
- `icon`: boolean | 'left' | 'right'
- `hover`: boolean
- `disabled`: boolean
- `focused`: boolean
- `loading`: boolean

## Structure

- RECTANGLE "state"
- TEXT "text" — when `icon` is `false` or `left` or `right` and `loading` is `false`
- INSTANCE "icon" (component instance) — when `icon` is `left` or `right` or `true` and `loading` is `false`
- INSTANCE "spinner" (component instance) — when `loading` is `true`
