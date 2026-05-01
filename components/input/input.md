# input

## Variants

- `filled`: boolean
- `hover`: boolean
- `active`: boolean
- `focus`: boolean
- `disabled`: boolean
- `error`: boolean
- `stroke`: boolean

## Structure

- INSTANCE "Label" (component instance) — when `stroke` is `true`
- FRAME "input" — when `stroke` is `true`
  - INSTANCE "icon" (component instance)
  - FRAME "text-block"
    - TEXT "text"
    - INSTANCE "_Caret" (component instance) — present in 4/12 variants
  - INSTANCE "Icon-Button" (component instance)
- TEXT "hint" — when `stroke` is `true`
- RECTANGLE "state" — when `stroke` is `false`
- INSTANCE "icon" (component instance) — when `stroke` is `false`
- FRAME "text-block" — when `stroke` is `false`
  - TEXT "text"
  - INSTANCE "_Caret" (component instance) — present in 4/12 variants
- INSTANCE "Icon-Button" (component instance) — when `stroke` is `false`
