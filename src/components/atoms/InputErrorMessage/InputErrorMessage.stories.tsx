import React from "react";

import { InputErrorMessage } from "./InputErrorMessage";

export default {
	title: "Components/Atoms/InputErrorMessage",
	component: InputErrorMessage,
};

export const Base = () => (
	<InputErrorMessage>This field is required.</InputErrorMessage>
);

export const Empty = () => (
	<div style={{ fontSize: 12, opacity: 0.6 }}>
		(nothing to show, empty children)
		<InputErrorMessage />
	</div>
);
