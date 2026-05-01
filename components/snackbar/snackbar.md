# snackbar

## Variants

- `type`: 'default' | 'success' | 'warning' | 'error'

## Structure

- FRAME "icon_container"
  - INSTANCE "icon" (component instance)
- FRAME "block"
  - TEXT "title"
  - FRAME "container"
    - INSTANCE "Button" (component instance)
