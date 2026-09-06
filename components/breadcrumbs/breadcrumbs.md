# breadcrumbs

## Description

Description
Breadcrumbs is a navigation chain showing the user's path from the root to the current page. It is composed of the helper component Breadcrumbs-Item (icon + text), connected by an arrow icon (>, 20px). The current (last) breadcrumb is always in the Selected state. The number variant (1-7) in Figma is a demo set to show different chain lengths; in real use, the number of items is data-driven.

Behavior
The last breadcrumb (Selected=True) is not clickable and visually highlighted — active text color text-and-icons/on-surface (#f1f1f1) instead of muted text-and-icons/on-surface-low (#a5a5a5). Intermediate (clickable) breadcrumbs on Hover get a background hover/hover-color (rgba(255,255,255,0.12)) and their text also changes to on-surface (#f1f1f1).

Element anatomy
- Sequence of Breadcrumbs-Item, with an arrow icon (>) 20px between each pair
- The last item in the chain is always Selected=True

Sizes and spacing
- Gap between Item and arrow: 4px
- Arrow size: 20px

When to use / not use
Use for hierarchical user paths (section → subsection → page), depth from 2 levels.
Do not use for first-level pages; do not use as main navigation (use menu/tabs instead).

Accessibility
Recommended to use nav with aria-label="breadcrumb", ol/li list, aria-current="page" on the current breadcrumb. Tab between clickable breadcrumbs, Enter to navigate.

Tokens / variables
- text-and-icons/on-surface-low — #a5a5a5 (text of unclicked intermediate breadcrumb)
- text-and-icons/on-surface — #f1f1f1 (text of current/hover breadcrumb)
- hover/hover-color — rgba(255,255,255,0.12) (background on Hover)
- radius/xs — 4px
- font/size/body1 — 16px
- font/line-height/body1-condensed — 20px

Related components
Breadcrumbs-Item — base unit of the chain, used only inside Breadcrumbs.

## Structure

- INSTANCE "Breadcrumbs-Item" (component instance) — present in 26/27 variants
- INSTANCE "item" (component instance) — present in 2/8 variants
- INSTANCE "arrow" (component instance) — present in 21/22 variants
