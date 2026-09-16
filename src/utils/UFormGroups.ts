import { createElement, type ReactNode } from "react";

import { isNil, isPlainObject } from "lodash";

import {
	TEditFields,
	TField,
	TFieldsGroup,
	TFieldType,
	TSize,
} from "@interfaces/index";

/** A `TFieldsGroup[]` item always has a `fields` key; a bare `TField` never does. */
const isFieldsGroupArray = (fields: TEditFields): fields is TFieldsGroup[] =>
	fields.length > 0 && "fields" in fields[0];

/**
 * Normalizes `TEditFields` (either a flat `TField[]`, or an already-grouped
 * `TFieldsGroup[]`) into `TFieldsGroup[]`. With `mergeForDisplay`, multiple
 * groups collapse into one (titles dropped) — used by EditableCard's
 * read-only display, where the group titles/columns only matter in the
 * edit form.
 */
export const genGroups = (
	fields: TEditFields,
	mergeForDisplay = false
): TFieldsGroup[] => {
	const groups: TFieldsGroup[] = isFieldsGroupArray(fields)
		? fields
		: [{ fields: fields as TField[] }];

	if (!mergeForDisplay || groups.length <= 1) return groups;

	return [
		{
			fields: (isEditing: boolean) =>
				groups.flatMap((group) =>
					typeof group.fields === "function"
						? group.fields(isEditing)
						: group.fields
				),
		},
	];
};

/** Wider forms need more room — used to pick a FormRenderer/FiltersModal modal's size from its column count. */
export const computeModalSize = (columns = 1): TSize => {
	if (columns <= 1) return "sm";
	if (columns === 2) return "md";
	return "lg";
};

/**
 * True for anything a form field would consider "has a value" — used to
 * decide whether a field's reset button is enabled, or an EditableCard
 * display value shows "-" instead. `0`/`false` count as values; `null`,
 * `undefined`, `""`/whitespace-only strings, empty arrays/objects don't.
 */
export const hasValue = (value: unknown): boolean => {
	if (isNil(value)) return false;
	if (typeof value === "string") return value.trim().length > 0;
	if (Array.isArray(value)) return value.length > 0;
	if (isPlainObject(value)) return Object.keys(value as object).length > 0;
	return true;
};

/**
 * Read-only rendering for a field's raw stored value, per `type` — without
 * this, EditableCard's display mode fell back to rendering the raw value
 * as-is (`value as React.ReactNode`), which crashes for anything that
 * isn't already a primitive/ReactNode: a `date` field's value is a real
 * `Date` object (not renderable at all — React throws), a `file` field's
 * is a `(File | null)[]` (same problem), a `toggle`'s boolean silently
 * renders as nothing instead of "Yes"/"No". Returns `undefined` (not "-")
 * for a type with no special-cased default, or when the value's shape
 * doesn't match what the type normally holds — the caller's own
 * has-a-value/"-" fallback still applies in that case.
 *
 * A field's own `valueDisplay` always wins over this — this only fills the
 * gap when no `valueDisplay` was given at all.
 */
export const getDefaultValueDisplay = (
	type: TFieldType | undefined,
	value: unknown
): ReactNode | undefined => {
	switch (type) {
		case "date":
			return value instanceof Date
				? value.toLocaleDateString("en-US")
				: undefined;

		case "toggle":
			return typeof value === "boolean"
				? value
					? "Yes"
					: "No"
				: undefined;

		case "checkbox":
			return Array.isArray(value)
				? (value as string[]).join(", ")
				: undefined;

		case "file": {
			const files = (
				Array.isArray(value) ? value : value ? [value] : []
			).filter(Boolean) as File[];
			if (!files.length) return undefined;
			return files.length === 1 ? files[0].name : `${files.length} files`;
		}

		case "color":
			// A swatch next to the hex - the value alone reads as noise.
			return typeof value === "string" && value
				? createElement(
						"span",
						{
							style: {
								display: "inline-flex",
								alignItems: "center",
								gap: "0.5em",
							},
						},
						createElement("span", {
							"aria-hidden": true,
							style: {
								display: "inline-block",
								width: "1em",
								height: "1em",
								borderRadius: "var(--amp-radius-md)",
								border: "1px solid var(--amp-color-border)",
								background: value,
							},
						}),
						value
					)
				: undefined;

		default:
			return undefined;
	}
};
