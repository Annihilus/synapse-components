# avatar

## Description

Description
Avatar — a circular element representing a user: photo, initials, default icon, or photo upload zone. Optionally accompanied by the helper online-indicator component placed in the bottom-right corner.

Behavior
Switches between variants via props image, initials, upload. Hover state is available for the upload variant (a darkening hover/hover-color overlay appears). The online indicator is a separate component overlaid on the avatar via showIndicator.

States
- Default — shows photo / initials / default icon
- Hover — upload variant only, darkening overlay on top
- Upload (empty) — dashed border border/outline, camera/photo_add icon centered

Component types
- Image — user photo, object-cover, circular crop
- Initials — initials (text) on bg/surface-highest background
- Default (user icon) — default person icon on bg/surface-highest background
- Upload — dashed border + camera/photo_add icon, for empty/editable avatar

Element anatomy
- Image / initials / icon (mutually exclusive)
- online-indicator (optional) — small circle in the bottom-right corner, on top of the avatar

Sizes and spacing
- Size (outer): 28px, content up to 32x32px
- Padding: 6px (for upload/default variants)
- Border radius: radius/full (1000px)
- Border (upload): 1px dashed border/outline

When to use / not to use
Use: need to show a user (photo/initials) in lists, headers, profiles; need online/offline status; need a profile photo upload zone.
Do not use: need a large portrait/banner — use a full-size image.

Customization
- image: True/False, default False
- initials: True/False, default False
- upload: True/False, default True
- hover: True/False, default False
- showIndicator: True/False, default True

Accessibility
- ARIA role: img (for image/initials variant)
- ARIA attributes: alt text with user name; aria-label="online"/"offline" for the indicator
- Keyboard: not interactive, except for the upload variant (upload button is focusable)

Interactivity (events)
- onClick — click on the upload variant — opens file selection dialog
- onHover — hover on the upload variant — darkening overlay

Tokens / variables
- bg/surface-highest — #727272
- border/outline — #d7d7d7 (dashed, upload)
- hover/hover-color — rgba(255,255,255,0.12)
- text-and-icons/on-surface — #f1f1f1
- radius/full — 1000px

Related components
online-indicator — helper component, online/offline status on top of Avatar. Dropdown — often used together (user profile menu).

## Variants

- `hover`: boolean
- `image`: boolean
- `initials`: boolean
- `upload`: boolean

## Structure

- TEXT "text" — when `initials` is `true`
- INSTANCE "online-indicator" (component instance) — when `upload` is `false`
- INSTANCE "user" (component instance) — present in 1/5 variants
- RECTANGLE "state" — when `hover` is `true`
- INSTANCE "photo_add" (component instance) — when `upload` is `true`
