# modal-window

## Description

Description
Modal window — a blocking dialog on top of the interface for actions requiring a mandatory user decision. Consists of Modal-Header (optional), Modal-Content (slot with arbitrary content), and Modal-Footer (optional).

Behavior
Appears on top of the interface with a background dimming (overlay), blocks interaction with the page until closed. Closed by clicking close (X button), Cancel in the footer, clicking the overlay, or pressing Escape. Header/Footer are optional blocks (showHeader/showFooter), content is a required slot (children).

States
- Default — the only container state, differences are set by Size and the presence of Header/Footer/Close

Component types
- Size=s — small window, width 480px
- Size=m — medium window, width 640px
- Size=l — large window, width 920px
- showHeader / showFooter / showClose — boolean toggles for block visibility

Appearance on different devices
- Mobile: full-width/full-screen adaptation is recommended
- Desktop: fixed width by Size, centered on screen

Element anatomy
- Modal-Window — container: border 1px bg/surface-high, radius/xl (16px), overflow clip, bg bg/surface-container
- Modal-Header — top block (see separate Modal-Header component description)
- Modal-Content — window body, children slot, padding 24px horizontal
- Modal-Footer — bottom block (see separate Modal-Footer component description)
- close button — X button, 32x32px, top/right offset 15px, optional

Sizes and spacing
- Width: s=480px, m=640px, l=920px
- Border radius: radius/xl — 16px
- Border: 1px bg/surface-high (#3b3b3b)
- Background: bg/surface-container (#2a2a2a)
- Modal-Content padding: 24px horizontal
- close button: 32x32px, padding 8px, radius/btn-radius-large (8px), icon 16x16px

Min / Max sizes
- Min width: 480px (Size=s)
- Max width: 920px (Size=l)
- Min/Max height: not set — by content (Header+Content+Footer), content scrolling is recommended on overflow

When to use / not to use
- Use: mandatory blocking user decision; content + actions in the footer
- Do not use: non-intrusive notification — Snackbar; short tooltip — Tooltip/Popover; message in a content block — Helper-Text

Customization
- size: s / m / l, default s
- showHeader / showFooter / showClose: True / False, default True
- children (content): arbitrary content (slot)

Accessibility
- ARIA role: dialog (alertdialog for critical confirmations)
- ARIA attributes: aria-modal="true", aria-labelledby on Title, aria-describedby on Content, focus trap inside the window
- Keyboard: Escape closes, Tab cycles inside the window (focus trap), focus on the first interactive element on open, return to trigger on close

Interactivity (events)
- onClose — click on close, click on overlay, Escape
- onCancel — click on Cancel in the footer
- onConfirm — click on the primary button in the footer

Related components
- Modal-Header, Modal-Footer — constituent parts
- Button — used in Modal-Footer
- Input — used in Modal-Header when search=True
- Icon-Button — close button pattern
- Snackbar, Popover, Tooltip, Helper-Text — alternatives for non-blocking cases

Tokens / variables
- bg/surface-container: #2a2a2a
- bg/surface-high: #3b3b3b (window border)
- text-and-icons/on-surface: #f1f1f1
- radius/xl: 16px
- radius/btn-radius-large: 8px (close button)

## Variants

- `size`: 's' | 'm' | 'l'

## Structure

- INSTANCE "Modal-Header" (component instance)
- INSTANCE "Modal-Content" (component instance)
- INSTANCE "Modal-Footer" (component instance)
- INSTANCE "close" (component instance)
