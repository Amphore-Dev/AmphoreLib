import React, { type PropsWithChildren } from "react";

import { FloatingPortal } from "@floating-ui/react";

import { AmphoreScope } from "./AmphoreScope";

export interface IAmphorePortalProps extends PropsWithChildren {
	/** Portal target. Defaults to `document.body` (floating-ui's own default). */
	root?: HTMLElement | null;
}

/**
 * The lib's one portal primitive — `FloatingPortal` with the theme scope
 * re-applied inside it (see AmphoreScope). Use this, never a bare
 * `FloatingPortal`/`createPortal`: those leave the provider's CSS vars
 * behind, and the portaled content falls back to the default theme at
 * `:root`, ignoring the provider's config and dark palette.
 */
export function AmphorePortal({ root, children }: IAmphorePortalProps) {
	return (
		<FloatingPortal root={root}>
			<AmphoreScope>{children}</AmphoreScope>
		</FloatingPortal>
	);
}
