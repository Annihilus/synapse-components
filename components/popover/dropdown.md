# dropdown

## Description

Description
Dropdown — a pop-up panel container (usually under a trigger: select, menu button) that contains a slot for arbitrary content. You can put anything in the slot; by default, an auxiliary Dropdown-Item is placed as the most common scenario.

Behavior
Dropdown — a static panel; opening/closing is controlled by an external trigger.

States
- Default — background bg/surface-container (#2a2a2a), border 1px border/outline-variant (#3b3b3b), shadow shadow/m

Element Anatomy
- Slot — container for arbitrary content (default is a list of Dropdown-Items), vertical layout, 2px gap

Sizes and Spacing
- Padding: 4px
- Border radius: radius/l (12px)
- Border width: 1px
- Gap between elements in the slot: 2px

When to Use / Not Use
Use: pop-up panel under a trigger (select, action menu, autocomplete).
Do not use: always visible menu without a trigger.

Tokens / Variables
- bg/surface-container — #2a2a2a
- border/outline-variant — #3b3b3b
- radius/l — 12px
- shadow/m — panel shadow

Related Components
Dropdown-Item — auxiliary component used inside the slot.

## Structure

- SLOT "wrap"
  - INSTANCE "item" (component instance)
