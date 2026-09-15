import React, { useEffect, useId, useMemo, useRef, useState } from "react";

import {
	autoUpdate,
	flip,
	offset,
	shift,
	size as floatingSize,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useListNavigation,
	useRole,
	useTypeahead,
	type UseFloatingOptions,
} from "@floating-ui/react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import type { TPictoName } from "@constants/index";

import { getPicto } from "@utils/UPicto";
import { cn } from "@utils/cn";

import {
	TColor,
	TLabel,
	TSelectOption,
	TSelectOptionGroup,
	TSize,
} from "@interfaces/index";

import { Badge } from "../../atoms/Badge/Badge";
import { InputErrorMessage } from "../../atoms/InputErrorMessage/InputErrorMessage";
import type { IPictoProps } from "../../atoms/Picto/Picto";
import { Picto } from "../../atoms/Picto/Picto";
import { Spinner } from "../../atoms/Spinner/Spinner";

import styles from "./Select.module.scss";

export interface ISelectProps<T = string> {
	/** Flat options, or grouped (each group gets a heading — see `renderGroupHeader`). */
	options: TSelectOption<T>[] | TSelectOptionGroup<T>[];
	/** Single mode: `T | null`. Multi mode (`multiple`): `T[]`. */
	value?: T | T[] | null;
	onChange?: (value: T | T[] | null) => void;
	multiple?: boolean;
	/** Adds a filter input, shown once the listbox is open. */
	searchable?: boolean;
	/** Called with the search query on every keystroke (searchable only) — e.g. to drive a remote search (see AsyncSelect). */
	onSearchChange?: (query: string) => void;
	/** Filters `options` by the search query client-side. Defaults to true — set false when `options` is already filtered externally (e.g. server-side search results). */
	filterOptions?: boolean;
	/** Shows a loading state in the listbox instead of the options (e.g. while a remote search is in flight), and a small spinner next to the chevron. */
	isLoading?: boolean;
	/** Text shown next to the spinner in the listbox while `isLoading`. Defaults to "Loading..." (or `Select.loadingMessage` from the nearest AmphoreProvider — see useAmphoreLabels). */
	loadingMessage?: TLabel;
	isClearable?: boolean;
	/** Defaults to "Select..." (or `Select.placeholder` from the nearest AmphoreProvider). */
	placeholder?: TLabel;
	/** aria-label for the clear (×) button, shown when `isClearable` and a value is selected. Defaults to "Clear" (or `common.clear`/`Select.clearLabel` from the nearest AmphoreProvider). */
	clearLabel?: TLabel;
	/** Leading icon (see Picto), same convention as Input — an icon name, or an `IPictoProps` object to pass other Picto props. */
	picto?: TPictoName | IPictoProps;
	label?: string;
	error?: string;
	hideError?: boolean;
	disabled?: boolean;
	required?: boolean;
	size?: TSize;
	color?: TColor;
	/** Defaults to "No results" (or `Select.noResultsMessage` from the nearest AmphoreProvider). */
	noResultsMessage?: TLabel;
	/**
	 * Overrides how a single option renders, in the listbox and as the
	 * current value (single-select only — a multi-select's chips always
	 * stay `option.label`, too little room for anything richer). `T` can
	 * be the option's full underlying object (not just its primitive
	 * value) precisely to make this useful — e.g. `value: company`,
	 * `renderOption: (o) => <>{o.value.logo && <img .../>}{o.label}</>`.
	 */
	renderOption?: (option: TSelectOption<T>) => React.ReactNode;
	/**
	 * Derives a stable primitive key from `T` for value<->option matching
	 * (and chip/listbox `key`s), instead of the default `===`. Needed the
	 * moment `T` is an object rather than a primitive: `value` and
	 * `options[].value` are almost never the exact same reference (e.g. a
	 * form's initial value came from a different fetch than the options
	 * this Select just loaded) even when they represent the same real
	 * entity — `===` then never matches, and the current value silently
	 * shows as unselected. `(company) => company.id` fixes that.
	 */
	getOptionValue?: (value: T) => string | number;
	/** Overrides how a group's heading renders, when `options` is grouped. Defaults to a plain label. */
	renderGroupHeader?: (group: TSelectOptionGroup<T>) => React.ReactNode;
	/**
	 * Arbitrary content rendered once, at the very end of the open listbox
	 * — e.g. a "see more" link. Not part of keyboard navigation/selection
	 * (unlike an option), so it's never skipped by the loop nor treated as
	 * a commit target; the consumer owns any interactivity inside it.
	 */
	footer?: React.ReactNode;
	/**
	 * Resets the typed search query (searchable only) back to empty right
	 * after picking an option — otherwise it lingers, so reopening without
	 * retyping shows the listbox still filtered by the old query instead of
	 * every option. Useful for a "search and act" picker (a global search
	 * bar, say) where selecting doesn't mean "keep showing this as chosen".
	 * Doesn't change what `onChange` receives or how many times it fires.
	 */
	clearInputOnSelect?: boolean;
	className?: string;
	wrapperClassName?: string;
	/**
	 * Advanced escape hatch: overrides/extends the internal `useFloating`
	 * config (placement, middleware, strategy...). `open` and `onOpenChange`
	 * are always controlled by the component and ignored here even if passed.
	 */
	floatingProps?: Partial<Omit<UseFloatingOptions, "open" | "onOpenChange">>;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TSelectLabels = Pick<
	ISelectProps,
	"loadingMessage" | "placeholder" | "noResultsMessage" | "clearLabel"
>;

/**
 * V2 Select — fully controlled, generic over the option value type `T`.
 * Value <-> option matching defaults to `===`, fine for a primitive T or a
 * guaranteed-stable object reference; pass `getOptionValue` (e.g. `(c) =>
 * c.id`) the moment `T` is an object that might not be the exact same
 * reference across renders (a fresh fetch, a different source than the
 * current value came from, ...).
 *
 * No ambient form-library awareness, same rule as every other field (see
 * memory/react-library-fields-audit.md). Async option loading (remote
 * search) is AsyncSelect, a thin wrapper around this one — `onSearchChange`/
 * `filterOptions`/`isLoading` exist on this component specifically so that
 * wrapper doesn't need to reach into internals.
 */
export function Select<T = string>({
	options,
	value,
	onChange,
	multiple = false,
	searchable = false,
	onSearchChange,
	filterOptions = true,
	isLoading = false,
	loadingMessage: loadingMessageProp,
	isClearable = false,
	placeholder: placeholderProp,
	clearLabel: clearLabelProp,
	picto,
	label,
	error,
	hideError = false,
	disabled = false,
	required = false,
	size: sizeProp,
	color = "primary",
	noResultsMessage: noResultsMessageProp,
	renderOption,
	getOptionValue,
	renderGroupHeader,
	footer,
	clearInputOnSelect = false,
	className = "",
	wrapperClassName = "",
	floatingProps,
}: ISelectProps<T>) {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const { resolve } = useAmphoreLabels("Select");
	const loadingMessage = resolve("loadingMessage", loadingMessageProp);
	const placeholder = resolve("placeholder", placeholderProp);
	const noResultsMessage = resolve("noResultsMessage", noResultsMessageProp);
	const clearLabel = resolve("clearLabel", clearLabelProp, "clear");
	const selectId = useId();
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const listRef = useRef<Array<HTMLElement | null>>([]);
	const labelsRef = useRef<Array<string | null>>([]);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const selectedValues: T[] = multiple
		? ((value as T[] | undefined) ?? [])
		: value === null || value === undefined
			? []
			: [value as T];

	const valuesEqual = (a: T, b: T) =>
		getOptionValue ? getOptionValue(a) === getOptionValue(b) : a === b;

	const isSelected = (option: TSelectOption<T>) =>
		selectedValues.some((v) => valuesEqual(v, option.value));

	// Normalizes flat options into a single unlabeled group, so every
	// downstream computation (filtering, flattening for keyboard nav,
	// rendering) has one shape to deal with — a group heading only
	// actually renders when `group.label` is truthy, so this is invisible
	// for ungrouped callers.
	const groups: TSelectOptionGroup<T>[] = useMemo(
		() =>
			options.length > 0 && "options" in options[0]
				? (options as TSelectOptionGroup<T>[])
				: [{ label: "", options: options as TSelectOption<T>[] }],
		[options]
	);

	const filteredGroups = useMemo(() => {
		if (!searchable || !search || !filterOptions) return groups;
		const q = search.toLowerCase();
		return groups
			.map((group) => ({
				...group,
				options: group.options.filter((o) =>
					o.label.toLowerCase().includes(q)
				),
			}))
			.filter((group) => group.options.length > 0);
	}, [groups, search, searchable, filterOptions]);

	// The flat, group-agnostic option list every piece of keyboard-nav
	// state (activeIndex, listRef/labelsRef) and selection logic already
	// operated on before groups existed — kept as one array so none of
	// that had to change, only what builds it and what iterates it for
	// rendering (see `renderEntries` below).
	const filteredOptions = useMemo(
		() => filteredGroups.flatMap((group) => group.options),
		[filteredGroups]
	);

	// Same flattening, but from the unfiltered groups — selection/value
	// display must still resolve even while a search query hides the
	// selected option from the open listbox.
	const flatOptions = useMemo(
		() => groups.flatMap((group) => group.options),
		[groups]
	);

	// One entry per group heading (when the group has a label) and per
	// option, in visual order, each option carrying its own position in
	// the flat `filteredOptions` array — that position is what `listRef`/
	// `labelsRef`/`activeIndex` key off, so a heading (never in either
	// ref) is transparently skipped by keyboard navigation without any
	// special-casing there.
	const renderEntries = useMemo(() => {
		const entries: (
			| { kind: "header"; group: TSelectOptionGroup<T> }
			| { kind: "option"; option: TSelectOption<T>; index: number }
		)[] = [];
		let index = 0;
		filteredGroups.forEach((group) => {
			if (group.label) entries.push({ kind: "header", group });
			group.options.forEach((option) => {
				entries.push({ kind: "option", option, index: index++ });
			});
		});
		return entries;
	}, [filteredGroups]);

	const { refs, floatingStyles, context } = useFloating({
		whileElementsMounted: autoUpdate,
		placement: "bottom-start",
		// Not portaled (see below), so "fixed" avoids the classic pitfall of
		// "absolute" positioning without a portal: coordinates would otherwise
		// be relative to the nearest positioned ancestor instead of the
		// viewport, breaking the moment any wrapping container in a consumer
		// app (or Storybook's own docs layout) sets position: relative.
		strategy: "fixed",
		middleware: [
			offset(4),
			flip({ padding: 8 }),
			shift({ padding: 8 }),
			floatingSize({
				padding: 8,
				apply({ rects, elements, availableHeight }) {
					// maxHeight clamps to the actual room flip/shift left in
					// the viewport at whichever side they picked, not a
					// fixed rem cap — a short list never gets a needless
					// scrollbar, a long one still scrolls once it hits the
					// screen edge.
					Object.assign(elements.floating.style, {
						width: `${rects.reference.width}px`,
						maxHeight: `${availableHeight}px`,
					});
				},
			}),
		],
		// Everything above is a default the consumer can override (placement,
		// middleware, strategy...) via `floatingProps`. `open`/`onOpenChange`
		// come last so they can never be overridden — the component always
		// owns the open state.
		...floatingProps,
		open,
		onOpenChange: (next) => {
			setOpen(next);
			if (!next) setSearch("");
		},
	});

	// keyboardHandlers: false — useClick's own Enter/Space-as-click activation
	// assumes the reference itself is the focused element. When searchable,
	// focus is on the nested search <input> instead; useClick checks
	// isSpaceIgnored(reference) (the outer div, never "typeable") rather than
	// the actual event target, so it toggled the listbox closed on every
	// Space keystroke typed into the filter. We already handle Enter
	// ourselves (handleTriggerKeyDown) and don't need Space to do anything
	// but insert a literal space, so this feature is just disabled outright.
	const click = useClick(context, {
		enabled: !disabled,
		keyboardHandlers: false,
	});
	const dismiss = useDismiss(context);
	const role = useRole(context, { role: "listbox" });
	// virtual: true keeps real DOM focus on the trigger (or the search input),
	// options are only "active" via aria-activedescendant — the correct
	// pattern for a listbox/combobox, no FloatingFocusManager needed.
	const listNav = useListNavigation(context, {
		listRef,
		activeIndex,
		onNavigate: setActiveIndex,
		virtual: true,
		loop: true,
	});
	const typeahead = useTypeahead(context, {
		listRef: labelsRef,
		activeIndex,
		onMatch: setActiveIndex,
		enabled: !searchable,
	});

	const { getReferenceProps, getFloatingProps, getItemProps } =
		useInteractions([click, dismiss, role, listNav, typeahead]);

	const commit = (next: T[]) => {
		onChange?.(multiple ? next : (next[0] ?? null));
	};

	const handleSelect = (option: TSelectOption<T>) => {
		if (option.disabled) return;

		if (multiple) {
			const already = isSelected(option);
			const next = already
				? selectedValues.filter((v) => !valuesEqual(v, option.value))
				: [...selectedValues, option.value];
			commit(next);
		} else {
			commit([option.value]);
			setOpen(false);
		}

		if (clearInputOnSelect) setSearch("");
	};

	// useListNavigation only moves `activeIndex`, and useClick's own Enter/
	// Space-as-click activation is disabled above (see keyboardHandlers)
	// since it broke Space-while-typing — so opening AND committing on Enter
	// are both entirely on us here.
	const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
		if (e.key !== "Enter") return;

		if (!open) {
			// Arrow keys already open via useListNavigation's default
			// openOnArrowKeyDown; Enter needs the same, now that useClick no
			// longer provides it.
			e.preventDefault();
			setOpen(true);
			return;
		}

		// Enter only, not Space — Space needs to stay a literal character when
		// `searchable` (typing it into the filter input), not a commit key.
		if (activeIndex != null) {
			const option = filteredOptions[activeIndex];
			if (option) {
				e.preventDefault();
				handleSelect(option);
			}
		}
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		commit([]);
	};

