import React, { useContext, type PropsWithChildren } from "react";

import { AmphoreScopeContext } from "./AmphoreScopeContext";

export interface IAmphoreScopeProps extends PropsWithChildren {
	className?: string;
}

/**
 * Re-applies the nearest AmphoreProvider's theme scope to a subtree that has
 * left the provider's DOM — i.e. portaled content. Reproduces the provider's
 * wrapper attributes (`data-amp-scope`/`data-amp-theme`/`data-amp-density`
 * + inline CSS vars) on a plain `div`. The provider's dark-mode `<style>`
 * block matches on the `data-amp-scope` attribute alone, not on DOM
 * position, so it already applies here — nothing to duplicate.
 *
 * Passthrough when no provider is above: renders children bare.
 *
 * Plain `div` on purpose (not `display: contents`) — an inline `style`
 * carrying custom properties must live on a real box for descendants to
 * inherit it reliably. It's out of flow anyway: what goes in it is
 * `position: fixed`/`absolute` overlay content.
 */
export function AmphoreScope({ className, children }: IAmphoreScopeProps) {
	const scope = useContext(AmphoreScopeContext);
	if (!scope) return <>{children}</>;

	return (
		<div
			className={className}
			data-amp-scope={scope.scopeId}
			data-amp-theme={scope.theme === "system" ? undefined : scope.theme}
			data-amp-density={scope.density}
			style={scope.style}
		>
			{children}
		</div>
	);
}
