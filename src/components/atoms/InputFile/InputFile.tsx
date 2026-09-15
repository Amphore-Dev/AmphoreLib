import React, { useId, useRef, useState } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { tagFile } from "@utils/UFile";
import { cn } from "@utils/cn";

import { TLabel, TSize } from "@interfaces/index";

import { DocumentPreview } from "../DocumentPreview/DocumentPreview";
import { InputErrorMessage } from "../InputErrorMessage/InputErrorMessage";
import { Picto } from "../Picto/Picto";

import styles from "./InputFile.module.scss";

/** "vertical" stacks the preview above a footer row (name/remove) below it — good for a single, larger upload. "horizontal" is a compact row (thumbnail + name + remove side by side) — good for a list of several files. Same two values as `FilesField`'s own `orientation`, which forwards this down. */
export type TInputFileOrientation = "vertical" | "horizontal";

const matchesAccept = (file: File, accept: string): boolean => {
	if (!accept || accept === "*") return true;
	return accept
		.split(",")
		.map((token) => token.trim())
		.some((token) => {
			if (!token) return false;
			if (token.startsWith(".")) {
				return file.name.toLowerCase().endsWith(token.toLowerCase());
			}
			if (token.endsWith("/*")) {
				return file.type.startsWith(token.slice(0, -1));
			}
			return file.type === token;
		});
};

export interface IInputFileProps {
	id?: string;
	name?: string;
	/** Controlled value — the currently-selected file, or `null` for none. */
	value?: File | null;
	onChange?: (value: File | null) => void;
	/** Comma-separated list of extensions (".pdf") and/or MIME types/patterns ("image/*"). Defaults to "*" (any file). */
	accept?: string;
	/** Maximum file size, in kilo-octets. */
	maxFileSize?: number;
	size?: TSize;
	orientation?: TInputFileOrientation;
	/** Defaults to "Add a file" (or `InputFile.placeholder` from the nearest AmphoreProvider — see useAmphoreLabels). */
	placeholder?: TLabel;
	isRemovable?: boolean;
	customPreview?: (file: File) => React.ReactNode;
	onFileTypeError?: (file: File) => void;
	onMaxSizeError?: (file: File) => void;
	disabled?: boolean;
	required?: boolean;
	error?: string;
	hideError?: boolean;
	className?: string;
	wrapperClassName?: string;
	previewClassName?: string;
	/** aria-label for the remove-file (×) button. Defaults to "Remove file" (or `InputFile.removeFileLabel` from the nearest AmphoreProvider). No effect when `isRemovable` is false. */
	removeFileLabel?: TLabel;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TInputFileLabels = Pick<
	IInputFileProps,
	"placeholder" | "removeFileLabel"
>;

/**
 * V2 InputFile — controlled `File | null` atom, drag & drop, size/type
 * validation, remove button, three sizes (`size`, same `TSize`/
 * `config.defaults.size` convention as every other sized atom) crossed
 * with two layouts (`orientation`). No form-library awareness (v1's
 * equivalent wrapped `withFormikWrapper`) — bind to Formik/whatever from
 * the outside, same rule as every other field (see
 * memory/react-library-fields-audit.md).
 *
 * The name/remove row always lives in its own footer, below or beside the
 * preview — never overlaid on top of it. An earlier version put the name in
 * a gradient band absolutely-positioned over the image without clipping the
 * card (`overflow: hidden`); both the image and that band could bleed past
 * the card's rounded corners. This structure can't reproduce that: the
 * preview and the footer are two separate boxes, never overlapping.
 */
export const InputFile: React.FC<IInputFileProps> = ({
	id,
	name,
	value = null,
	onChange,
	accept = "*",
	maxFileSize,
	size: sizeProp,
	orientation = "vertical",
	placeholder: placeholderProp,
	isRemovable = true,
	customPreview,
	onFileTypeError,
	onMaxSizeError,
	disabled = false,
	required = false,
	error,
	hideError = false,
	className = "",
	wrapperClassName = "",
	previewClassName = "",
	removeFileLabel: removeFileLabelProp,
}) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const [dragIsOver, setDragIsOver] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const errorId = `${inputId}-error`;
	const { resolve } = useAmphoreLabels("InputFile");
	const placeholder = resolve("placeholder", placeholderProp);
	const removeFileLabel = resolve("removeFileLabel", removeFileLabelProp);

	const acceptFile = (file: File) => {
		if (!matchesAccept(file, accept)) {
			onFileTypeError?.(file);
			return;
		}
		if (maxFileSize !== undefined && file.size / 1024 > maxFileSize) {
			onMaxSizeError?.(file);
			return;
		}
		onChange?.(tagFile(file));
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) acceptFile(file);
		e.target.value = "";
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDragIsOver(false);
		if (disabled || value) return;
		const file = e.dataTransfer.files?.[0];
		if (file) acceptFile(file);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		if (disabled || value) return;
		setDragIsOver(e.type === "dragover" || e.type === "dragenter");
	};

	const handleRemove = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (disabled) return;
		if (inputRef.current) inputRef.current.value = "";
		onChange?.(null);
	};

	const formatSize = (bytes: number) => {
		const mb = bytes / (1024 * 1024);
		return mb >= 0.1
			? `${mb.toLocaleString("en-US", { maximumFractionDigits: 1 })} MB`
			: `${Math.max(1, Math.round(bytes / 1024))} KB`;
	};

	return (
		<div className={cn([styles.wrapper, wrapperClassName])}>
			<div
				className={cn([
					styles.card,
					dragIsOver && styles.cardDragover,
					disabled && styles.cardDisabled,
					!!error && styles.cardInvalid,
					className,
				])}
				data-orientation={orientation}
				data-size={size}
				data-filled={!!value || undefined}
				{...(!value && {
					onDragEnter: handleDragOver,
					onDragOver: handleDragOver,
					onDragLeave: handleDragOver,
					onDrop: handleDrop,
				})}
			>
				<input
					ref={inputRef}
					id={inputId}
					name={name}
					type="file"
					accept={accept}
					disabled={disabled || !!value}
					hidden
					onChange={handleInputChange}
					aria-describedby={error && !hideError ? errorId : undefined}
					data-testid="input-file"
				/>

				<label htmlFor={inputId} className={styles.label}>
					<div className={cn([styles.preview, previewClassName])}>
						{value ? (
							customPreview ? (
								customPreview(value)
							) : (
								<DocumentPreview file={value} />
							)
						) : (
							<div className={styles.placeholder}>
								<Picto
									icon="upload"
									className={styles.uploadPicto}
								/>
								{(orientation === "horizontal" ||
									size !== "sm") && (
									<span className={styles.placeholderText}>
										{placeholder}
										{required && (
											<span className={styles.required}>
												*
											</span>
										)}
									</span>
								)}
							</div>
						)}
					</div>

					{!!value && (
						<div className={styles.footer}>
							<div className={styles.info}>
								<span className={styles.fileName}>
									{value.name}
								</span>
								{orientation === "horizontal" && (
									<span className={styles.fileSize}>
										{formatSize(value.size)}
									</span>
								)}
							</div>

							{isRemovable && (
								<button
									type="button"
									className={styles.remove}
									onClick={handleRemove}
									disabled={disabled}
									aria-label={removeFileLabel}
									data-testid="input-file-remove"
								>
									<Picto icon="cross" />
								</button>
							)}
						</div>
					)}
				</label>
			</div>

			{!hideError && (
				<InputErrorMessage id={errorId}>{error}</InputErrorMessage>
			)}
		</div>
	);
};