	// Badge's remove button already stops propagation internally (see
	// Badge.tsx) before calling onRemove, so no event to handle here.
	const handleRemoveChip = (optionValue: T) => {
		commit(selectedValues.filter((v) => !valuesEqual(v, optionValue)));
	};

	const selectedOptions = flatOptions.filter((o) => isSelected(o));
	const hasValue = selectedOptions.length > 0;

	// jsx-a11y forbids the `autoFocus` prop, but this is exactly the case it's
	// meant for: the user just activated the control themselves (clicked to
	// open a searchable select), so moving focus into the filter field they're
	// about to type into is expected, not disorienting.
	useEffect(() => {
		if (searchable && open) searchInputRef.current?.focus();
	}, [searchable, open]);

	return (
		<div className={cn([styles.wrapper, wrapperClassName])}>
			{label && (
				<label className={styles.label}>
					{label}
					{required && <span className={styles.required}>*</span>}
				</label>
			)}

			<div
				ref={refs.setReference}
				className={cn([styles.field, className])}
				data-size={size}
				data-color={color}
				data-disabled={disabled || undefined}
				data-invalid={!!error || undefined}
				tabIndex={disabled ? undefined : 0}
				{...getReferenceProps({ onKeyDown: handleTriggerKeyDown })}
			>
				{!!picto && (
					<Picto {...getPicto(picto)} className={styles.picto} />
				)}

				<div className={styles.valueArea}>
					{multiple && hasValue ? (
						<div className={styles.chips}>
							{selectedOptions.map((option, index) => (
								<Badge
									// option.value can be a whole object (see renderOption),
									// which stringifies to the same "[object Object]" for every
									// option — getOptionValue (when given) derives a real stable
									// key from it; index is the fallback otherwise.
									key={
										getOptionValue
											? getOptionValue(option.value)
											: `${index}-${String(option.value)}`
									}
									color={color}
									variant="tint"
									size="sm"
									onRemove={() =>
										handleRemoveChip(option.value)
									}
									removeLabel={`Remove ${option.label}`}
								>
									{option.label}
								</Badge>
							))}
						</div>
					) : searchable && open ? (
						<input
							ref={searchInputRef}
							className={styles.searchInput}
							value={search}
							placeholder={
								selectedOptions[0]?.label ?? placeholder
							}
							onChange={(e) => {
								setSearch(e.target.value);
								onSearchChange?.(e.target.value);
							}}
							// A click here is "focus the search field", not "toggle the
							// dropdown" — without stopping it, the click bubbles to the
							// reference div's useClick handler and immediately re-closes
							// the listbox that just opened.
							onMouseDown={(e) => e.stopPropagation()}
							onClick={(e) => e.stopPropagation()}
						/>
					) : (
						<span
							className={cn([
								styles.value,
								!hasValue && styles.placeholder,
							])}
						>
							{hasValue
								? renderOption
									? renderOption(selectedOptions[0])
									: selectedOptions[0].label
								: placeholder}
						</span>
					)}
				</div>

				<div className={styles.indicators}>
					{isClearable && hasValue && !disabled && (
						<button
							type="button"
							className={styles.clear}
							onClick={handleClear}
							aria-label={clearLabel}
						>
							<Picto icon="cross" />
						</button>
					)}
					<Picto
						icon="chevron"
						rotation={open ? 270 : 90}
						className={styles.chevron}
					/>
					{isLoading && (
						<Spinner size="sm" className={styles.loadingIcon} />
					)}
				</div>
			</div>

			{open && (
				// Rendered inline, not portaled: FloatingPortal defaults to
				// document.body, which broke styling inside Storybook's docs
				// page (the live example there runs in a context that doesn't
				// share the portal target's stylesheet). Trade-off: this can
				// get clipped by an ancestor's overflow: hidden — acceptable
				// for now, revisit with an explicit portal root if it bites.
				<div
					ref={refs.setFloating}
					style={floatingStyles}
					className={styles.listbox}
					{...getFloatingProps()}
				>
					{isLoading ? (
						<div className={styles.loading}>
							<Spinner size="sm" />
							{loadingMessage}
						</div>
					) : filteredOptions.length === 0 ? (
						<div className={styles.noResults}>
							{noResultsMessage}
						</div>
					) : (
						renderEntries.map((entry) =>
							entry.kind === "header" ? (
								<div
									key={`header-${entry.group.label}`}
									className={styles.groupHeading}
								>
									{renderGroupHeader
										? renderGroupHeader(entry.group)
										: entry.group.label}
								</div>
							) : (
								<div
									// See the chip key above — same
									// object-value collision risk here.
									key={
										getOptionValue
											? getOptionValue(entry.option.value)
											: `${entry.index}-${String(entry.option.value)}`
									}
									id={`${selectId}-option-${entry.index}`}
									ref={(node) => {
										listRef.current[entry.index] = node;
										labelsRef.current[entry.index] =
											entry.option.label;
									}}
									role="option"
									aria-selected={isSelected(entry.option)}
									aria-disabled={
										entry.option.disabled || undefined
									}
									className={cn([
										styles.option,
										activeIndex === entry.index &&
											styles.optionActive,
									])}
									data-selected={
										isSelected(entry.option) || undefined
									}
									{...getItemProps({
										onClick: () =>
											handleSelect(entry.option),
									})}
								>
									{renderOption
										? renderOption(entry.option)
										: entry.option.label}
								</div>
							)
						)
					)}

					{footer && (
						<div className={styles.listboxFooter}>{footer}</div>
					)}
				</div>
			)}

			{!hideError && <InputErrorMessage>{error}</InputErrorMessage>}
		</div>
	);
}
