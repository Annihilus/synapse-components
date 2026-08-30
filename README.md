# @synapse/components

Angular 20 component library for the Synapse design system, distributed as
**source**, shadcn-style: nothing is compiled or published to a registry as a
package. Consumers copy the files they need into their own repository with
[`snps-cli`](https://www.npmjs.com/package/snps-cli), then own and edit them.

This repository is the source of truth. Styles are generated from Figma; the
TypeScript around them is written by hand.

## Using a component

```bash
npx snps add:component select      # one component and its dependencies
npx snps add:component --all       # everything
```

The CLI reads [`registry.json`](./registry.json), resolves the entry's
`dependencies` transitively and copies every listed file into the consumer's
`targetDir`. `select`, for example, pulls in `control-directives`,
`dropdown-item`, `icon`, `icon-button` and `popover`.

Because the layout is flat on the consumer side and each `targetDir` matches the
folder name here, relative imports such as `../icon/icon.component` keep working
without rewriting.

## Layout

```
components/
  <name>/
    <name>.component.ts | .html | .component.scss   hand-written
    <name>.scss                                     generated from Figma
    <name>.md                                       generated from Figma
  control-directives/                               shared form plumbing
  tokens/                                           design tokens
registry.json                                       what the CLI can install
index.ts                                            barrel for source consumers
```

**Never edit a bare `<name>.scss`.** Those are Figma output and `snps sync`
overwrites them wholesale. Put overrides in `<name>.component.scss`, which the
generator does not touch — media queries go in a sibling
`<name>.responsive.scss` included right after the base mixin.

## Forms

Every input-like control shares one host directive,
[`SynapseControlDirective<T>`](./components/control-directives/control.directive.ts).
It is the `ControlValueAccessor` for its host, so Angular's own `formControl`,
`formControlName` and `ngModel` drive it directly:

```html
<syn-input [formControl]="name" label="Name" />
<syn-select [formControl]="plan" [items]="plans" [displayWith]="planName" />
<syn-radio-group [formControl]="size">
  <syn-radio-button [value]="'s'" />
  <syn-radio-button [value]="'m'" />
</syn-radio-group>
```

Without a form the same controls take `[value]`, `[error]` and `[disabled]`
and report through `(valueChanged)`.

The directive exposes `current`, `touched`, `disabled`, `filled`, `invalid`,
`showError`, `errorList` and `control` as signals. A control feeds values back
with `registerSource(source$)` — a stream, not a DOM element, so a composite
control (a range built from two fields, a date from three) can express a value
of any type. Single native text fields use the
[`connectTextInput`](./components/control-directives/connect-text-input.ts)
helper instead.

## Icons

`<syn-icon>` fetches SVGs over `HttpClient` and caches them per URL, so the app
must provide `provideHttpClient()`. The default base path is `/icons`; override
it with `SYNAPSE_ICON_BASE_PATH`.

## Popover

Three directives share one engine and differ only by preset and a panel
modifier class — `synTooltip` (hover, arrow, delays), `synDropdown` (click,
width matched to the trigger) and `synPopover`. Placement is a pure function,
[`computePopoverPosition`](./components/popover/popover.position.ts), which
flips when a side has no room and clamps along the cross axis. There is no
third-party positioning dependency.

Panels carry `.side-*` and `.position-*` classes: that is the contract the
Figma-generated mixins key their arrow geometry off, so those class names
cannot be renamed independently of the design.

## Development

The package deliberately has no `node_modules` of its own. Tooling — TypeScript,
Jest, ESLint, Sass — is resolved from the sibling `synapse-ui` install, the same
one the library is built against.

```bash
npm run typecheck     # tsc --strict over sources and specs
npm test              # jest
npm run test:coverage
npm run lint
```

Specs sit next to the code they cover and are excluded from the consumer's
build and from the generated API docs.

## Syncing from Figma

`snps sync` regenerates `<name>.scss`, `<name>.md`, tokens and icons from the
Figma file described in [`synapse.config.json`](./synapse.config.json). It
overwrites without asking, so anything hand-written must live outside those
files.
