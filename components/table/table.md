# table

## Description

Description
Table of the Synapse Design System for displaying tabular data. Consists of a header (table-header, a row of Table-Header-Cell) and a body (content, rows of Table-Cell).

Behavior
Static data container — the Table itself has no hover/focus/active. The header (table-header) is highlighted with bg/surface-container background and radius/l rounding on top. Body rows (row) are separated by a bottom border/outline-variant border; the last row has no border. Cells stretch to an equal width share (flex 1 0 0).

States
- Default: the only state — Table has no variant states (no variant set)

Component types
- No separate variants (variant set) — single COMPONENT without variations

Appearance on different devices
- Mobile: no separate variant — fixed 1200px width in demo, requires horizontal scrolling or column adaptation on narrow screens
- Desktop: standard view, width follows container (demo 1200px), columns of equal width

Element anatomy
- table-header — header row: bg bg/surface-container (#2a2a2a), radius/l (12px), contains N × Table-Header-Cell
- content — table body: column of rows
- row — row: border-bottom 1px border/outline-variant (#3b3b3b), except the last row (no border), contains N × Table-Cell

Sizes and spacing
- Width (demo): 1200px, actually follows container
- Border radius (Table/table-header): radius/l — 12px

Min / Max sizes
- Min width: not set — columns flex 1 0 0, min-width 120px per cell (demo)
- Max width: not set — follows container
- Min height: not set — by content
- Max height: not set

When to use / not to use
- Use: need to display structured data in rows and columns; data is homogeneous by type within a column
- Do not use: no data — use Empty-State; need a card list or arbitrary layout — use a different layout pattern

Customization
- Number of columns/rows: arbitrary (via children), default 4 columns × 6 rows (demo)

Accessibility
- ARIA role: table (Table), row (table-header, row)
- ARIA attributes: not directly applicable to the container — attributes are distributed across child cells
- Keyboard navigation: the table itself is not interactive — if cells contain interactive elements, they receive focus via Tab in natural order

Interactivity (events)
- No own events — static data display component; interactivity (sorting, row click) is implemented at the wrapper/parent usage context level

Related components
- Empty-State — placeholder for the absence of data instead of an empty table
- Scrollbar — custom scroll on table overflow
- Checkbox — often used inside Table-Cell for row selection

Tokens / variables
- bg/surface-container: #2a2a2a (table-header background)
- border/outline-variant: #3b3b3b (row border-bottom)
- radius/l: 12px (Table, table-header)

## Structure

- FRAME "table-header"
  - INSTANCE "Table-Header-Cell" (component instance)
- FRAME "content"
  - FRAME "row"
    - INSTANCE "Table-Cell" (component instance)
