import { cn } from "@utils/cn";
import React, { useRef, useState, ChangeEvent, FC } from "react";

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
				"relative inline-flex items-center cursor-pointer",
				className,
			])}
		>
			<input
				type="checkbox"
				checked={isChecked}
				onChange={handleOnChange}
				name={name}
				disabled={disabled}
				className="sr-only peer unstyled"
				data-unstyled
				ref={inputRef}
			/>
			<div
				className={cn([
					states
						? "w-fit h-6 after:right-[calc(100%-1.4rem)] peer-checked:after:right-[1.4rem] after:h-5 after:w-5"
						: "min-w-[2.5rem] w-10 h-5 after:start-[2px] peer-checked:after:start-[6px] after:h-4 after:w-4",
					"relative bg-gray-200 rounded-3xl peer peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-primary-500 after:content-[''] after:absolute after:top-0.5  after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all dark:border-gray-600 peer-checked:bg-primary-500",
					disabled && "opacity-50 cursor-not-allowed",
				])}
			>
				{states && (
					<div className="items-center gap-2 row mt-[1px] font-bold">
						<span
							className={cn([
								"text-white ml-3 duration-300",
								isChecked ? "opacity-100" : "opacity-0",
							])}
						>
							YES
						</span>
						<span
							className={cn([
								"mr-3 duration-300 text-neutral-500",
								!isChecked ? "opacity-100 " : "opacity-0",
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
						"text-sm font-medium text-gray-900 ms-3 dark:text-gray-300",
						disabled && "opacity-70 cursor-not-allowed",
					])}
				>
					{label}
				</span>
			)}
		</label>
	);
};
