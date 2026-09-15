import React from "react";

import { FlexGrid } from "@components/atoms";
import {
	IInputFileProps,
	InputFile,
} from "@components/atoms/InputFile/InputFile";

export interface IFilesFieldProps extends Omit<
	IInputFileProps,
	"value" | "onChange"
> {
	/** Controlled value — one entry per slot, up to `maxFiles`. */
	value?: (File | null)[];
	onChange?: (value: (File | null)[]) => void;
	/** Number of file slots. Defaults to 1 (a single `InputFile`). */
	maxFiles?: number;
	columns?: number;
	minItemWidth?: string;
	gap?: string;
}

/**
 * V2 FilesField — a grid of `maxFiles` `InputFile` slots sharing one
 * controlled `(File | null)[]`. Fully controlled like every other field —
 * v1's version instead named each slot `${name}[${index}]` and relied on
 * Formik to hold the array; dropped, `FieldRenderer` does that binding now.
 *
 * `orientation` does double duty: it picks the outer FlexGrid's column count
 * (as before) *and* is forwarded to every `InputFile` slot, so "horizontal"
 * gives a compact row of horizontal-layout cards and "vertical" a column of
 * stacked ones — the two stay visually consistent instead of only the grid
 * arrangement changing.
 */
export const FilesField: React.FC<IFilesFieldProps> = ({
	value = [],
	onChange,
	maxFiles = 1,
	orientation = "horizontal",
	columns,
	minItemWidth,
	gap = "0.5rem",
	...inputFileProps
}) => {
	const computedColumns =
		orientation === "horizontal" ? columns || Math.min(maxFiles, 3) : 1;

	const handleSlotChange = (index: number, file: File | null) => {
		const next = [...value];
		next[index] = file;
		onChange?.(next);
	};

	return (
		<FlexGrid
			columns={computedColumns}
			gap={gap}
			minItemWidth={minItemWidth || "150px"}
		>
			{Array.from({ length: maxFiles }, (_, index) => (
				<InputFile
					key={index}
					{...inputFileProps}
					orientation={orientation}
					name={
						maxFiles > 1
							? `${inputFileProps.name}[${index}]`
							: inputFileProps.name
					}
					value={value[index] ?? null}
					onChange={(file) => handleSlotChange(index, file)}
				/>
			))}
		</FlexGrid>
	);
};
