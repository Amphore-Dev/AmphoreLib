import React, { useState } from "react";

import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import {
	expectInline,
	expectPortaledWithScope,
} from "../../../../tests/expectPortal";

import { ITourProps, TTourStep, Tour } from "./Tour";

// jsdom has no matchMedia at all: `matches` decides desktop vs mobile.
const mockViewport = (mobile: boolean) => {
	window.matchMedia = vi.fn().mockImplementation((query: string) => ({
		matches: query.includes("max-width") ? mobile : false,
		media: query,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	})) as unknown as typeof window.matchMedia;
};

const STEPS: TTourStep[] = [
	{ target: '[data-tour="menu"]', title: "Menu", content: "The menu" },
	{ target: '[data-tour="view"]', title: "View", content: "The view" },
	{ target: '[data-tour="task"]', title: "Task", content: "New task" },
];

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div>
		<nav data-tour="menu">menu</nav>
		<div data-tour="view">view</div>
		<button type="button" data-tour="task">
			task
		</button>
		{children}
	</div>
);

const renderTour = (props: Partial<ITourProps> = {}) => {
	const onClose = vi.fn();
	const utils = render(
		<Page>
			<Tour steps={STEPS} open onClose={onClose} {...props} />
		</Page>
	);
	return { onClose, ...utils };
};

