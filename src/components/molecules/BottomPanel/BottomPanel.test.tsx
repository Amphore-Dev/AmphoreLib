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

	it("toggles open on a tap (mousedown/mouseup with no movement)", () => {
		const onOpenChange = vi.fn();
		render(
			<BottomPanel open={false} onOpenChange={onOpenChange}>
				content
			</BottomPanel>
		);
		const handle = screen.getByRole("button", {
			name: "Expand panel",
		});
		fireEvent.mouseDown(handle, { clientY: 100 });
		fireEvent.mouseUp(window);
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
		fireEvent.mouseDown(handle, { clientY: 300 });
		fireEvent.mouseMove(window, { clientY: 200 }); // dragged up 100px
		fireEvent.mouseUp(window);
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
		fireEvent.mouseDown(handle, { clientY: 100 });
		fireEvent.mouseMove(window, { clientY: 500 }); // dragged down 400px, well past the threshold
		fireEvent.mouseUp(window);
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
		fireEvent.mouseDown(handle, { clientY: 100 });
		fireEvent.mouseMove(window, { clientY: 102 }); // 2px, under the 4px threshold
		fireEvent.mouseUp(window);
		expect(onOpenChange).toHaveBeenCalledWith(true);
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
