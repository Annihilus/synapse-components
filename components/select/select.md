# select

## Variants

- `filled`: boolean
- `hover`: boolean
- `active`: boolean
- `focus`: boolean
- `disabled`: boolean
- `error`: boolean
- `stroke`: boolean

## Structure

- INSTANCE "label" (component instance) — when `stroke` is `true`
- FRAME "select" — when `stroke` is `true`
  - INSTANCE "icon" (component instance)
  - FRAME "text-block"
    - TEXT "text"
  - INSTANCE "open-btn" (component instance) — when `active` is `false`
  - INSTANCE "reset" (component instance) — when `filled` is `true`
  - INSTANCE "chevron_up" (component instance) — when `active` is `true`
- TEXT "hint" — when `stroke` is `true`
- RECTANGLE "state" — when `stroke` is `false`
- INSTANCE "icon" (component instance) — when `stroke` is `false`
- FRAME "text-block" — when `stroke` is `false`
  - TEXT "text"
- INSTANCE "open-btn" (component instance) — when `focus` is `false` and `stroke` is `false`
- INSTANCE "chevron_up" (component instance) — when `focus` is `true` and `stroke` is `false`
