# button

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
