import React, { useEffect, useRef, useState } from "react";

import { cn } from "@utils/cn";

import styles from "./CountDown.module.scss";

export interface ICountDownProps {
	/** Starting value, in seconds. Defaults to 15. Resets the countdown when changed. */
	seconds?: number;
	/** Rendered text. A string with a "{time}" placeholder, or a function given the seconds left. Defaults to "{time} s". */
	text?: string | ((secondsLeft: number) => string);
	/** Called once, when the countdown reaches 0. */
	onEnd: () => void;
	className?: string;
}

/**
 * V2 CountDown — v1's version used `setInterval` re-created every tick
 * (its effect depended on the ticking value itself) and pulled in i18next
 * for its default text; this one chains a single `setTimeout` per second
 * via a `secondsLeft` effect dependency (no repeated interval churn), and
 * `onEnd` is read from a ref so its identity changing doesn't restart the
 * countdown. No i18next — this lib's UI strings are French-only, plain
 * template text instead.
 */
export const CountDown: React.FC<ICountDownProps> = ({
	seconds = 15,
	text,
	onEnd,
	className = "",
}) => {
	const [secondsLeft, setSecondsLeft] = useState(seconds);
	const onEndRef = useRef(onEnd);
	onEndRef.current = onEnd;

	useEffect(() => {
		setSecondsLeft(seconds);
	}, [seconds]);

	useEffect(() => {
		if (secondsLeft <= 0) {
			onEndRef.current();
			return;
		}
		const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
		return () => clearTimeout(id);
	}, [secondsLeft]);

	const label =
		typeof text === "function"
			? text(secondsLeft)
			: (text ?? "{time} s").replace("{time}", String(secondsLeft));

	return <span className={cn([styles.countdown, className])}>{label}</span>;
};
