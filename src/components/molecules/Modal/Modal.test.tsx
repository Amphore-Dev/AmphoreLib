import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "./Modal";

describe("Modal", () => {
	it("renders nothing when closed", () => {
		render(
			<Modal open={false} onClose={() => {}} title="Titre">
				Contenu
			</Modal>
		);
		expect(screen.queryByText("Contenu")).not.toBeInTheDocument();
	});

	it("renders its content, title and footer when open", () => {
		render(
			<Modal
				open
				onClose={() => {}}
				title="Confirmation"
				footer={<button type="button">Valider</button>}
			>
				Êtes-vous sûr ?
			</Modal>
		);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByText("Confirmation")).toBeInTheDocument();
		expect(screen.getByText("Êtes-vous sûr ?")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Valider" })
		).toBeInTheDocument();
	});

	it("calls onClose when the header close button is clicked", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Modal open onClose={onClose} title="Titre">
				Contenu
			</Modal>
		);
		await user.click(screen.getByRole("button", { name: "Close" }));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("hides the close button when hideCloseButton is true", () => {
		render(
			<Modal open onClose={() => {}} title="Titre" hideCloseButton>
				Contenu
			</Modal>
		);
		expect(
			screen.queryByRole("button", { name: "Close" })
		).not.toBeInTheDocument();
	});

	it("calls onClose on Escape when closeOnEscape is true (default)", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Modal open onClose={onClose} title="Titre">
				Contenu
			</Modal>
		);
		await user.keyboard("{Escape}");
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("does not call onClose on Escape when closeOnEscape is false", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Modal open onClose={onClose} title="Titre" closeOnEscape={false}>
				Contenu
			</Modal>
		);
		await user.keyboard("{Escape}");
		expect(onClose).not.toHaveBeenCalled();
	});

	it("has role=dialog with aria-labelledby pointing to the title", () => {
		render(
			<Modal open onClose={() => {}} title="Mon titre">
				Contenu
			</Modal>
		);
		const dialog = screen.getByRole("dialog");
		const titleId = dialog.getAttribute("aria-labelledby");
		expect(titleId).toBeTruthy();
		expect(document.getElementById(titleId as string)).toHaveTextContent(
			"Mon titre"
		);
	});
});
