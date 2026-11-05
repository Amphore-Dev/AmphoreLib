import { forwardRef } from "react";
import type { ForwardedRef, ReactElement, RefAttributes } from "react";

/**
 * `forwardRef` for a generic component: React's own typing erases the
 * component's type parameters, so `<Select<Company> />` would stop compiling.
 * Internal, not exported from the package.
 */
export const genericForwardRef = <R, P>(
	render: (props: P, ref: ForwardedRef<R>) => ReactElement | null,
	displayName: string
) => {
	const component = forwardRef(render as never);
	(component as { displayName?: string }).displayName = displayName;
	return component as unknown as (
		props: P & RefAttributes<R>
	) => ReactElement | null;
};
