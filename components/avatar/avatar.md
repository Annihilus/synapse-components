# avatar

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
