/** Shared option shape for Select and its future siblings (AsyncSelect...). */
export type TSelectOption<T = string> = {
	value: T;
	label: string;
	disabled?: boolean;
};

/**
 * A labeled group of options — pass `Select`/`AsyncSelect`'s `options` as
 * `TSelectOptionGroup<T>[]` instead of `TSelectOption<T>[]` to get a group
 * heading rendered above each set (see `Select`'s `renderGroupHeader`).
 * Group headings aren't part of keyboard navigation/selection — only real
 * options are.
 */
export type TSelectOptionGroup<T = string> = {
	label: string;
	options: TSelectOption<T>[];
};
