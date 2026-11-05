import { expect } from "vitest";
import { configureAxe } from "vitest-axe";
import { toHaveNoViolations } from "vitest-axe/matchers";

expect.extend({ toHaveNoViolations });

/**
 * axe with the rules jsdom can't evaluate turned off, shared by every
 * accessibility assertion in the suite.
 *
 * - `color-contrast`: jsdom has no layout and resolves no color, so this rule
 *   would pass for the wrong reason. Contrast is checked in Storybook
 *   (`@storybook/addon-a11y`) and tracked in the accessibility audit.
 * - `region`: a page-level rule. A component rendered alone is not a page.
 *
 * axe sees neither the keyboard nor focus movement: those are asserted by
 * the regression tests next to each component.
 *
 * floating-ui's focus guards are skipped by `aria-command-name`: invisible
 * tab stops that hand focus back to the trap, unnamed `role="button"` spans
 * on Safari (which is what jsdom's `navigator.vendor` reads as).
 */
const run = configureAxe({
	globalOptions: {
		rules: [
			{
				id: "aria-command-name",
				selector:
					'[role="link"], [role="button"]:not([data-floating-ui-focus-guard]), [role="menuitem"]',
			},
		],
	},
	rules: {
		"color-contrast": { enabled: false },
		region: { enabled: false },
	},
});

/**
 * Fails with axe's own report on any violation. Defaults to `document.body`
 * so a portaled overlay is checked along with whatever rendered it.
 */
export async function expectNoA11yViolations(
	container: Element = document.body
) {
	const results = await run(container);
	expect(results).toHaveNoViolations();
}
