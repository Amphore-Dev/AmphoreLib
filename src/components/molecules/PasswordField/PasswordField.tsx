import React, { useState } from "react";

import { CountDown, Picto } from "../../atoms";
import { ITextFieldProps, TextField } from "../TextField/TextField";

import "./PasswordField.scss";

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
			<div className="al__password-field__actions">
				<button
					className="al__password-field__toggle"
					onClick={toggle}
					onMouseEnter={clearAutoHide}
					title={showPassword ? "Hide password" : "Show password"}
					type="button"
				>
					<Picto
						icon={showPassword ? "eyeOff" : "eye"}
						className="al__password-field__toggle-icon"
					/>
					{AutoHide && (
						<span className="al__password-field__countdown">
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
