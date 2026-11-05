import type { ComponentPropsWithoutRef, ElementType } from "react";

/**
 * `data-*` attributes. JSX lets any hyphenated attribute through on its own,
 * an object literal does not: this is what makes
 * `wrapperProps={{ "data-testid": "x" }}` compile.
 */
export type TDataAttributes = { [key: `data-${string}`]: unknown };

/** Native props of one inner element of a component: `wrapperProps`, `menuProps`, `inputProps`... */
export type TElementProps<E extends ElementType> = ComponentPropsWithoutRef<E> &
	TDataAttributes;

/** For a component that derives its inner parts' testids from its own `data-testid` (see `deriveTestId`). */
export interface ITestIdProps {
	"data-testid"?: string;
}
