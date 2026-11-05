import React, { forwardRef, useEffect, useState } from "react";

import { cn } from "@utils/cn";

import { Picto } from "../Picto/Picto";

import styles from "./DocumentPreview.module.scss";

export interface IDocumentPreviewProps extends Omit<
	React.HTMLAttributes<HTMLElement>,
	"children"
> {
	file: File;
	className?: string;
}

/**
 * V2 DocumentPreview — a minimal file preview: an image thumbnail for
 * `image/*` files, a generic file icon otherwise. No PDF page rendering —
 * out of scope for this batch, unlike v1's own (unread) implementation;
 * a consumer needing that can still pass a `customPreview` to `InputFile`.
 *
 * Native props and `ref` go to the root: the `<img>`, or the fallback `<div>`.
 */
const DocumentPreviewBase: React.ForwardRefRenderFunction<
	HTMLElement,
	IDocumentPreviewProps
> = ({ file, className = "", ...props }, ref) => {
	const [objectUrl, setObjectUrl] = useState<string | null>(null);
	const isImage = file.type?.startsWith("image/");

	useEffect(() => {
		if (!isImage) return;
		const url = URL.createObjectURL(file);
		setObjectUrl(url);
		return () => URL.revokeObjectURL(url);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the file itself changes
	}, [file]);

	if (isImage && objectUrl) {
		return (
			<img
				{...props}
				ref={ref as React.Ref<HTMLImageElement>}
				src={objectUrl}
				alt={file.name}
				className={cn([styles.image, className])}
			/>
		);
	}

	return (
		<div
			{...props}
			ref={ref as React.Ref<HTMLDivElement>}
			className={cn([styles.fallback, className])}
		>
			<Picto icon="fileText" className={styles.picto} />
		</div>
	);
};

export const DocumentPreview = forwardRef(DocumentPreviewBase);
DocumentPreview.displayName = "DocumentPreview";
