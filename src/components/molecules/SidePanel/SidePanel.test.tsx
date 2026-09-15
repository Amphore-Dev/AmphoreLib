import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

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
				<SidePanel open={false} onOpenChange={() => {}} title="Tâche #42">
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
});
