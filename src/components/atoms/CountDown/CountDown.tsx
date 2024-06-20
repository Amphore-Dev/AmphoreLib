import React, { useEffect } from "react";

import { t } from "i18next";

export interface ICountDownProps {
	time?: number;
	text?: string | ((time: number) => string);
	handleEnd: () => void;
}

export const CountDown: React.FC<ICountDownProps> = ({
	time,
	text,
	handleEnd,
}) => {
	const [Time, setTime] = React.useState(time ?? 15);

	useEffect(() => {
		setTime(time ?? 15);
	}, [time]);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		if (Time > 0) {
			intervalId = setInterval(() => {
				if (Time === 1) {
					setTimeout(() => {
						handleEnd();
					}, 10);
				}
				setTime((time) => time - 1);
			}, 1000);
		}

		return () => {
			clearInterval(intervalId);
		};
	}, [Time, handleEnd]);

	const generateText = () => {
		if (typeof text === "string")
			return text.replace("{time}", Time.toString());
		if (typeof text === "function") return text(Time);
		return t("countdown.seconds", { count: Time });
	};

	return generateText();
};
