/**
 * Hand-written CSS that has no Figma counterpart: visually hidden native
 * controls, the inline-input sizer, and components the design system draws with
 * no mixin at all.
 *
 * It lives here as a string rather than in each `*.component.scss` because the
 * component-preview iframe is a separate document — Angular's emulated styles
 * stay in the host `<head>` and never reach it, so the preview needs the rules
 * as text. Call `applySynapsePrimitives()` once at bootstrap.
 *
 * Rules that override a generated mixin cannot live here: emulated
 * encapsulation makes the component's own selectors more specific than any
 * global one, so those stay next to the `@include` that they correct.
 */
export const SYNAPSE_PRIMITIVES_CSS = `
syn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
}

syn-icon svg {
  width: 100%;
  height: 100%;
}

syn-breadcrumbs-separator {
  display: inline-flex;
  align-items: center;
  color: var(--texticons-on_surface_low);
}

syn-breadcrumbs-separator .arrow {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  background: transparent;
  color: inherit;
}

syn-radio-group {
  display: flex;
  gap: 24px;
}

syn-checkbox .hidden-checkbox,
[syn-checkbox] .hidden-checkbox,
syn-toggle .hidden-checkbox,
[syn-toggle] .hidden-checkbox,
syn-radio-button .hidden-radio,
[syn-radio-button] .hidden-radio {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  padding: 0;
  border: 0;
  opacity: 0;
  pointer-events: none;
  clip-path: inset(50%);
}

[syn-dropdown-item] .checkbox {
  pointer-events: none;
  flex-shrink: 0;
}

syn-input .state {
  pointer-events: none;
  user-select: none;
}

syn-input:not(.inline) .field {
  flex: 1;
  min-width: 0;
}

syn-input:not(.inline) .field .sizer {
  display: none;
}

syn-input.inline .field {
  display: inline-grid;
  grid-template-columns: minmax(0, 1fr);
  overflow: hidden;
  width: max-content;
  min-width: 20px;
  max-width: var(--syn-inline-input-max-width, 100%);
}

syn-input.inline .field > * {
  grid-area: 1 / 1;
}

syn-input.inline .sizer {
  visibility: hidden;
  white-space: pre;
  pointer-events: none;
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0;
  padding-right: 2px;
}

/* The title owns a whole line, which puts the message under it rather than
   beside it — the mixin only gives them colour and type. */
syn-snackbar .title {
  width: 100%;
}

syn-snackbar .message {
  width: 100%;
  margin: 0;
  color: var(--texticons-on_surface_low);
}

syn-snackbar-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  perspective: 1000px;
  transition: all 0.3s ease;
}

syn-snackbar-container .snackbar {
  position: absolute;
  right: 0;
  transition: all 0.3s ease;
}

syn-snackbar-container .snackbar-front {
  bottom: 0;
  transform: translateY(0) scale(1);
  opacity: 1;
  z-index: 100;
}

syn-snackbar-container .snackbar-middle {
  bottom: 8px;
  transform: translateY(-8px) scale(0.95);
  pointer-events: none;
  z-index: 99;
}

syn-snackbar-container .snackbar-back {
  bottom: 16px;
  transform: translateY(-16px) scale(0.9);
  pointer-events: none;
  z-index: 98;
}

syn-snackbar-container .snackbar-hidden {
  bottom: 16px;
  transform: translateY(-24px) scale(0.85);
  pointer-events: none;
  opacity: 0;
  z-index: 97;
}

syn-snackbar-container:hover .snackbar-middle {
  transform: translateY(-48px) scale(1);
  opacity: 1;
  pointer-events: auto;
}

syn-snackbar-container:hover .snackbar-back {
  transform: translateY(-96px) scale(1);
  opacity: 1;
  pointer-events: auto;
}
`;

const STYLE_ID = 'syn-primitives';

/** Injects the primitives once into a document — the app's, or a preview frame's. */
export function applySynapsePrimitives(doc: Document = document): void {
  if (doc.getElementById(STYLE_ID)) return;

  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = SYNAPSE_PRIMITIVES_CSS;
  doc.head.appendChild(style);
}
