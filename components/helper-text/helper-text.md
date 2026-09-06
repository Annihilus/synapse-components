# helper-text

## Description

Description
Information banner block of the Synapse Design System. Displays a contextual message to the user: info, success, warning, or error. Contains an icon, title, description, and optional action buttons and a close button.

Behavior
The component is static (has no own hover/focus/active states as a control) — visual differences are set only by the Type variant. The close button (crossIcon) is an interactive element that hides the banner on click. Buttons in actions are regular Buttons.

States
- Default — the only visual state of the container, differences only between Type variants

Component types (Type)
- Info — bg bg/info rgba(16,91,198,0.3), title text-and-icons/info #3d89f5
- Success — bg bg/success rgba(2,139,78,0.3), title text-and-icons/success #03d879
- Warning — bg bg/warning rgba(236,155,5,0.3), title text-and-icons/warning #febe4d
- Error — bg bg/danger rgba(174,40,29,0.3), title text-and-icons/danger #e64e41

Element anatomy
- icon — message type icon, 20x20px, optional (icon=True/False)
- content — column: text_block (Title + Description) and actions
- Title — heading, bold, color depends on Type
- Description — description, text-and-icons/on-surface (#f1f1f1), optional (description=True/False)
- actions — row of buttons (Button, outline, h-32px)
- close button (crossIcon) — Icon-Button 20x20px, optional (closeButton=True/False), 16px icon inside

Sizes and spacing
- Container padding: 12px
- Gap icon/content/close: 8px
- Container border-radius: radius/m — 8px
- Width: demo 862px in Figma, actually w-full
- text_block gap (Title/Description): 4px
- content gap (text_block/actions): 12px
- actions gap between buttons: 8px
- Button in actions: height 32px, padding lr12/tb8, radius/btn-radius-large 8px
- close button: 20x20px, padding 2px, radius/xs 4px, 16px icon

When to use / not to use
Use: contextual status message (success, warning, error, info) in a content block/form.
Do not use: system notification outside the page context (Toast/Notification); validation error on a specific form field (use the Error state of Input/Select/Textarea).

Customization
- type: Info / Success / Warning / Error, default Info
- icon: True / False, default True
- description: True / False, default True
- closeButton: True / False, default True

Accessibility
- ARIA role: status / alert (alert for Error/Warning, status for Info/Success)
- ARIA attributes: aria-live="polite" (or "assertive" for Error)
- Keyboard: Tab to action buttons and close button, Enter/Space to activate

Interactivity (events)
- onClose — click on the close button (crossIcon) — hides the banner
- onClick (actions) — click on one of the buttons in the actions block — see Button

Tokens / variables
- bg/info — rgba(16,91,198,0.3)
- bg/success — rgba(2,139,78,0.3)
- bg/warning — rgba(236,155,5,0.3)
- bg/danger — rgba(174,40,29,0.3)
- text-and-icons/info — #3d89f5
- text-and-icons/success — #03d879
- text-and-icons/warning — #febe4d
- text-and-icons/danger — #e64e41
- text-and-icons/on-surface — #f1f1f1
- border/outline — #d7d7d7
- radius/m — 8px
- radius/xs — 4px
- radius/btn-radius-large — 8px
- font/size/body1 — 16px
- font/line-height/body1-condensed — 20px (Title)
- font/line-height/body1 — 24px (Description)

Related components
Icon-Button — close button. Button — buttons in actions. Input / Select / Textarea — for field errors use their built-in Error state.

## Variants

- `type`: 'info' | 'success' | 'warning' | 'error'

## Structure

- INSTANCE "icon" (component instance)
- FRAME "content"
  - FRAME "text_block"
    - TEXT "title"
    - TEXT "text"
  - FRAME "actions"
    - INSTANCE "Button" (component instance)
- INSTANCE "Icon-Button" (component instance)
