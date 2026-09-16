import { expect } from "vitest";

/**
 * Shared assertions for a component's `portal` prop (see AmphorePortal):
 * `el` rendered by `render()` into `container`, under an `<AmphoreProvider>`.
 * Portaled: outside the provider's `.amp-root`, in `document.body`, and
 * wrapped in an `AmphoreScope` carrying the same `data-amp-scope` and inline
 * CSS vars as the provider. Inline: still inside `container`.
 */
export function expectPortaledWithScope(
	container: HTMLElement,
	el: HTMLElement
) {
	const root = document.querySelector(".amp-root") as HTMLElement;
	expect(root).toBeInTheDocument();
	expect(container.contains(el)).toBe(false);
	expect(document.body.contains(el)).toBe(true);

	const scope = el.closest("[data-amp-scope]") as HTMLElement;
	expect(scope).toBeInTheDocument();
	expect(scope).not.toBe(root);
	expect(scope).toHaveAttribute(
		"data-amp-scope",
		root.getAttribute("data-amp-scope")
	);
	expect(scope.getAttribute("style")).toBe(root.getAttribute("style"));
}

export function expectInline(container: HTMLElement, el: HTMLElement) {
	expect(container.contains(el)).toBe(true);
}
