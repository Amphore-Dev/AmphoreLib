import React, { useState } from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import type { TLabel } from "@interfaces/index";

import { CountDown } from "../CountDown/CountDown";
import { IInputProps, Input } from "../Input/Input";
import { Picto } from "../Picto/Picto";

import styles from "./PasswordField.module.scss";

export interface IPasswordFieldProps extends Omit<
	IInputProps,
	"type" | "after"
> {
	/** Auto-hides the revealed password after `autoHideSeconds` of no interaction (pointer left the field and it isn't focused). Defaults to true. */
	autoHide?: boolean;
	autoHideSeconds?: number;
	/** aria-label for the visibility toggle button while the password is shown. Defaults to "Hide password" (or `PasswordField.hidePasswordLabel` from the nearest AmphoreProvider — see useAmphoreLabels). */
	hidePasswordLabel?: TLabel;
	/** aria-label for the visibility toggle button while the password is hidden. Defaults to "Show password" (or `PasswordField.showPasswordLabel` from the nearest AmphoreProvider). */
	showPasswordLabel?: TLabel;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TPasswordFieldLabels = Pick<
	IPasswordFieldProps,
	"hidePasswordLabel" | "showPasswordLabel"
>;

/**
 * V2 PasswordField — an Input preset (visibility toggle). The
 * mouseenter/mouseleave pair that drives auto-hide is on the outer
 * wrapper div, not the `<input>` itself — otherwise moving the pointer
 * onto the toggle button (a sibling inside the same field box) would
 * fire a spurious mouseleave on the input and start the countdown while
 * the pointer is still visually over the field.
 */
export const PasswordField: React.FC<IPasswordFieldProps> = ({
	autoHide = true,
	autoHideSeconds = 5,
	onFocus,
	onBlur,
	hidePasswordLabel: hidePasswordLabelProp,
	showPasswordLabel: showPasswordLabelProp,
	...props
}) => {
	const [visible, setVisible] = useState(false);
	const [counting, setCounting] = useState(false);
	const { resolve } = useAmphoreLabels("PasswordField");
	const hidePasswordLabel = resolve(
		"hidePasswordLabel",
		hidePasswordLabelProp
	);
	const showPasswordLabel = resolve(
		"showPasswordLabel",
		showPasswordLabelProp
	);

	const stopCountdown = () => setCounting(false);
	const startCountdown = () => {
		if (visible && autoHide) setCounting(true);
	};

	const toggle = () => {
		stopCountdown();
		setVisible((v) => !v);
	};

	return (
		<div onMouseEnter={stopCountdown} onMouseLeave={startCountdown}>
			<Input
				{...props}
				type={visible ? "text" : "password"}
				onFocus={(e) => {
					stopCountdown();
					onFocus?.(e);
				}}
				onBlur={(e) => {
					startCountdown();
					onBlur?.(e);
				}}
				after={
					<button
						type="button"
						className={styles.toggle}
						onClick={toggle}
						aria-label={
							visible ? hidePasswordLabel : showPasswordLabel
						}
					>
						<Picto icon={visible ? "eyeOff" : "eye"} />
						{counting && (
							<span className={styles.countdown}>
								<CountDown
									seconds={autoHideSeconds}
									text={(n) => String(n)}
									onEnd={() => {
										stopCountdown();
										setVisible(false);
									}}
								/>
							</span>
						)}
					</button>
				}
			/>
		</div>
	);
};
