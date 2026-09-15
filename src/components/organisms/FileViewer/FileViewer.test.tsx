import React, { useEffect, useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FileViewer } from "./FileViewer";

// react-pdf needs a real canvas/worker to actually decode a PDF — out of
// scope for a unit test of this component's own toolbar wiring (zoom,
// page nav). Stubbed so `onLoadSuccess` fires synchronously with a known
// page count, same spirit as mocking a network call.
vi.mock("react-pdf", () => ({
	Document: ({
		children,
		file,
		error,
		onLoadSuccess,
		onLoadError,
	}: {
		children: React.ReactNode;
		file: string;
		error?: React.ReactNode;
		onLoadSuccess?: (doc: { numPages: number }) => void;
		onLoadError?: () => void;
	}) => {
		const [failed, setFailed] = useState(false);
		useEffect(() => {
			// "broken" in the source is this suite's own signal to simulate a
			// failed load instead of a successful one — there's no real PDF
			// parsing happening here to fail on its own.
			if (file.includes("broken")) {
				setFailed(true);
				onLoadError?.();
			} else {
				onLoadSuccess?.({ numPages: 3 });
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps -- stub fires once per mount, mirroring a real load
		}, []);
		if (failed) return <div data-testid="pdf-document">{error}</div>;
		return <div data-testid="pdf-document">{children}</div>;
	},
	Page: ({ pageNumber, scale }: { pageNumber: number; scale: number }) => (
		<div data-testid="pdf-page">
			page {pageNumber} at {scale}x
		</div>
	),
	pdfjs: { GlobalWorkerOptions: {} },
}));

describe("FileViewer", () => {
	beforeEach(() => {
		URL.createObjectURL = vi.fn(() => "blob:fake-url");
		URL.revokeObjectURL = vi.fn();
	});
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("renders an image for an image File, inferring the type", () => {
		const file = new File(["a"], "photo.png", { type: "image/png" });
		render(<FileViewer src={file} />);
		expect(screen.getByAltText("photo.png")).toHaveAttribute(
			"src",
			"blob:fake-url"
		);
	});

	it("treats a File-shaped object from a different realm as a File, not a URL", () => {
		// Storybook's own file control (and any control rendered across an
		// iframe boundary) hands back a real File constructed against a
		// *different* window's `File` — `instanceof File` fails for that
		// even though the object is otherwise perfectly usable. Simulated
		// here with a plain object of the same shape, no real File involved.
		const crossRealmFile = {
			type: "image/png",
			name: "cross-realm.png",
		} as File;
		render(<FileViewer src={crossRealmFile} />);
		expect(screen.getByAltText("cross-realm.png")).toHaveAttribute(
			"src",
			"blob:fake-url"
		);
	});

	it("renders a pdf viewer for a pdf File", async () => {
		const file = new File(["a"], "report.pdf", {
			type: "application/pdf",
		});
		render(<FileViewer src={file} />);
		// Document/Page load lazily (react-pdf is code-split out of the main
		// bundle — see FileViewer.tsx) — the mocked module still resolves
		// asynchronously through the same dynamic `import()`.
		expect(await screen.findByTestId("pdf-document")).toBeInTheDocument();
		expect(screen.getByText("page 1 at 1x")).toBeInTheDocument();
	});

	it("infers the type from a URL's extension, since there's no File.type to read", async () => {
		render(<FileViewer src="https://example.com/documents/rapport.pdf" />);
		expect(await screen.findByTestId("pdf-document")).toBeInTheDocument();
	});

	it("ignores the query string when reading a URL's extension", async () => {
		render(
			<FileViewer src="https://example.com/rapport.pdf?token=abc&v=2" />
		);
		expect(await screen.findByTestId("pdf-document")).toBeInTheDocument();
	});

	it("shows an unsupported-format message naming the file, inferred from the URL's last path segment", () => {
		render(<FileViewer src="https://example.com/files/archive.zip" />);
		expect(
			screen.getByText("Unsupported format: archive.zip")
		).toBeInTheDocument();
	});

	it("renders every page stacked by default (continuous), the counter starting at 1", async () => {
		const file = new File(["a"], "report.pdf", {
			type: "application/pdf",
		});
		render(<FileViewer src={file} />);
		expect(await screen.findByText("1 / 3")).toBeInTheDocument();
		expect(screen.getAllByTestId("pdf-page")).toHaveLength(3);
		expect(screen.getByText("page 3 at 1x")).toBeInTheDocument();
	});

	it("with continuous={false}, shows page navigation only once the pdf has loaded, and steps through pages one at a time", async () => {
		const file = new File(["a"], "report.pdf", {
			type: "application/pdf",
		});
		render(<FileViewer src={file} continuous={false} />);
		expect(await screen.findByText("1 / 3")).toBeInTheDocument();
		expect(screen.getAllByTestId("pdf-page")).toHaveLength(1);
		fireEvent.click(screen.getByRole("button", { name: "Next page" }));
		expect(screen.getByText("page 2 at 1x")).toBeInTheDocument();
		expect(screen.queryByText("page 1 at 1x")).not.toBeInTheDocument();
	});

	it("zooms in and out within bounds", () => {
		const file = new File(["a"], "photo.png", { type: "image/png" });
		render(<FileViewer src={file} />);
		expect(screen.getByText("100%")).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
		expect(screen.getByText("125%")).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: "Zoom out" }));
		expect(screen.getByText("100%")).toBeInTheDocument();
	});

	it("offers a download link pointing at the resolved source", () => {
		const file = new File(["a"], "photo.png", { type: "image/png" });
		render(<FileViewer src={file} name="photo.png" />);
		expect(screen.getByText("Download").closest("a")).toHaveAttribute(
			"href",
			"blob:fake-url"
		);
	});

	it("resets the zoom to 100% when the percentage itself is clicked", () => {
		const file = new File(["a"], "photo.png", { type: "image/png" });
		render(<FileViewer src={file} />);
		fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
		fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
		expect(screen.getByText("150%")).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: "Reset zoom" }));
		expect(screen.getByText("100%")).toBeInTheDocument();
	});

	it("disables the reset-zoom button once already at 100%", () => {
		const file = new File(["a"], "photo.png", { type: "image/png" });
		render(<FileViewer src={file} />);
		expect(
			screen.getByRole("button", { name: "Reset zoom" })
		).toBeDisabled();
	});

	it("disables the zoom toolbar once the pdf fails to load", async () => {
		render(<FileViewer src="https://example.com/broken.pdf" />);
		expect(
			await screen.findByText("Unable to display this PDF.")
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Zoom out" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Zoom in" })).toBeDisabled();
		expect(
			screen.getByRole("button", { name: "Reset zoom" })
		).toBeDisabled();
	});

	it("overrides every label via props, with no global i18n slot involved", () => {
		render(
			<FileViewer
				src="https://example.com/files/archive.zip"
				zoomOutLabel="Zoom out"
				zoomInLabel="Zoom in"
				resetZoomLabel="Reset zoom"
				downloadLabel="Download"
				unsupportedFormatLabel="Unsupported format"
			/>
		);
		expect(
			screen.getByRole("button", { name: "Zoom out" })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Zoom in" })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Reset zoom" })
		).toBeInTheDocument();
		expect(screen.getByText("Download")).toBeInTheDocument();
		expect(
			screen.getByText("Unsupported format: archive.zip")
		).toBeInTheDocument();
	});
});
