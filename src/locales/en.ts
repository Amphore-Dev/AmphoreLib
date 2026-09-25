import type { TRequiredThemeLabels } from "@theme/TThemeLabels";

/**
 * The single source of truth for every component's English text — no
 * component hardcodes its own fallback string anymore (see
 * `useAmphoreLabels`'s `resolve()`); this is what it falls back to once no
 * prop and no `AmphoreProvider` config override applies. This bundle is
 * also `CThemeConfig.ts`'s `DEFAULT_CONFIG.labels`, so it's live even with
 * zero `<AmphoreProvider>` anywhere in the tree.
 *
 * Typed `TRequiredThemeLabels`, not `TThemeLabels` — every component and
 * every key it declares is required here, so a component joining the
 * labels system without also adding its English text here is a compile
 * error, not a silent runtime gap.
 */
export const en: TRequiredThemeLabels = {
	common: {
		cancel: "Cancel",
		confirm: "Confirm",
		reset: "Reset",
		submit: "Submit",
		add: "Add",
		edit: "Edit",
		close: "Close",
		remove: "Remove",
		clear: "Clear",
		back: "Back",
		loading: "Loading",
	},
	ActiveFilters: {
		resetLabel: "Reset",
		showMoreLabel: "Show more",
		showLessLabel: "Show less",
	},
	AddTodoItem: {
		placeholder: "Add…",
		buttonLabel: "Add",
	},
	Badge: {
		removeLabel: "Remove",
	},
	BottomPanel: {
		openLabel: "Panel open",
		collapsedLabel: "Panel collapsed",
		collapseLabel: "Collapse panel",
		expandLabel: "Expand panel",
	},
	Breadcrumb: {
		navigationLabel: "Breadcrumb",
	},
	ConfirmModal: {
		cancelText: "Cancel",
		confirmText: "Confirm",
	},
	DatePicker: {
		placeholder: "dd/mm/yyyy",
	},
	EditableCard: {
		editLabel: "Edit",
		addLabel: "Add",
	},
	FileViewer: {
		zoomOutLabel: "Zoom out",
		zoomInLabel: "Zoom in",
		resetZoomLabel: "Reset zoom",
		previousPageLabel: "Previous page",
		nextPageLabel: "Next page",
		downloadLabel: "Download",
		loadingLabel: "Loading document",
		pdfErrorLabel: "Unable to display this PDF.",
		unsupportedFormatLabel: "Unsupported format",
		previewAltLabel: "Preview",
	},
	FiltersModal: {
		title: "Filters",
		buttonLabel: "Filter",
		applyLabel: "Apply",
		resetLabel: "Reset filters",
	},
	FormRenderer: {
		submitLabel: "Submit",
		cancelLabel: "Cancel",
		resetLabel: "Reset",
		resetFormLabel: "Reset fields",
	},
	HeadBar: {
		menuLabel: "Menu",
	},
	InfoMessage: {
		closeLabel: "Close",
	},
	Input: {
		clearLabel: "Clear",
	},
	InputFile: {
		placeholder: "Add a file",
		removeFileLabel: "Remove file",
	},
	Modal: {
		closeLabel: "Close",
	},
	NumberInput: {
		increaseLabel: "Increase",
		decreaseLabel: "Decrease",
	},
	PageHeader: {
		loadingLabel: "Loading...",
		onBackLabel: "Back",
	},
	PasswordField: {
		hidePasswordLabel: "Hide password",
		showPasswordLabel: "Show password",
	},
	Select: {
		loadingMessage: "Loading...",
		placeholder: "Select...",
		noResultsMessage: "No results",
		clearLabel: "Clear",
	},
	SidePanel: {
		closeLabel: "Close",
	},
	Spinner: {
		label: "Loading",
	},
	Table: {
		noDataMessage: "No data",
	},
	Tabs: {
		scrollLeftLabel: "Scroll left",
		scrollRightLabel: "Scroll right",
	},
	TimePicker: {
		hoursLabel: "Hours",
		minutesLabel: "Minutes",
	},
	TodoItem: {
		removeLabel: "Remove",
	},
	TodoList: {
		moveLabel: "Move (up/down arrows)",
	},
	Tour: {
		nextLabel: "Next",
		prevLabel: "Previous",
		skipLabel: "Skip",
		doneLabel: "Done",
		stepOfLabel: "Step {current} of {total}",
	},
};
