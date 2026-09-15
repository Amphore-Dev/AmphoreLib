import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HeadBar } from "./HeadBar";

describe("HeadBar", () => {
	it("renders left and right content", () => {
		render(
			<HeadBar
				leftContent={<span>Logo</span>}
				rightContent={<span>Avatar</span>}
			/>
		);
		expect(screen.getByText("Logo")).toBeInTheDocument();
		expect(screen.getByText("Avatar")).toBeInTheDocument();
	});

	it("doesn't show a menu button by default", () => {
		render(<HeadBar leftContent="Logo" />);
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("shows a menu button when onMenuClick is given, and calls it on click", () => {
		const onMenuClick = vi.fn();
		render(<HeadBar onMenuClick={onMenuClick} />);
		fireEvent.click(screen.getByRole("button", { name: "Menu" }));
		expect(onMenuClick).toHaveBeenCalledTimes(1);
	});

	it("uses a custom menuLabel", () => {
		render(<HeadBar onMenuClick={() => {}} menuLabel="Ouvrir le menu" />);
		expect(
			screen.getByRole("button", { name: "Ouvrir le menu" })
		).toBeInTheDocument();
	});

	it("forwards a custom className", () => {
		const { container } = render(<HeadBar className="custom" />);
		expect(container.firstChild).toHaveClass("custom");
	});
});