describe("Tour", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("navigation", () => {
		it("renders nothing while closed", () => {
			mockViewport(false);
			renderTour({ open: false });
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});

		it("opens on the first step, labelled by its title", () => {
			mockViewport(false);
			renderTour();
			const dialog = screen.getByRole("dialog", { name: "Menu" });
			expect(dialog).toHaveAccessibleDescription("The menu");
			expect(dialog).toHaveTextContent("Step 1 of 3");
		});

		it("focuses the primary button", () => {
			mockViewport(false);
			renderTour();
			return waitFor(() =>
				expect(
					screen.getByRole("button", { name: "Next" })
				).toHaveFocus()
			);
		});

		it("goes forward and back", async () => {
			mockViewport(false);
			const user = userEvent.setup();
			renderTour();
			expect(
				screen.queryByRole("button", { name: "Previous" })
			).not.toBeInTheDocument();

			await user.click(screen.getByRole("button", { name: "Next" }));
			expect(screen.getByRole("dialog")).toHaveTextContent("Step 2 of 3");
			expect(screen.getByRole("heading")).toHaveTextContent("View");

			await user.click(screen.getByRole("button", { name: "Previous" }));
			expect(screen.getByRole("heading")).toHaveTextContent("Menu");
		});

		it("closes with 'done' from the last step", async () => {
			mockViewport(false);
			const user = userEvent.setup();
			const { onClose } = renderTour({ step: 2 });
			expect(
				screen.queryByRole("button", { name: "Skip" })
			).not.toBeInTheDocument();
			await user.click(screen.getByRole("button", { name: "Done" }));
			expect(onClose).toHaveBeenCalledWith("done");
		});

		it("closes with 'skip' from the skip button", async () => {
			mockViewport(false);
			const user = userEvent.setup();
			const { onClose } = renderTour();
			await user.click(screen.getByRole("button", { name: "Skip" }));
			expect(onClose).toHaveBeenCalledWith("skip");
		});

		it("closes with 'skip' on Escape", async () => {
			mockViewport(false);
			const user = userEvent.setup();
			const { onClose } = renderTour();
			await user.keyboard("{Escape}");
			expect(onClose).toHaveBeenCalledWith("skip");
		});

		it("moves with the arrow keys", async () => {
			mockViewport(false);
			const user = userEvent.setup();
			renderTour();
			await waitFor(() =>
				expect(
					screen.getByRole("button", { name: "Next" })
				).toHaveFocus()
			);
			await user.keyboard("{ArrowRight}");
			expect(screen.getByRole("heading")).toHaveTextContent("View");
			await user.keyboard("{ArrowLeft}");
			expect(screen.getByRole("heading")).toHaveTextContent("Menu");
		});

		it("starts over each time it opens (uncontrolled)", async () => {
			mockViewport(false);
			const user = userEvent.setup();
			const onClose = vi.fn();
			const { rerender } = render(
				<Page>
					<Tour steps={STEPS} open onClose={onClose} />
				</Page>
			);
			await user.click(screen.getByRole("button", { name: "Next" }));
			rerender(
				<Page>
					<Tour steps={STEPS} open={false} onClose={onClose} />
				</Page>
			);
			rerender(
				<Page>
					<Tour steps={STEPS} open onClose={onClose} />
				</Page>
			);
			expect(screen.getByRole("heading")).toHaveTextContent("Menu");
		});

		it("follows a controlled step and reports changes", async () => {
			mockViewport(false);
			const user = userEvent.setup();
			const onStepChange = vi.fn();
			const Controlled = () => {
				const [step, setStep] = useState(1);
				return (
					<Page>
						<Tour
							steps={STEPS}
							open
							onClose={() => {}}
							step={step}
							onStepChange={(i) => {
								onStepChange(i);
								setStep(i);
							}}
						/>
					</Page>
				);
			};
			render(<Controlled />);
			expect(screen.getByRole("heading")).toHaveTextContent("View");
			await user.click(screen.getByRole("button", { name: "Next" }));
			expect(onStepChange).toHaveBeenCalledWith(2);
			expect(screen.getByRole("heading")).toHaveTextContent("Task");
		});

		it("uses the provider's labels", () => {
			mockViewport(false);
			render(
				<AmphoreProvider locale="fr">
					<Page>
						<Tour steps={STEPS} open onClose={() => {}} />
					</Page>
				</AmphoreProvider>
			);
			expect(screen.getByRole("dialog")).toHaveTextContent(
				"Étape 1 sur 3"
			);
			expect(
				screen.getByRole("button", { name: "Suivant" })
			).toBeInTheDocument();
		});
	});

	describe("devices", () => {
		const PER_DEVICE: TTourStep[] = [
			{
				target: {
					desktop: '[data-tour="menu"]',
					mobile: '[data-tour="view"]',
				},
				title: "Navigation",
				content: { desktop: "Sidebar", mobile: "Bottom bar" },
			},
			{
				target: '[data-tour="task"]',
				title: "Mobile only",
				content: "Only on phones",
				only: "mobile",
			},
			{
				target: '[data-tour="task"]',
				title: "Task",
				content: "New task",
			},
		];

		it("shows the desktop content in a popover on desktop", () => {
			mockViewport(false);
			renderTour({ steps: PER_DEVICE });
			const dialog = screen.getByRole("dialog");
			expect(dialog).toHaveAttribute("data-variant", "popover");
			expect(dialog).toHaveTextContent("Sidebar");
		});

		it("shows the mobile content in a sheet on mobile", () => {
			mockViewport(true);
			renderTour({ steps: PER_DEVICE });
			const dialog = screen.getByRole("dialog");
			expect(dialog).toHaveAttribute("data-variant", "sheet");
			expect(dialog).toHaveTextContent("Bottom bar");
		});

		it("keeps an explicit variant whatever the device", () => {
			mockViewport(false);
			renderTour({ steps: PER_DEVICE, variant: "sheet" });
			expect(screen.getByRole("dialog")).toHaveAttribute(
				"data-variant",
				"sheet"
			);
			// Still desktop content: the device isn't the variant.
			expect(screen.getByRole("dialog")).toHaveTextContent("Sidebar");
		});

		it("leaves out a mobile-only step on desktop, count included", async () => {
			mockViewport(false);
			const user = userEvent.setup();
			renderTour({ steps: PER_DEVICE });
			expect(screen.getByRole("dialog")).toHaveTextContent("Step 1 of 2");
			await user.click(screen.getByRole("button", { name: "Next" }));
			expect(screen.getByRole("heading")).toHaveTextContent("Task");
		});

		it("counts it on mobile", () => {
			mockViewport(true);
			renderTour({ steps: PER_DEVICE });
			expect(screen.getByRole("dialog")).toHaveTextContent("Step 1 of 3");
		});

		it("falls on the next visible step when pointed at a hidden one", () => {
			mockViewport(false);
			renderTour({ steps: PER_DEVICE, step: 1 });
			expect(screen.getByRole("heading")).toHaveTextContent("Task");
			expect(screen.getByRole("dialog")).toHaveTextContent("Step 2 of 2");
		});
	});

	describe("targets", () => {
		it("centers a step without a target", () => {
			mockViewport(false);
			renderTour({
				steps: [{ title: "Welcome", content: "Hi" }, ...STEPS],
			});
			expect(screen.getByRole("dialog")).toHaveAttribute(
				"data-centered",
				"true"
			);
		});

		it("waits for a target rendered late", async () => {
			mockViewport(false);
			const Late = () => {
				const [shown, setShown] = useState(false);
				return (
					<div>
						<button type="button" onClick={() => setShown(true)}>
							show
						</button>
						{shown && <div data-tour="late">late</div>}
						<Tour
							steps={[
								{
									target: '[data-tour="late"]',
									title: "Late",
									content: "Arrived",
								},
							]}
							open
							onClose={() => {}}
						/>
					</div>
				);
			};
			render(<Late />);
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
			// The tour's layer swallows clicks: trigger the change directly.
			act(() => screen.getByRole("button", { name: "show" }).click());
			expect(
				await screen.findByRole("dialog", { name: "Late" })
			).toBeInTheDocument();
		});

		it("skips an optional step whose target never shows up", async () => {
			mockViewport(false);
			renderTour({
				targetTimeout: 20,
				steps: [
					{
						target: '[data-tour="nowhere"]',
						title: "Ghost",
						content: "Never there",
						optional: true,
					},
					...STEPS,
				],
			});
			expect(
				await screen.findByRole("dialog", { name: "Menu" })
			).toBeInTheDocument();
		});

		it("closes with 'missing' when a required target never shows up", async () => {
			mockViewport(false);
			const { onClose } = renderTour({
				targetTimeout: 20,
				steps: [
					{
						target: '[data-tour="nowhere"]',
						title: "Ghost",
						content: "Never there",
					},
				],
			});
			await waitFor(() =>
				expect(onClose).toHaveBeenCalledWith("missing")
			);
		});
	});

	describe("welcome step", () => {
		const WELCOME: TTourStep = {
			title: "Welcome",
			content: "A quick tour",
			nextLabel: "Start the tour",
			skipLabel: "Later",
			progress: false,
		};

		it("shows its own buttons and no progress", () => {
			mockViewport(false);
			renderTour({ steps: [WELCOME, ...STEPS] });
			const dialog = screen.getByRole("dialog", { name: "Welcome" });
			expect(dialog).not.toHaveTextContent(/Step \d/);
			expect(
				screen.getByRole("button", { name: "Start the tour" })
			).toBeInTheDocument();
			expect(
				screen.queryByRole("button", { name: "Next" })
			).not.toBeInTheDocument();
		});

		it("is left out of the count of the steps after it", async () => {
			mockViewport(false);
			const user = userEvent.setup();
			renderTour({ steps: [WELCOME, ...STEPS] });
			await user.click(
				screen.getByRole("button", { name: "Start the tour" })
			);
			const dialog = screen.getByRole("dialog", { name: "Menu" });
			expect(dialog).toHaveTextContent("Step 1 of 3");
			// Back to the welcome step, with the tour's own labels after it.
			expect(
				screen.getByRole("button", { name: "Previous" })
			).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Skip" })
			).toBeInTheDocument();
		});

		it("closes with 'skip' from its own skip button", async () => {
			mockViewport(false);
			const user = userEvent.setup();
			const { onClose } = renderTour({ steps: [WELCOME, ...STEPS] });
			await user.click(screen.getByRole("button", { name: "Later" }));
			expect(onClose).toHaveBeenCalledWith("skip");
		});

		it("replaces 'Done' on a last step", () => {
			mockViewport(false);
			renderTour({
				steps: [{ ...STEPS[0], nextLabel: "Let's go" }],
			});
			expect(
				screen.getByRole("button", { name: "Let's go" })
			).toBeInTheDocument();
		});
	});

	describe("actionsAlign", () => {
		const footer = () =>
			screen.getByRole("dialog").querySelector("[data-actions-align]");

		it("defaults to 'end'", () => {
			mockViewport(false);
			renderTour();
			expect(footer()).toHaveAttribute("data-actions-align", "end");
		});

		it("takes the tour's value", () => {
			mockViewport(false);
			renderTour({ actionsAlign: "start" });
			expect(footer()).toHaveAttribute("data-actions-align", "start");
		});

		it("lets a step override the tour's value", () => {
			mockViewport(false);
			renderTour({
				actionsAlign: "start",
				steps: [{ ...STEPS[0], actionsAlign: "center" }, ...STEPS],
			});
			expect(footer()).toHaveAttribute("data-actions-align", "center");
		});

		it("drops the empty dots row when centered without progress", () => {
			mockViewport(false);
			renderTour({
				steps: [
					{
						title: "Welcome",
						content: "Hi",
						progress: false,
						actionsAlign: "center",
					},
					...STEPS,
				],
			});
			// Only the buttons' row is left.
			expect(footer()?.children).toHaveLength(1);
		});

		it("keeps the dots row centered with progress", () => {
			mockViewport(false);
			renderTour({ actionsAlign: "center" });
			expect(footer()?.children).toHaveLength(2);
			expect(footer()?.firstElementChild?.children).toHaveLength(3);
		});
	});

	describe("portal", () => {
		it("renders inline by default", () => {
			mockViewport(false);
			const { container } = render(
				<AmphoreProvider>
					<Page>
						<Tour steps={STEPS} open onClose={() => {}} />
					</Page>
				</AmphoreProvider>
			);
			expectInline(container, screen.getByRole("dialog"));
		});

		it("renders into the body with the theme scope when portaled", () => {
			mockViewport(false);
			const { container } = render(
				<AmphoreProvider>
					<Page>
						<Tour steps={STEPS} open onClose={() => {}} portal />
					</Page>
				</AmphoreProvider>
			);
			expectPortaledWithScope(container, screen.getByRole("dialog"));
		});
	});
});
