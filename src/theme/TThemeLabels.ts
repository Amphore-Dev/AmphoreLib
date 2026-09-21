// Every component that has at least one prop typed `TLabel` gets one entry
// here — `T<Name>Labels` is a `Pick` of that component's own Props
// interface, co-located in the component's own file (not listed twice):
// if a listed prop is ever renamed or removed there, the `Pick` fails to
// compile here, so drift is a type error, not a silent gap. (An earlier
// version of this tried to auto-derive the picked keys purely from the
// `TLabel` type via a mapped type — doesn't work: `TLabel` is a plain
// `string` alias, erased at compile time, so it's structurally
// indistinguishable from any other `string` prop like `className`, and
// branding it to make it distinguishable would force every consumer to
// cast a plain string literal before passing it as a label prop.)
// `import type` only, so there's no runtime circularity between theme/ and
// components/ (components import `useAmphoreLabels` from theme/, theme/
// imports component *types* back — erased at compile time either way).
import type { TLabel } from "@interfaces/index";

import type { TBadgeLabels } from "../components/atoms/Badge/Badge";
import type { TInfoMessageLabels } from "../components/atoms/InfoMessage/InfoMessage";
import type { TInputLabels } from "../components/atoms/Input/Input";
import type { TInputFileLabels } from "../components/atoms/InputFile/InputFile";
import type { TNumberInputLabels } from "../components/atoms/NumberInput/NumberInput";
import type { TSpinnerLabels } from "../components/atoms/Spinner/Spinner";
import type { TTimePickerLabels } from "../components/atoms/TimePicker/TimePicker";
import type { TAddTodoItemLabels } from "../components/molecules/AddTodoItem/AddTodoItem";
import type { TBottomPanelLabels } from "../components/molecules/BottomPanel/BottomPanel";
import type { TBreadcrumbLabels } from "../components/molecules/Breadcrumb/Breadcrumb";
import type { TConfirmModalLabels } from "../components/molecules/ConfirmModal/ConfirmModal";
import type { TDatePickerLabels } from "../components/molecules/DatePicker/DatePicker";
import type { THeadBarLabels } from "../components/molecules/HeadBar/HeadBar";
import type { TModalLabels } from "../components/molecules/Modal/Modal";
import type { TPasswordFieldLabels } from "../components/molecules/PasswordField/PasswordField";
import type { TSelectLabels } from "../components/molecules/Select/Select";
import type { TSidePanelLabels } from "../components/molecules/SidePanel/SidePanel";
import type { TTabsLabels } from "../components/molecules/Tabs/Tabs";
import type { TTodoItemLabels } from "../components/molecules/TodoItem/TodoItem";
import type { TActiveFiltersLabels } from "../components/organisms/ActiveFilters/ActiveFilters";
import type { TEditableCardLabels } from "../components/organisms/EditableCard/EditableCard";
import type { TFileViewerLabels } from "../components/organisms/FileViewer/FileViewer";
import type { TFiltersModalLabels } from "../components/organisms/FiltersModal/FiltersModal";
import type { TFormRendererLabels } from "../components/organisms/FormRenderer/FormRenderer";
import type { TTableLabels } from "../components/organisms/Table/Table";
import type { TTodoListLabels } from "../components/organisms/TodoList/TodoList";
import type { TPageHeaderLabels } from "../components/templates/PageHeader/PageHeader";

/**
 * Action verbs generic enough to be shared across components without a risk
 * of the wording actually needing to differ by context (unlike a message —
 * "No results" vs "No data" carry different meaning even in one language,
 * so those stay component-specific, never here). A component only reads
 * from here when its own English default is this exact bare word — see
 * each component's own `resolve(..., commonKey)` call for which ones do.
 */
export interface TCommonLabels {
	cancel?: TLabel;
	confirm?: TLabel;
	reset?: TLabel;
	submit?: TLabel;
	add?: TLabel;
	edit?: TLabel;
	close?: TLabel;
	remove?: TLabel;
	clear?: TLabel;
	back?: TLabel;
	loading?: TLabel;
}

/**
 * The `labels` slice of `AmphoreProvider`'s config — namespaced by
 * component so two unrelated `xLabel` props never collide, plus the
 * `common` bucket above. Every key at every level is optional: a consumer
 * overrides exactly what they want, everything else keeps resolving
 * through `common` then the built-in `en` bundle (see `useAmphoreLabels`).
 */
export interface TThemeLabels {
	common?: TCommonLabels;
	ActiveFilters?: TActiveFiltersLabels;
	AddTodoItem?: TAddTodoItemLabels;
	Badge?: TBadgeLabels;
	BottomPanel?: TBottomPanelLabels;
	Breadcrumb?: TBreadcrumbLabels;
	ConfirmModal?: TConfirmModalLabels;
	DatePicker?: TDatePickerLabels;
	EditableCard?: TEditableCardLabels;
	FileViewer?: TFileViewerLabels;
	FiltersModal?: TFiltersModalLabels;
	FormRenderer?: TFormRendererLabels;
	HeadBar?: THeadBarLabels;
	InfoMessage?: TInfoMessageLabels;
	Input?: TInputLabels;
	InputFile?: TInputFileLabels;
	Modal?: TModalLabels;
	NumberInput?: TNumberInputLabels;
	PageHeader?: TPageHeaderLabels;
	PasswordField?: TPasswordFieldLabels;
	Select?: TSelectLabels;
	SidePanel?: TSidePanelLabels;
	Spinner?: TSpinnerLabels;
	Table?: TTableLabels;
	Tabs?: TTabsLabels;
	TimePicker?: TTimePickerLabels;
	TodoItem?: TTodoItemLabels;
	TodoList?: TTodoListLabels;
}

/**
 * `en.ts`'s own type — every component and every key within it required,
 * not optional. `TThemeLabels` above stays fully partial (a consumer, or
 * `fr.ts`, only ever needs to override what they want) — this stricter
 * variant exists only so a component joining the labels system without
 * its English text also being added to `en.ts` is a `tsc` error, not a
 * runtime gap `resolve()`'s `?? ""` silently swallows.
 */
export type TRequiredThemeLabels = {
	common: Required<TCommonLabels>;
	ActiveFilters: Required<TActiveFiltersLabels>;
	AddTodoItem: Required<TAddTodoItemLabels>;
	Badge: Required<TBadgeLabels>;
	BottomPanel: Required<TBottomPanelLabels>;
	Breadcrumb: Required<TBreadcrumbLabels>;
	ConfirmModal: Required<TConfirmModalLabels>;
	DatePicker: Required<TDatePickerLabels>;
	EditableCard: Required<TEditableCardLabels>;
	FileViewer: Required<TFileViewerLabels>;
	FiltersModal: Required<TFiltersModalLabels>;
	FormRenderer: Required<TFormRendererLabels>;
	HeadBar: Required<THeadBarLabels>;
	InfoMessage: Required<TInfoMessageLabels>;
	Input: Required<TInputLabels>;
	InputFile: Required<TInputFileLabels>;
	Modal: Required<TModalLabels>;
	NumberInput: Required<TNumberInputLabels>;
	PageHeader: Required<TPageHeaderLabels>;
	PasswordField: Required<TPasswordFieldLabels>;
	Select: Required<TSelectLabels>;
	SidePanel: Required<TSidePanelLabels>;
	Spinner: Required<TSpinnerLabels>;
	Table: Required<TTableLabels>;
	Tabs: Required<TTabsLabels>;
	TimePicker: Required<TTimePickerLabels>;
	TodoItem: Required<TTodoItemLabels>;
	TodoList: Required<TTodoListLabels>;
};
