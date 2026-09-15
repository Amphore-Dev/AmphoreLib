import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";

// Vite-specific `?url` import. This is only a *fallback* — see the guard
// below — because it's unreliable here specifically: a library build
// (this lib's own `vite build --lib`) has no fixed "site root" to resolve
// a worker asset against, so Vite inlines it as a `data:` URI instead of
// emitting a real file. A worker script loaded from `data:` can't resolve
// its own internal dynamic import and fails at runtime. A consumer's own
// app-mode Vite build resolves this same `?url` import correctly, which is
// exactly why the guard below lets a consumer's own value win.
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { cn } from "@utils/cn";

import type { TLabel } from "@interfaces/index";

import { InfoMessage } from "../../atoms/InfoMessage/InfoMessage";
import { Picto } from "../../atoms/Picto/Picto";
import { Spinner } from "../../atoms/Spinner/Spinner";

import styles from "./FileViewer.module.scss";

// `react-pdf` and `pdfjs-dist` are peer dependencies (optional — only a
// consumer that actually renders a PDF through this component needs them
// installed) and a multi-hundred-KB dependency besides, so this stays
// lazy: no other code-splitting boundary would keep it out of the main
// bundle otherwise. Vite/Rollup emits it as its own chunk, fetched only
// the first time a `FileViewer` actually renders a PDF.
let workerConfigured = false;
const PdfDocument = lazy(() =>
	import("react-pdf").then((mod) => {
		if (!workerConfigured) {
			// Respect a worker src the consumer's own app already set (see
			// this file's own comment above `pdfWorkerSrc` for why) —
			// `pdfWorkerSrc` is only a fallback for a consumer that hasn't
			// configured one.
			if (!mod.pdfjs.GlobalWorkerOptions.workerSrc) {
				mod.pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
			}
			workerConfigured = true;
		}
		return { default: mod.Document };
	})
);
const PdfPage = lazy(() =>
	import("react-pdf").then((mod) => ({ default: mod.Page }))
);

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

export type TFileViewerType = "image" | "pdf";

