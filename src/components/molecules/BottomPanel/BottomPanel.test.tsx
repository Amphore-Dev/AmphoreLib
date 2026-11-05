import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import {
	expectInline,
	expectPortaledWithScope,
} from "../../../../tests/expectPortal";

import { BottomPanel } from "./BottomPanel";

describe("BottomPanel", () => {
	it("shows its content when open", () => {
		render(
			<BottomPanel open onOpenChange={() => {}}>
				<p>Détails</p>
			</BottomPanel>
		);
		expect(screen.getByText("Détails")).toBeVisible();
	});

	it("hides its content when closed (docked), without unmounting it", () => {
		render(
			<BottomPanel open={false} onOpenChange={() => {}}>
				<p>Détails</p>
			</BottomPanel>
		);
		expect(screen.getByText("Détails")).not.toBeVisible();
	});

	it("toggles open on a tap (pointerdown/pointerup with no movement)", () => {
		const onOpenChange = vi.fn();
		render(
			<BottomPanel open={false} onOpenChange={onOpenChange}>
				content
			</BottomPanel>
		);
		const handle = screen.getByRole("button", {
			name: "Expand panel",
		});
		fireEvent.pointerDown(handle, { clientY: 100 });
		fireEvent(window, new PointerEvent("pointerup"));
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it("toggles the Enter/Space key on the handle without needing a drag", () => {
		const onOpenChange = vi.fn();
		render(
			<BottomPanel open={false} onOpenChange={onOpenChange}>
				content
			</BottomPanel>
		);
		fireEvent.keyDown(
			screen.getByRole("button", { name: "Expand panel" }),
			{ key: "Enter" }
		);
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it("stays open (calling onOpenChange(true)) when a drag ends above closeThreshold", () => {
		const onOpenChange = vi.fn();
		render(
			<BottomPanel open onOpenChange={onOpenChange} defaultHeight={500}>
				content
			</BottomPanel>
		);
		const handle = screen.getByRole("button", {
			name: "Collapse panel",
		});
		fireEvent.pointerDown(handle, { clientY: 300 });
		fireEvent(window, new PointerEvent("pointermove", { clientY: 200 })); // dragged up 100px
		fireEvent(window, new PointerEvent("pointerup"));
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it("closes when a drag ends below closeThreshold", () => {
		const onOpenChange = vi.fn();
		render(
			<BottomPanel
				open
				onOpenChange={onOpenChange}
				defaultHeight={500}
				closeThreshold={200}
			>
				content
			</BottomPanel>
		);
		const handle = screen.getByRole("button", {
			name: "Collapse panel",
		});
		fireEvent.pointerDown(handle, { clientY: 100 });
		fireEvent(window, new PointerEvent("pointermove", { clientY: 500 })); // dragged down 400px, well past the threshold
		fireEvent(window, new PointerEvent("pointerup"));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("ignores movement under the drag threshold — still counts as a tap", () => {
		const onOpenChange = vi.fn();
		render(
			<BottomPanel open={false} onOpenChange={onOpenChange}>
				content
			</BottomPanel>
		);
		const handle = screen.getByRole("button", {
			name: "Expand panel",
		});
		fireEvent.pointerDown(handle, { clientY: 100 });
		fireEvent(window, new PointerEvent("pointermove", { clientY: 102 })); // 2px, under the 4px threshold
		fireEvent(window, new PointerEvent("pointerup"));
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it("doesn't toggle on a press the browser cancelled — not a tap", () => {
		const onOpenChange = vi.fn();
		render(
			<BottomPanel open={false} onOpenChange={onOpenChange}>
				content
			</BottomPanel>
		);
		const handle = screen.getByRole("button", {
			name: "Expand panel",
		});
		fireEvent.pointerDown(handle, { clientY: 100 });
		fireEvent(window, new PointerEvent("pointercancel"));
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	describe("portal", () => {
		it("renders inline by default", () => {
			const { container } = render(
				<BottomPanel open onOpenChange={() => {}}>
					<p>Contenu</p>
				</BottomPanel>
			);
			expectInline(container, screen.getByRole("dialog"));
		});

		it("renders into document.body with the theme scope when portal is set", () => {
			const { container } = render(
				<AmphoreProvider theme="light">
					<BottomPanel open onOpenChange={() => {}} portal>
						<p>Contenu</p>
					</BottomPanel>
				</AmphoreProvider>
			);
			expectPortaledWithScope(container, screen.getByRole("dialog"));
			expect(screen.getByText("Contenu")).toBeInTheDocument();
		});
	});
});

describe("BottomPanel keyboard", () => {
	it("closes on Escape", () => {
		const onOpenChange = vi.fn();
		render(
			<BottomPanel open onOpenChange={onOpenChange}>
				content
			</BottomPanel>
		);

		fireEvent.keyDown(document.body, { key: "Escape" });

		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("ties the handle to the content it toggles", () => {
		render(
			<BottomPanel open onOpenChange={() => {}}>
				<p>Details</p>
			</BottomPanel>
		);
		const handle = screen.getByRole("button", { name: "Collapse panel" });
		const content = screen.getByText("Details").parentElement;

		expect(handle).toHaveAttribute("aria-controls", content?.id);
	});

	it("moves focus to the handle when closed with focus inside", () => {
		const { rerender } = render(
			<BottomPanel open onOpenChange={() => {}}>
				<button type="button">Inside</button>
			</BottomPanel>
		);
		screen.getByRole("button", { name: "Inside" }).focus();

		rerender(
			<BottomPanel open={false} onOpenChange={() => {}}>
				<button type="button">Inside</button>
			</BottomPanel>
		);

		expect(
			screen.getByRole("button", { name: "Expand panel" })
		).toHaveFocus();
	});

	it("takes focus on open only when asked to", () => {
		const { rerender } = render(
			<BottomPanel open onOpenChange={() => {}}>
				content
			</BottomPanel>
		);
		expect(document.body).toHaveFocus();

		rerender(
			<BottomPanel open onOpenChange={() => {}} focusOnOpen>
				content
			</BottomPanel>
		);
		expect(
			screen.getByRole("button", { name: "Collapse panel" })
		).toHaveFocus();
	});
});
