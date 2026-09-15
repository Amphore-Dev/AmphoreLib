/**
 * Joins class names, dropping falsy values. No conflict-resolution
 * (twMerge) needed anymore — V2 styles are CSS Modules + data-attributes,
 * not Tailwind utility classes, so there's nothing to deduplicate.
 */
export const cn = (classes: (string | undefined | false | null)[]): string =>
	classes.filter(Boolean).join(" ");
