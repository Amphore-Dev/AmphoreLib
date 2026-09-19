# Amphore Lib

A React component library built around three rules: every component is
**fully controlled** (no ambient form-library magic), every visual choice
flows through **CSS custom properties** you can override from one place,
and every component ships its own `.stories.tsx` so the whole catalog is
browsable and testable in Storybook.

**[Browse the live Storybook →](https://storybook.lib.amphore.dev/)**

## Install

```bash
npm install @amphore-dev/amphore-lib
# or
yarn add @amphore-dev/amphore-lib
```

Peer dependencies: `react` and `react-dom` (`>=18.0.0 <20.0.0`).

## Quick start

Wrap your app in `AmphoreProvider` once, import the stylesheet once, then
use components anywhere below it. A `config` is optional — omit it
entirely to use the defaults.

```tsx
import { AmphoreProvider, Button, Input } from "@amphore-dev/amphore-lib";
import "@amphore-dev/amphore-lib/lib/style.css";

function App() {
	const [name, setName] = useState("");

	return (
		<AmphoreProvider
			config={{
				colors: { primary: "#e2673f" },
				style: "round", // "sharp" | "round"
			}}
		>
			<Input label="Name" value={name} onChange={setName} />
			<Button>Save</Button>
		</AmphoreProvider>
	);
}
```

Every input-like component is controlled through `value`/`onChange` (or
`checked`/`onChange`) and has no built-in form-library awareness — wire it
to Formik, React Hook Form, or plain state from the outside.

## Theming

Everything visual — colors, radius, spacing, typography, density — is a
plain value in `config`, deep-merged onto the built-in defaults and
exposed to your CSS as `--amp-*` custom properties. Nothing is hardcoded
inside a component's own stylesheet.

```tsx
<AmphoreProvider
	config={{
		colors: { primary: "#0f9be8", danger: "#e2436b" },
		radius: { md: "10px" },
		spacing: { 2: "0.5rem" },
		typography: { fontFamily: "'Inter', sans-serif" },
		density: "compact", // "compact" | "comfortable"
		style: "round", // radius preset shorthand — explicit `radius.*` still wins
		defaults: { size: "sm" }, // fallback `size` for every component that takes one
	}}
>
```

Open Storybook's **Configuration/Theme Configuration** page to try every
option interactively and copy the resulting config.

### Dark mode

`AmphoreProvider` takes a `theme` prop, independent of `config`:

```tsx
<AmphoreProvider theme="dark" config={{ ... }}>
```

- `"system"` (default) — follows the OS (`prefers-color-scheme`), resolved
  in CSS, not JS, so there's no hydration mismatch and no re-render on an
  OS-level change.
- `"light"` / `"dark"` — pins that palette regardless of the OS.

The dark palette isn't the light one inverted — it's a separate set of
colors (`darkColors`), with tints derived toward black instead of white.
Override it independently of the light palette:

```tsx
<AmphoreProvider
	theme="system"
	config={{
		colors: { primary: "#0f9be8" },
		darkColors: { primary: "#4f8cf7" },
	}}
>
```

Nested `AmphoreProvider`s are supported — the innermost one (and its own
`theme`/`config`) wins for its own subtree, without leaking into a sibling.

## What's in the box

Browse the full, live catalog — every component with its own controls,
props table, and states — on the [hosted Storybook](https://storybook.lib.amphore.dev/)
(or locally via `yarn start`). The categories below are a map, not an
exhaustive list:

- **Form atoms** — `Input`, `TextArea`, `NumberInput`, `PasswordField`,
  `Select`, `AsyncSelect`, `Checkbox`, `Radio`, `Toggle`, `Slider`,
  `DatePicker`, `TimePicker`, `ColorPicker`/`ColorPickerField`,
  `InputFile`, `InputSearch`.
- **Feedback & status** — `Spinner`, `Skeleton`, `InfoMessage`, `Progress`,
  `Badge`, `CountDown`.
- **Overlays** — `Modal`, `ConfirmModal`, `Popover`, `Tooltip`, `Dropdown`,
  `ContextMenu`, `SidePanel` (on mobile, a `BottomPanel` sheet or — via
  `mobileMode="modal"` — a centered `Modal`).
- **Navigation & structure** — `Tabs`, `Accordion`, `Breadcrumb`,
  `NavItem`/`NavList`, `Card`, `Grid`/`FlexGrid`, `Divider`,
  `SectionCard`.
- **Data display** — `SummaryList`/`SummaryListItem`, `Table`,
  `TableHead`/`TableRow`, `TodoList`/`TodoItem`/`AddTodoItem`,
  `FileViewer` (image/PDF preview with its own zoom + page toolbar).
- **Filters & forms at scale** — `FieldRenderer`, `FormRenderer`,
  `FilesField`, `FiltersModal`, `ActiveFilters`, `CheckboxFilter`,
  `RadioFilter`, `PeriodFilter`, `TimeRangeFilter`, `EditableCard`,
  `PageHeader`.
- **Icons** — `Picto` renders any icon from the `Pictos` set; browse the
  whole set (searchable, click to copy the exact name) on Storybook's
  **Concepts/Pictos** page.

## Conventions worth knowing

These are covered in depth on Storybook's **Directives/\*** pages
(Theming, Sizing, Controlled Components, Floating Overlays,
Accessibility, Structure, Verification) — the short version:

- **Controlled, always.** `value`/`onChange`, never an uncontrolled
  fallback or an ambient form-library subscription baked into an atom.
- **State is a `data-*` attribute, never a conditional class.**
  `data-size`, `data-color`, `data-variant`, `data-invalid`... — style
  them from CSS, not from JS branching.
- **One `size` scale everywhere** (`"sm" | "md" | "lg"`), resolved as
  `sizeProp ?? config.defaults.size ?? "md"`.
- **User-facing strings are props with English defaults**, not a global
  i18n dictionary — override per instance (`removeLabel`, `submitLabel`,
  `zoomOutLabel`, ...).
- **Inline by default, `portal` on demand.** Overlays position themselves
  in place (`position: fixed`) and stay inside the `AmphoreProvider`
  wrapper. Every overlay (`Modal`, `Select`, `Tooltip`, `Popover`,
  `Dropdown`, `ContextMenu`, `BottomPanel`, `SidePanel`...) takes an
  opt-in `portal` prop that renders it into `document.body` through
  `AmphorePortal` — for the ancestors that break `position: fixed`
  (`transform`, `filter`, `contain`) or trap its z-index (`sticky`, any
  stacking context). Never a bare `createPortal`/`FloatingPortal`: the
  theme is CSS variables inlined on the provider's wrapper, so anything
  rendered outside it loses every `var(--amp-*)`. `AmphorePortal` (or
  `AmphoreScope` around your own `createPortal`) re-applies that scope
  inside the portal.

## Credits

Most icons in the `Pictos` set are adapted from
[Feather Icons](https://feathericons.com/) (MIT License).

## License

[MIT](./LICENSE) © Amphore Dev
