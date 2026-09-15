import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ConfirmModal } from "./ConfirmModal";

describe("ConfirmModal", () => {
	it("renders nothing when closed", () => {
		render(
			<ConfirmModal
				open={false}
				onClose={() => {}}
				onConfirm={() => {}}
			/>
		);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("renders the title and children when open", () => {
		render(
			<ConfirmModal
				open
				onClose={() => {}}
				onConfirm={() => {}}
				title="Supprimer ?"
			>
				Cette action est irréversible.
			</ConfirmModal>
		);
		expect(screen.getByText("Supprimer ?")).toBeInTheDocument();
		expect(
			screen.getByText("Cette action est irréversible.")
		).toBeInTheDocument();
	});

	it("shows default and custom button labels", () => {
		const { rerender } = render(
			<ConfirmModal open onClose={() => {}} onConfirm={() => {}} />
		);
		expect(
			screen.getByRole("button", { name: "Cancel" })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Confirm" })
		).toBeInTheDocument();

		rerender(
			<ConfirmModal
				open
				onClose={() => {}}
				onConfirm={() => {}}
				cancelText="Non"
				confirmText="Oui, supprimer"
			/>
		);
		expect(screen.getByRole("button", { name: "Non" })).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Oui, supprimer" })
		).toBeInTheDocument();
	});

	it("calls onClose when the cancel button is clicked and no onCancel is given", () => {
		const onClose = vi.fn();
		render(<ConfirmModal open onClose={onClose} onConfirm={() => {}} />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("calls onCancel instead of onClose when given", () => {
		const onClose = vi.fn();
		const onCancel = vi.fn();
		render(
			<ConfirmModal
				open
				onClose={onClose}
				onCancel={onCancel}
				onConfirm={() => {}}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(onClose).not.toHaveBeenCalled();
	});

	it("shows a loading state on the confirm button while onConfirm's promise is pending, and doesn't auto-close", async () => {
		const onClose = vi.fn();
		let resolvePromise: () => void;
		const onConfirm = vi.fn(
			() =>
				new Promise<void>((resolve) => {
					resolvePromise = resolve;
				})
		);
		render(<ConfirmModal open onClose={onClose} onConfirm={onConfirm} />);
		const confirmButton = screen.getByRole("button", { name: "Confirm" });
		fireEvent.click(confirmButton);

		expect(confirmButton).toBeDisabled();
		resolvePromise!();
		await waitFor(() => expect(confirmButton).not.toBeDisabled());
		expect(onClose).not.toHaveBeenCalled();
	});

	it("clears the loading state even when onConfirm rejects", async () => {
		const onConfirm = vi.fn(() => Promise.reject(new Error("fail")));
		render(<ConfirmModal open onClose={() => {}} onConfirm={onConfirm} />);
		const confirmButton = screen.getByRole("button", { name: "Confirm" });
		fireEvent.click(confirmButton);
		await waitFor(() => expect(confirmButton).not.toBeDisabled());
	});

	it("hides the header close button while confirm is loading", () => {
		const onConfirm = vi.fn(() => new Promise<void>(() => {}));
		render(
			<ConfirmModal
				open
				onClose={() => {}}
				onConfirm={onConfirm}
				title="Titre"
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
		expect(
			screen.queryByRole("button", { name: "Close" })
		).not.toBeInTheDocument();
	});

	it("ignores Escape while confirm is loading", () => {
		const onClose = vi.fn();
		const onConfirm = vi.fn(() => new Promise<void>(() => {}));
		render(<ConfirmModal open onClose={onClose} onConfirm={onConfirm} />);
		fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
		fireEvent.keyDown(document, { key: "Escape" });
		expect(onClose).not.toHaveBeenCalled();
	});

	it("disables the cancel button while confirm is loading", () => {
		const onConfirm = vi.fn(() => new Promise<void>(() => {}));
		render(<ConfirmModal open onClose={() => {}} onConfirm={onConfirm} />);
		fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
		expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
	});
});
