import React from "react";

import { act, render, screen } from "@testing-library/react";
import { expect } from "vitest";

export interface INativeProbe {
	"data-testid": string;
	"aria-label": string;
	className: string;
	ref: React.RefObject<never>;
}

export interface INativePropsCase {
	/** The component, `native` spread on it. */
	render: (native: INativeProbe) => React.ReactElement;
	/** CSS selector the element receiving native props must match: proves which one it is. */
	target: string;
	/** Where `className` lands when it isn't that element, from the target. Defaults to the target. */
	classNameOn?: (target: HTMLElement) => Element | null;
	/** What `ref` points at when it isn't that element, from the target. `null`: the component takes no ref. */
	refOn?: ((target: HTMLElement) => Element | null) | null;
	/** What the element's `aria-label` reads when the component completes the one given, with its value say. */
	ariaLabel?: string;
	/** Runs after render, for what only appears once opened. */
	open?: () => void | Promise<void>;
}

/**
 * The contract every component honours: `data-testid`, `aria-label` and `ref`
 * reach the same element, `className` the one its props document.
 */
export async function expectNativeProps({
	render: renderCase,
	target,
	classNameOn = (el) => el,
	refOn = (el) => el,
	ariaLabel = "Probe label",
	open,
}: INativePropsCase) {
	const ref = React.createRef<never>();
	render(
		renderCase({
			"data-testid": "probe",
			"aria-label": "Probe label",
			className: "probe-class",
			ref,
		})
	);
	await act(async () => {
		await open?.();
	});

	const element = await screen.findByTestId("probe");
	expect(element).toHaveAttribute("aria-label", ariaLabel);
	expect(element.matches(target)).toBe(true);
	expect(classNameOn(element)).toHaveClass("probe-class");
	if (refOn) expect(ref.current).toBe(refOn(element));
}