export interface IFileViewerProps {
	/** A local, not-yet-uploaded file, or the URL of one already hosted somewhere. Type is always auto-detected — see `inferType` — never a prop to set by hand. */
	src: File | string;
	/** Used as the downloaded filename, and in the "unsupported format" message. Inferred from `src.name` for a `File`, from the last path segment for a URL. */
	name?: string;
	/** All user-facing strings — a prop per string, defaulting to English (or `FileViewer.<key>` from the nearest AmphoreProvider — see useAmphoreLabels), no commonKey for any of them (each is a compound phrase, not one of the bare action verbs in `common`). */
	zoomOutLabel?: TLabel;
	zoomInLabel?: TLabel;
	resetZoomLabel?: TLabel;
	previousPageLabel?: TLabel;
	nextPageLabel?: TLabel;
	downloadLabel?: TLabel;
	loadingLabel?: TLabel;
	pdfErrorLabel?: TLabel;
	unsupportedFormatLabel?: TLabel;
	previewAltLabel?: TLabel;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TFileViewerLabels = Pick<
	IFileViewerProps,
	| "zoomOutLabel"
	| "zoomInLabel"
	| "resetZoomLabel"
	| "previousPageLabel"
	| "nextPageLabel"
	| "downloadLabel"
	| "loadingLabel"
	| "pdfErrorLabel"
	| "unsupportedFormatLabel"
	| "previewAltLabel"
>;

const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i;
const PDF_EXTENSION = /\.pdf$/i;

// `typeof src === "string"` rather than `src instanceof File`: a File
// picked through Storybook's own file control (or any control rendered
// across an iframe boundary) is a real File, just constructed against a
// *different* window's `File` — `instanceof` compares constructor
// identity, not shape, and fails across realms even though the object
// works fine everywhere else (reading `.type`/`.name`, `URL.createObjectURL`,
// ...). Duck-typing on "is it a string" side-steps that entirely.
const isFileLike = (src: File | string): src is File => typeof src !== "string";

/**
 * A `File`'s own `type` is trustworthy (the browser read it from the file
 * itself). A bare URL has no such thing — there's no MIME sniffing without
 * actually fetching it, which this component doesn't do — so it falls
 * back to the extension in the last path segment (query string/hash
 * stripped first), same convention as `resolvedName` below.
 */
const inferType = (src: File | string): TFileViewerType | undefined => {
	if (isFileLike(src)) {
		if (src.type.startsWith("image/")) return "image";
		if (src.type === "application/pdf") return "pdf";
		return undefined;
	}
	const path = src.split(/[?#]/)[0];
	if (IMAGE_EXTENSIONS.test(path)) return "image";
	if (PDF_EXTENSION.test(path)) return "pdf";
	return undefined;
};

/**
 * V2 FileViewer — a standalone image/PDF preview with its own zoom + page
 * toolbar. Deliberately not wrapped in a Modal/SidePanel itself and never
 * portals (see memory/amphorelib-v2-conventions.md) — a consumer opening
 * this inside one of those (or full-page, or inline) is their call, made
 * once outside, not baked in here.
 *
 * PDF rendering is `react-pdf` (a peer dependency — no dep-free way to
 * decode/paint a PDF), loaded lazily (see above). Text/annotation layers
 * are off: this is a viewer with its own toolbar, not a document a user
 * selects text out of, and skipping them avoids importing react-pdf's
 * extra layer CSS entirely.
 *
 * To render a PDF, install `pdfjs-dist` + `react-pdf` yourself and, before
 * this component's first render, set `pdfjs.GlobalWorkerOptions.workerSrc`
 * to your own bundler-resolved worker URL (e.g. Vite: `import workerSrc
 * from "pdfjs-dist/build/pdf.worker.min.mjs?url"`). This component only
 * falls back to its own bundled worker path when you haven't — that
 * fallback is best-effort and can fail depending on your bundler.
 */
export const FileViewer: React.FC<IFileViewerProps> = ({
	src,
	name,
	zoomOutLabel: zoomOutLabelProp,
	zoomInLabel: zoomInLabelProp,
	resetZoomLabel: resetZoomLabelProp,
	previousPageLabel: previousPageLabelProp,
	nextPageLabel: nextPageLabelProp,
	downloadLabel: downloadLabelProp,
	loadingLabel: loadingLabelProp,
	pdfErrorLabel: pdfErrorLabelProp,
	unsupportedFormatLabel: unsupportedFormatLabelProp,
	previewAltLabel: previewAltLabelProp,
	className = "",
}) => {
	const { resolve } = useAmphoreLabels("FileViewer");
	const zoomOutLabel = resolve("zoomOutLabel", zoomOutLabelProp);
	const zoomInLabel = resolve("zoomInLabel", zoomInLabelProp);
	const resetZoomLabel = resolve("resetZoomLabel", resetZoomLabelProp);
	const previousPageLabel = resolve(
		"previousPageLabel",
		previousPageLabelProp
	);
	const nextPageLabel = resolve("nextPageLabel", nextPageLabelProp);
	const downloadLabel = resolve("downloadLabel", downloadLabelProp);
	const loadingLabel = resolve("loadingLabel", loadingLabelProp);
	const pdfErrorLabel = resolve("pdfErrorLabel", pdfErrorLabelProp);
	const unsupportedFormatLabel = resolve(
		"unsupportedFormatLabel",
		unsupportedFormatLabelProp
	);
	const previewAltLabel = resolve("previewAltLabel", previewAltLabelProp);

	const resolvedType = inferType(src);
	const resolvedName =
		name ??
		(isFileLike(src)
			? src.name
			: decodeURIComponent(src.split(/[?#]/)[0].split("/").pop() || "") ||
				undefined);

	const [objectUrl, setObjectUrl] = useState<string | null>(null);
	useEffect(() => {
		if (!isFileLike(src)) return;
		const url = URL.createObjectURL(src);
		setObjectUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [src]);
	const resolvedUrl = isFileLike(src) ? objectUrl : src;

	const [scale, setScale] = useState(1);
	const [page, setPage] = useState(1);
	const [numPages, setNumPages] = useState<number | null>(null);
	const [pdfError, setPdfError] = useState(false);

	// A new source starts back at page 1 / full zoom, not wherever the
	// previous file was left. `pdfError` is deliberately NOT reset here —
	// react-pdf's `Document` re-fires onLoadSuccess/onLoadError whenever
	// `file` changes, and effects run child-before-parent on the same
	// commit, so a blind reset here would run *after* — and clobber — an
	// onLoadError that fired for this very src on the same mount.
	useEffect(() => {
		setScale(1);
		setPage(1);
		setNumPages(null);
	}, [src]);

	const zoomPercent = useMemo(() => Math.round(scale * 100), [scale]);

	return (
		<div className={cn([styles.viewer, className])}>
			<div className={styles.toolbar}>
				<div className={styles.group}>
					<button
						type="button"
						className={styles.toolButton}
						onClick={() =>
							setScale((s) => Math.max(MIN_SCALE, s - SCALE_STEP))
						}
						disabled={pdfError || scale <= MIN_SCALE}
						aria-label={zoomOutLabel}
					>
						<Picto icon="zoomOut" className={styles.toolIcon} />
					</button>
					<button
						type="button"
						className={cn([styles.zoomValue, styles.zoomReset])}
						onClick={() => setScale(1)}
						disabled={pdfError || scale === 1}
						aria-label={resetZoomLabel}
					>
						{zoomPercent}%
					</button>
					<button
						type="button"
						className={styles.toolButton}
						onClick={() =>
							setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP))
						}
						disabled={pdfError || scale >= MAX_SCALE}
						aria-label={zoomInLabel}
					>
						<Picto icon="zoomIn" className={styles.toolIcon} />
					</button>
				</div>

				{resolvedType === "pdf" && !!numPages && (
					<div className={styles.group}>
						<button
							type="button"
							className={styles.toolButton}
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page <= 1}
							aria-label={previousPageLabel}
						>
							<Picto
								icon="chevron"
								rotation={180}
								className={styles.toolIcon}
							/>
						</button>
						<span className={styles.zoomValue}>
							{page} / {numPages}
						</span>
						<button
							type="button"
							className={styles.toolButton}
							onClick={() =>
								setPage((p) => Math.min(numPages, p + 1))
							}
							disabled={page >= numPages}
							aria-label={nextPageLabel}
						>
							<Picto icon="chevron" className={styles.toolIcon} />
						</button>
					</div>
				)}

				{!!resolvedUrl && (
					<a
						className={styles.download}
						href={resolvedUrl}
						download={resolvedName ?? true}
						aria-label={downloadLabel}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Picto icon="download" className={styles.toolIcon} />
						{downloadLabel}
					</a>
				)}
			</div>

			<div className={styles.viewport}>
				{resolvedType === "image" && resolvedUrl && (
					<img
						src={resolvedUrl}
						alt={resolvedName ?? previewAltLabel}
						className={styles.image}
						style={{ transform: `scale(${scale})` }}
					/>
				)}

				{resolvedType === "pdf" && resolvedUrl && (
					<Suspense fallback={<Spinner label={loadingLabel} />}>
						<PdfDocument
							file={resolvedUrl}
							onLoadSuccess={({
								numPages: n,
							}: {
								numPages: number;
							}) => {
								setNumPages(n);
								setPdfError(false);
							}}
							onLoadError={() => setPdfError(true)}
							loading={<Spinner label={loadingLabel} />}
							error={
								<InfoMessage color="danger">
									{pdfErrorLabel}
								</InfoMessage>
							}
						>
							<PdfPage
								pageNumber={page}
								scale={scale}
								renderTextLayer={false}
								renderAnnotationLayer={false}
							/>
						</PdfDocument>
					</Suspense>
				)}

				{!resolvedType && (
					<InfoMessage color="warning">
						{resolvedName
							? `${unsupportedFormatLabel}: ${resolvedName}`
							: `${unsupportedFormatLabel}.`}
					</InfoMessage>
				)}
			</div>
		</div>
	);
};
