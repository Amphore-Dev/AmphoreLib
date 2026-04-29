import { TBaseField, TEditFields, TFieldsGroup } from "@interfaces/TFields";

export const isFieldsGroupArray = (value: unknown): value is TFieldsGroup[] => {
	return (
		Array.isArray(value) &&
		value.length > 0 &&
		typeof value[0] === "object" &&
		value[0] !== null &&
		"fields" in (value[0] as object) &&
		Array.isArray((value[0] as { fields: unknown }).fields)
	);
};

export const genGroups = (
	result: TEditFields,
	mergeItems?: boolean
): TFieldsGroup[] => {
	if (!Array.isArray(result) || result.length === 0) {
		return [{ fields: [] }];
	}

	if (isFieldsGroupArray(result)) {
		if (mergeItems) {
			const mergedFields = result.flatMap((group) =>
				typeof group.fields === "function"
					? group.fields(false)
					: group.fields
			);
			return [{ fields: mergedFields }];
		}
		return result;
	}

	return [{ fields: result as TBaseField[] }];
};

export const computeModalSize = (nbrGroups: number): "s" | "m" | "l" => {
	if (nbrGroups < 2) return "s";
	if (nbrGroups <= 3) return "m";
	return "l";
};
