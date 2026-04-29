import React, { PropsWithChildren } from "react";

import { IPictoProps, Picto } from "@components/atoms/Picto/Picto";

import { cn } from "@utils/cn";

import "./Chip.scss";

export interface IChipProps extends PropsWithChildren {
	label?: string;
	disabled?: boolean;
	onDelete: () => void;
	className?: string;
	pictoClassName?: string;
	pictoProps?: IPictoProps;
}

export const Chip: React.FC<IChipProps> = ({
	label,
	disabled,
	onDelete,
	className,
	pictoClassName,
	pictoProps,
	children,
}) => {
	const classNames = cn([
		`al__chip`,
		disabled && `al__chip--disabled`,
		className,
	]);

	const pictoClassNames = cn(["al__chip--picto", pictoClassName]);

	return (
		<button className={classNames} disabled={disabled} onClick={onDelete}>
			{children || label}
			{!disabled && (
				<Picto
					icon="cross"
					className={pictoClassNames}
					{...pictoProps}
				/>
			)}
		</button>
	);
};
