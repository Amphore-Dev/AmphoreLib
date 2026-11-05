/**
 * Builds the testid of a component's inner part from the `data-testid` the
 * application set on the component: `deriveTestId("invoice", "title")` gives
 * `"invoice-title"`. Testids belong to the application: with no base there
 * is nothing to derive from, and the library never makes one up.
 */
export const deriveTestId = (
	base: string | undefined,
	...parts: (string | number)[]
): string | undefined => (base ? [base, ...parts].join("-") : undefined);

/**
 * What identifies an item in a derived testid: its own value when that reads
 * as text, its position otherwise (an object value, say).
 */
export const testIdPart = (value: unknown, index: number): string | number =>
	typeof value === "string" || typeof value === "number" ? value : index;
