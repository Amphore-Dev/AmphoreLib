import React from "react";

import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DocumentPreview } from "./DocumentPreview";

describe("DocumentPreview", () => {
	beforeEach(() => {
		URL.createObjectURL = vi.fn(() => "blob:fake-url");
		URL.revokeObjectURL = vi.fn();
	});
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("renders an image thumbnail for image files", () => {
		const file = new File(["a"], "photo.png", { type: "image/png" });
		render(<DocumentPreview file={file} />);
		const img = screen.getByAltText("photo.png");
		expect(img).toHaveAttribute("src", "blob:fake-url");
	});

	it("renders a generic icon for non-image files", () => {
		const file = new File(["a"], "report.pdf", {
			type: "application/pdf",
		});
		render(<DocumentPreview file={file} />);
		expect(screen.queryByRole("img")).not.toBeInTheDocument();
		expect(screen.getByTestId("fileText")).toBeInTheDocument();
	});
});
