import React, { useState } from "react";

import {
	CountDown,
	ITextFieldProps,
	Picto,
	TextField,
} from "@components/atoms";

export interface IPasswordFieldProps extends ITextFieldProps {
	autoHide?: boolean;
	autoHideTimeout?: number; // in seconds
}

export const PasswordField: React.FC<IPasswordFieldProps> = ({
	autoHide = true,
	autoHideTimeout = 5,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const [AutoHide, setAutoHide] = useState(false);

	const clearAutoHide = () => {
		setAutoHide(false);
	};

	const launchAutoHide = () => {
		clearAutoHide();
		if (!showPassword || !autoHide) return;
		setAutoHide(true);
	};

	const toggle = () => {
		clearAutoHide();
		setShowPassword((prev) => !prev);
	};

	return (
		<TextField
			{...props}
			type={showPassword ? "text" : "password"}
			onMouseLeave={launchAutoHide}
			onBlur={launchAutoHide}
			onFocus={clearAutoHide}
			onMouseEnter={clearAutoHide}
		>
			<div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center gap-4 text-neutral-500">
				<button
					className="w-6 h-6"
					onClick={toggle}
					onMouseEnter={clearAutoHide}
					title={showPassword ? "Hide password" : "Show password"}
				>
					<Picto icon={showPassword ? "eyeOff" : "eye"} />
					{AutoHide && (
						<span className="absolute bottom-0 -right-1 text-xs text-neutral-500 p-[2px] leading-[8px] rounded-40 bg-white">
							<CountDown
								time={autoHideTimeout}
								text={(time) => time.toString()}
								handleEnd={() => {
									clearAutoHide();
									setShowPassword(false);
								}}
							/>
						</span>
					)}
				</button>
			</div>
		</TextField>
	);
};
