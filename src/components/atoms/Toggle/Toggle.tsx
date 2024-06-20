import React, { useRef, useState, ChangeEvent, FC } from "react";

import { cn } from "@utils/cn";

export interface IToggleProps {
	checked?: boolean;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	name?: string;
	label?: string | React.ReactNode;
	disabled?: boolean;
	states?: boolean;
	className?: string;
}

export const Toggle: FC<IToggleProps> = ({
	checked,
	onChange,
	name,
	label,
	disabled,
	states,
	className,
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [, setLastUpdate] = useState<number>(0);

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;

		setLastUpdate(Date.now());
		onChange?.(e);
	};

	const isChecked = checked ?? inputRef.current?.checked ?? false;

	return (
		<label
			className={cn([
				"relative inline-flex cursor-pointer items-center",
				className,
			])}
		>
			<input
				type="checkbox"
				checked={isChecked}
				onChange={handleOnChange}
				name={name}
				disabled={disabled}
				className="unstyled peer sr-only"
				data-unstyled
				ref={inputRef}
			/>
			<div
				className={cn([
					states
						? "h-6 w-fit after:right-[calc(100%-1.4rem)] after:h-5 after:w-5 peer-checked:after:right-[1.4rem]"
						: "h-5 w-10 min-w-[2.5rem] after:start-[2px] after:h-4 after:w-4 peer-checked:after:start-[6px]",
					"peer relative rounded-3xl bg-gray-200 after:absolute after:top-0.5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-checked:after:border-primary-500 peer-focus:ring-4 peer-focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-primary-800 rtl:peer-checked:after:-translate-x-full",
					disabled && "cursor-not-allowed opacity-50",
				])}
			>
				{states && (
					<div className="row mt-[1px] items-center gap-2 font-bold">
						<span
							className={cn([
								"ml-3 text-white duration-300",
								isChecked ? "opacity-100" : "opacity-0",
							])}
						>
							YES
						</span>
						<span
							className={cn([
								"mr-3 text-neutral-500 duration-300",
								!isChecked ? "opacity-100" : "opacity-0",
							])}
						>
							NO
						</span>
					</div>
				)}
			</div>
			{!!label && (
				<span
					className={cn([
						"ms-3 text-sm font-medium text-gray-900 dark:text-gray-300",
						disabled && "cursor-not-allowed opacity-70",
					])}
				>
					{label}
				</span>
			)}
		</label>
	);
};
