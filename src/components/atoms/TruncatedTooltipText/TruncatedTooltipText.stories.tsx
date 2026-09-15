import React from "react";

import { StoryFn } from "@storybook/react";

import {
	ITruncatedTooltipTextProps,
	TruncatedTooltipText,
} from "./TruncatedTooltipText";

export default {
	title: "Components/Atoms/TruncatedTooltipText",
	component: TruncatedTooltipText,
	argTypes: {
		maxLines: { control: "number" },
		placement: {
			control: "select",
			options: ["top", "bottom", "left", "right"],
		},
	},
};

const Template: StoryFn<ITruncatedTooltipTextProps> = (args) => (
	<div style={{ maxWidth: 200 }}>
		<TruncatedTooltipText {...args} />
	</div>
);

export const Base = Template.bind({});
Base.args = {
	children:
		"This text is much longer than the available space, so it should be truncated with an ellipsis.",
};

export const FitsWithoutTruncation = Template.bind({});
FitsWithoutTruncation.args = { children: "Short text" };

export const MultiLine = Template.bind({});
MultiLine.args = {
	maxLines: 3,
	children:
		"This text is truncated after 3 lines instead of just one — useful for a slightly longer description in a card or a list.",
};

export const InTable = () => (
	<table style={{ width: "100%", tableLayout: "fixed" }}>
		<tbody>
			<tr>
				<td style={{ maxWidth: 120, padding: "0.5rem" }}>
					<TruncatedTooltipText>
						Very long file name that overflows the column.pdf
					</TruncatedTooltipText>
				</td>
				<td style={{ maxWidth: 120, padding: "0.5rem" }}>
					<TruncatedTooltipText>Short</TruncatedTooltipText>
				</td>
			</tr>
		</tbody>
	</table>
);
