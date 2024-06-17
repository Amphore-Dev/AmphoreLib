import { useState } from "react";

export const useModal = () => {
	const [isDisplayed, setIsDisplayed] = useState<boolean>(false);
	const toggle = () => setIsDisplayed(!isDisplayed);

	return {
		isDisplayed,
		setIsDisplayed,
		toggle,
	};
};
