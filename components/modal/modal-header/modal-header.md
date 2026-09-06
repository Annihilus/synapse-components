# modal-header

## Description

Description
Modal-Header — the top block of the Modal-Window. Contains an icon, a title with an optional subtitle, and an optional search bar.

Behavior
Static informational block — has no own hover/focus states. Visibility of the entire block is controlled by showHead, elements inside — by icon/caption/search.

States
- Default — the only state, differences only in the set of visible elements (icon/caption/search)

Component types
- icon=True/False — icon or instance-swap to the left of the title
- caption=True/False — subtitle below Title
- search=True/False — search bar below the title
- showHead=True/False — visibility of the entire head_block (Title+icon+caption)

Appearance on different devices
- Mobile: no separate variant, width follows parent (Modal-Window)
- Desktop: width follows parent

Element anatomy
- icon — icon/instance 24x24px to the left of the title, optional
- titleblock — column: Title (Bold, body1 16/24, on-surface) and Caption (Regular, body1-condensed 20, on-surface-variant #d7d7d7, optional)
- search_block — Input with search icon and "Search" placeholder, optional

Sizes and spacing
- Padding: pl 24px, pr 16px, pt 16px
- Gap (icon/titleblock): 8px
- titleblock gap (Title/Caption): 4px
- titleblock padding-bottom: 12px
- search_block padding-bottom: 12px, padding-right: 8px

Min / Max sizes
- Min/Max width: not set — follows parent (Modal-Window)
- Min/Max height: not set — by content

When to use / not to use
- Use: need a modal window header with icon/subtitle/search
- Do not use: for windows without a header — set showHeader=False on Modal-Window

Customization
- icon: True / False, default True
- caption: True / False, default True
- search: True / False, default False
- showHead: True / False, default True
- instance: instance-swap for a custom icon

Accessibility
- ARIA role: part of the dialog header, Title is linked via aria-labelledby to the Modal-Window container
- ARIA attributes: aria-labelledby on Modal-Window points to the Title id
- Keyboard: search_block (if present) — Tab to focus, text input as a regular Input

Interactivity (events)
- onSearchChange — text input in search_block (if search=True)

Related components
- Modal-Window — parent container
- Input — used in search_block
- Icon — used in the icon slot

Tokens / variables
- text-and-icons/on-surface: #f1f1f1 (Title)
- text-and-icons/on-surface-variant: #d7d7d7 (Caption)
- text-and-icons/on-surface-low: #a5a5a5 (search placeholder)
- font/size/body1: 16px
- font/line-height/body1: 24px (Title)
- font/line-height/body1-condensed: 20px (Caption)

## Structure

- FRAME "head_block"
  - INSTANCE "icon" (component instance)
  - FRAME "titleblock"
    - TEXT "text"
    - TEXT "caption"
