# modal-footer

## Description

Description
Modal-Footer — the bottom block of the Modal-Window. Contains an optional counter of selected items and a row of action buttons.

Behavior
Static container block — has no own hover/focus states, except the states of nested buttons (see Button). Counter visibility is controlled by counter.

States
- Default — the only container state, differences only in the set of visible elements (counter) and number of buttons

Component types
- counter=True/False — shows the "Selected: N" counter to the left of the buttons

Appearance on different devices
- Mobile: no separate variant, width follows parent (Modal-Window)
- Desktop: width follows parent, buttons aligned to the right

Element anatomy
- counter — "Selected:" (on-surface) + value (on-surface-low #a5a5a5), optional
- actions — row of buttons (Button), typically Cancel (ghost) + 1-2 secondary (outlined) + 1 primary, right-aligned

Sizes and spacing
- Padding: 24px horizontal, 20px vertical
- Gap: 12px between counter and buttons, 12px between buttons
- Buttons: height 40px (Button Size=m)

Min / Max sizes
- Min/Max width: not set — follows parent (Modal-Window)
- Min/Max height: not set — by content (button height + padding)

When to use / not to use
- Use: need explicit actions (confirm/cancel) in a modal window
- Do not use: for windows without actions — set showFooter=False on Modal-Window

Customization
- counter: True / False, default True
- button set and count — determined by the specific instance content

Accessibility
- ARIA role: part of dialog, buttons — role button (see Button)
- ARIA attributes: aria-live="polite" on counter when its value changes dynamically
- Keyboard: Tab moves between action buttons, Enter/Space to activate

Interactivity (events)
- onCancel — click on the Cancel button
- onConfirm — click on the primary button
- onClick (intermediate buttons) — see Button

Related components
- Modal-Window — parent container
- Button — used for all actions in the actions block

Tokens / variables
- text-and-icons/on-surface: #f1f1f1 (counter label)
- text-and-icons/on-surface-low: #a5a5a5 (counter value)
- font/size/body1: 16px
- font/line-height/body1: 24px

## Structure

- FRAME "counter"
  - TEXT "text"
  - TEXT "number"
- INSTANCE "Button" (component instance)
