import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import {
	expectInline,
	expectPortaledWithScope,
} from "../../../../tests/expectPortal";

import { SidePanel } from "./SidePanel";

const setMatchMedia = (matches: boolean) => {
	window.matchMedia = vi.fn().mockImplementation((query: string) => ({
		matches,
		media: query,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	})) as unknown as typeof window.matchMedia;
};

describe("SidePanel", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("desktop (no matching mobile media query)", () => {
		it("renders nothing when closed", () => {
			setMatchMedia(false);
			render(
				<SidePanel open={false} onOpenChange={() => {}}>
					content
				</SidePanel>
			);
			expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
		});

		it("renders its content and title when open", () => {
			setMatchMedia(false);
			render(
				<SidePanel open onOpenChange={() => {}} title="Tâche #42">
					<p>Détails</p>
				</SidePanel>
			);
			expect(screen.getByText("Tâche #42")).toBeInTheDocument();
			expect(screen.getByText("Détails")).toBeInTheDocument();
		});

		it("calls onOpenChange(false) when the close button is clicked", () => {
			setMatchMedia(false);
			const onOpenChange = vi.fn();
			render(
				<SidePanel open onOpenChange={onOpenChange}>
					content
				</SidePanel>
			);
			fireEvent.click(screen.getByRole("button", { name: "Close" }));
			expect(onOpenChange).toHaveBeenCalledWith(false);
		});

		it("renders the header slot next to the title", () => {
			setMatchMedia(false);
			render(
				<SidePanel
					open
					onOpenChange={() => {}}
					title="Tâche #42"
					header={<button type="button">Action</button>}
				>
					content
				</SidePanel>
			);
			expect(screen.getByText("Tâche #42")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Action" })
			).toBeInTheDocument();
		});

		it("renders a header row from the slot alone, with no title and no close button", () => {
			setMatchMedia(false);
			render(
				<SidePanel
					open
					onOpenChange={() => {}}
					hideCloseButton
					header={<button type="button">Action</button>}
				>
					content
				</SidePanel>
			);
			expect(screen.getAllByRole("button")).toHaveLength(1);
			expect(
				screen.getByRole("button", { name: "Action" })
			).toBeInTheDocument();
		});

		it("hides the close button when hideCloseButton is set", () => {
			setMatchMedia(false);
			render(
				<SidePanel open onOpenChange={() => {}} hideCloseButton>
					content
				</SidePanel>
			);
			expect(screen.queryByRole("button")).not.toBeInTheDocument();
		});

		it("marks itself data-overlay when overlay is set", () => {
			setMatchMedia(false);
			render(
				<SidePanel open onOpenChange={() => {}} overlay>
					content
				</SidePanel>
			);
			expect(screen.getByRole("complementary")).toHaveAttribute(
				"data-overlay",
				"true"
			);
		});

		it("forwards cardProps to the docked panel's Card, keeping its own role and class", () => {
			setMatchMedia(false);
			render(
				<SidePanel
					open
					onOpenChange={() => {}}
					title="Tâche #42"
					className="mine"
					cardProps={{
						elevation: 5,
						bordered: true,
						"aria-label": "Custom",
						"data-testid": "panel",
					}}
				>
					content
				</SidePanel>
			);
			const panel = screen.getByRole("complementary", { name: "Custom" });
			expect(panel).toHaveAttribute("data-testid", "panel");
			expect(panel).toHaveAttribute("data-elevation", "5");
			expect(panel).toHaveAttribute("data-bordered", "true");
			expect(panel).toHaveAttribute("data-no-padding", "true");
			expect(panel).toHaveClass("mine");
		});

		it("doesn't set data-overlay by default", () => {
			setMatchMedia(false);
			render(
				<SidePanel open onOpenChange={() => {}}>
					content
				</SidePanel>
			);
			expect(screen.getByRole("complementary")).not.toHaveAttribute(
				"data-overlay"
			);
		});
	});

	describe("mobile (matching media query)", () => {
		it("renders nothing when closed, by default — same as desktop", () => {
			setMatchMedia(true);
			render(
				<SidePanel
					open={false}
					onOpenChange={() => {}}
					title="Tâche #42"
				>
					<p>Détails</p>
				</SidePanel>
			);
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
			expect(screen.queryByText("Détails")).not.toBeInTheDocument();
		});

		it("shows its content when open", () => {
			setMatchMedia(true);
			render(
				<SidePanel open onOpenChange={() => {}}>
					<p>Détails</p>
				</SidePanel>
			);
			expect(screen.getByText("Détails")).toBeVisible();
		});

		it("renders the header slot at the top of the content", () => {
			setMatchMedia(true);
			render(
				<SidePanel
					open
					onOpenChange={() => {}}
					header={<button type="button">Action</button>}
				>
					<p>Détails</p>
				</SidePanel>
			);
			expect(
				screen.getByRole("button", { name: "Action" })
			).toBeVisible();
		});

		it("stays docked (visible, content hidden) when closed if keepDockedOnMobile is set", () => {
			setMatchMedia(true);
			render(
				<SidePanel
					open={false}
					onOpenChange={() => {}}
					title="Tâche #42"
					keepDockedOnMobile
				>
					<p>Détails</p>
				</SidePanel>
			);
			expect(screen.getByRole("dialog")).toBeInTheDocument();
			expect(screen.getByText("Tâche #42")).toBeInTheDocument();
			// Docked (closed): content is present but hidden, not gone.
			expect(screen.getByText("Détails")).not.toBeVisible();
		});
	});

	describe('mobile, mobileMode="modal"', () => {
		it("renders nothing when closed — keepDockedOnMobile has nothing to act on", () => {
			setMatchMedia(true);
			render(
				<SidePanel
					open={false}
					onOpenChange={() => {}}
					mobileMode="modal"
					keepDockedOnMobile
					title="Tâche #42"
				>
					<p>Détails</p>
				</SidePanel>
			);
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
			expect(screen.queryByText("Détails")).not.toBeInTheDocument();
		});

		it("renders a Modal dialog with the title as its heading and the content", () => {
			setMatchMedia(true);
			render(
				<SidePanel
					open
					onOpenChange={() => {}}
					mobileMode="modal"
					title="Tâche #42"
				>
					<p>Détails</p>
				</SidePanel>
			);
			const dialog = screen.getByRole("dialog");
			expect(dialog).toBeInTheDocument();
			expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
			expect(
				screen.getByRole("heading", { name: "Tâche #42" })
			).toBeInTheDocument();
			expect(dialog).toHaveAttribute(
				"aria-labelledby",
				screen.getByRole("heading", { name: "Tâche #42" }).id
			);
			expect(screen.getByText("Détails")).toBeVisible();
		});

		it("still renders a non-string title, in the body", () => {
			setMatchMedia(true);
			render(
				<SidePanel
					open
					onOpenChange={() => {}}
					mobileMode="modal"
					title={<em>Tâche #42</em>}
				>
					<p>Détails</p>
				</SidePanel>
			);
			expect(screen.getByText("Tâche #42")).toBeInTheDocument();
			expect(screen.getByRole("dialog")).not.toHaveAttribute(
				"aria-labelledby"
			);
		});

		it("calls onOpenChange(false) from the Modal's close button", () => {
			setMatchMedia(true);
			const onOpenChange = vi.fn();
			render(
				<SidePanel open onOpenChange={onOpenChange} mobileMode="modal">
					content
				</SidePanel>
			);
			fireEvent.click(screen.getByRole("button", { name: "Close" }));
			expect(onOpenChange).toHaveBeenCalledWith(false);
		});

		it("calls onOpenChange(false) on Escape", async () => {
			setMatchMedia(true);
			const user = userEvent.setup();
			const onOpenChange = vi.fn();
			render(
				<SidePanel open onOpenChange={onOpenChange} mobileMode="modal">
					content
				</SidePanel>
			);
			await user.keyboard("{Escape}");
			expect(onOpenChange).toHaveBeenCalledWith(false);
		});

		it("respects hideCloseButton and closeLabel", () => {
			setMatchMedia(true);
			const { rerender } = render(
				<SidePanel
					open
					onOpenChange={() => {}}
					mobileMode="modal"
					closeLabel="Fermer"
				>
					content
				</SidePanel>
			);
			expect(
				screen.getByRole("button", { name: "Fermer" })
			).toBeInTheDocument();

			rerender(
				<SidePanel
					open
					onOpenChange={() => {}}
					mobileMode="modal"
					hideCloseButton
				>
					content
				</SidePanel>
			);
			// By name: FloatingFocusManager's own focus guards are role="button" too.
			expect(
				screen.queryByRole("button", { name: "Close" })
			).not.toBeInTheDocument();
		});

		it("forwards the header slot to the Modal", () => {
			setMatchMedia(true);
			render(
				<SidePanel
					open
					onOpenChange={() => {}}
					mobileMode="modal"
					hideCloseButton
					header={<button type="button">Action</button>}
				>
					content
				</SidePanel>
			);
			expect(screen.getByRole("dialog")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Action" })
			).toBeInTheDocument();
		});

		it("forwards modalProps to the Modal", () => {
			setMatchMedia(true);
			render(
				<SidePanel
					open
					onOpenChange={() => {}}
					mobileMode="modal"
					modalProps={{ size: "lg" }}
				>
					content
				</SidePanel>
			);
			expect(screen.getByRole("dialog")).toHaveAttribute(
				"data-size",
				"lg"
			);
		});

		it("is not used on desktop — the docked panel renders regardless of mobileMode", () => {
			setMatchMedia(false);
			render(
				<SidePanel open onOpenChange={() => {}} mobileMode="modal">
					content
				</SidePanel>
			);
			expect(screen.getByRole("complementary")).toBeInTheDocument();
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});
	});

	describe("portal", () => {
		it("desktop sticky mode ignores portal — a layout column stays in the flow", () => {
			setMatchMedia(false);
			const { container } = render(
				<AmphoreProvider>
					<SidePanel open onOpenChange={() => {}} portal>
						<p>Détails</p>
					</SidePanel>
				</AmphoreProvider>
			);
			expectInline(container, screen.getByRole("complementary"));
		});

		it("desktop overlay mode portals into document.body with the theme scope", () => {
			setMatchMedia(false);
			const { container } = render(
				<AmphoreProvider>
					<SidePanel open onOpenChange={() => {}} overlay portal>
						<p>Détails</p>
					</SidePanel>
				</AmphoreProvider>
			);
			expectPortaledWithScope(
				container,
				screen.getByRole("complementary")
			);
		});

		it("mobile forwards portal to the BottomPanel", () => {
			setMatchMedia(true);
			const { container } = render(
				<AmphoreProvider>
					<SidePanel open onOpenChange={() => {}} portal>
						<p>Détails</p>
					</SidePanel>
				</AmphoreProvider>
			);
			expectPortaledWithScope(container, screen.getByRole("dialog"));
		});

		it('mobile forwards portal to the Modal when mobileMode="modal"', () => {
			setMatchMedia(true);
			const { container } = render(
				<AmphoreProvider>
					<SidePanel
						open
						onOpenChange={() => {}}
						mobileMode="modal"
						portal
					>
						<p>Détails</p>
					</SidePanel>
				</AmphoreProvider>
			);
			expectPortaledWithScope(container, screen.getByRole("dialog"));
		});

		it("mobile Modal stays inline without portal", () => {
			setMatchMedia(true);
			const { container } = render(
				<AmphoreProvider>
					<SidePanel open onOpenChange={() => {}} mobileMode="modal">
						<p>Détails</p>
					</SidePanel>
				</AmphoreProvider>
			);
			expectInline(container, screen.getByRole("dialog"));
		});
	});
});
