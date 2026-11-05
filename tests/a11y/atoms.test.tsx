import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";

import {
	Badge,
	Button,
	Card,
	Checkbox,
	ColorPicker,
	CountDown,
	Divider,
	DocumentPreview,
	FlexGrid,
	FlexGridItem,
	Grid,
	InfoMessage,
	Input,
	InputErrorMessage,
	InputFile,
	Link,
	NavItem,
	NumberInput,
	Picto,
	Progress,
	Radio,
	Skeleton,
	Slider,
	Spinner,
	Td,
	TextArea,
	Th,
	TimePicker,
	Title,
	Toggle,
	TruncatedTooltipText,
} from "@components/atoms";

import { expectNoA11yViolations } from "../axe";

const noop = () => {};
const image = new File(["x"], "photo.png", { type: "image/png" });
const pdf = new File(["x"], "report.pdf", { type: "application/pdf" });

describe("axe: atoms", () => {
	const cases: [string, React.ReactElement][] = [
		["Badge", <Badge key="0">New</Badge>],
		[
			"Badge removable",
			<Badge key="0" onRemove={noop}>
				New
			</Badge>,
		],
		["Button", <Button key="0">Save</Button>],
		[
			"Button disabled",
			<Button key="0" disabled>
				Save
			</Button>,
		],
		[
			"Button loading",
			<Button key="0" isLoading>
				Save
			</Button>,
		],
		["Card", <Card key="0">Content</Card>],
		["Checkbox", <Checkbox key="0" label="Accept" />],
		["Checkbox checked", <Checkbox key="0" label="Accept" checked />],
		[
			"Checkbox indeterminate",
			<Checkbox key="0" label="Accept" indeterminate />,
		],
		["Checkbox disabled", <Checkbox key="0" label="Accept" disabled />],
		[
			"Checkbox error",
			<Checkbox key="0" label="Accept" error="Required" />,
		],
		[
			"ColorPicker",
			<ColorPicker key="0" value="#336699" onChange={noop} />,
		],
		["CountDown", <CountDown key="0" seconds={10} onEnd={noop} />],
		["Divider", <Divider key="0" />],
		["Divider labelled", <Divider key="0" label="or" />],
		["Divider vertical", <Divider key="0" orientation="vertical" />],
		["DocumentPreview image", <DocumentPreview key="0" file={image} />],
		["DocumentPreview other", <DocumentPreview key="0" file={pdf} />],
		[
			"FlexGrid",
			<FlexGrid key="0" columns={2}>
				<FlexGridItem>One</FlexGridItem>
				<div>Two</div>
			</FlexGrid>,
		],
		["Grid", <Grid key="0">Content</Grid>],
		["InfoMessage", <InfoMessage key="0">Saved</InfoMessage>],
		[
			"InfoMessage danger, dismissable",
			<InfoMessage key="0" color="danger" onClose={noop}>
				Failed
			</InfoMessage>,
		],
		["Input", <Input key="0" label="Name" />],
		["Input placeholder only", <Input key="0" placeholder="Name" />],
		[
			"Input clearable",
			<Input
				key="0"
				label="Name"
				value="Ada"
				isClearable
				onChange={noop}
			/>,
		],
		["Input disabled", <Input key="0" label="Name" disabled />],
		["Input error", <Input key="0" label="Name" error="Required" />],
		["Input required", <Input key="0" label="Name" required />],
		[
			"InputErrorMessage",
			<InputErrorMessage key="0">No</InputErrorMessage>,
		],
		["InputFile", <InputFile key="0" />],
		["InputFile sm", <InputFile key="0" size="sm" />],
		["InputFile filled", <InputFile key="0" value={image} />],
		["InputFile disabled", <InputFile key="0" disabled />],
		["InputFile error", <InputFile key="0" error="Too big" />],
		[
			"Link",
			<Link key="0" href="/docs">
				Docs
			</Link>,
		],
		[
			"Link external",
			<Link key="0" href="https://example.com" external>
				Docs
			</Link>,
		],
		[
			"Link disabled",
			<Link key="0" href="/docs" disabled>
				Docs
			</Link>,
		],
		[
			"NavItem",
			<NavItem key="0" href="/a" picto="home">
				Home
			</NavItem>,
		],
		[
			"NavItem active",
			<NavItem key="0" href="/a" isActive>
				Home
			</NavItem>,
		],
		[
			"NavItem reduced",
			<NavItem key="0" href="/a" picto="home" isReduced>
				Home
			</NavItem>,
		],
		[
			"NumberInput",
			<NumberInput key="0" label="Age" value={3} onChange={noop} />,
		],
		[
			"NumberInput disabled",
			<NumberInput
				key="0"
				label="Age"
				value={3}
				onChange={noop}
				disabled
			/>,
		],
		[
			"NumberInput error",
			<NumberInput
				key="0"
				label="Age"
				value={3}
				onChange={noop}
				error="Too low"
			/>,
		],
		["Picto", <Picto key="0" icon="home" />],
		["Picto image", <Picto key="0" src="/icon.png" />],
		[
			"Picto clickable",
			<Picto key="0" icon="home" onClick={noop} aria-label="Home" />,
		],
		["Progress", <Progress key="0" value={40} />],
		["Progress labelled", <Progress key="0" value={40} label="Upload" />],
		["Progress indeterminate", <Progress key="0" indeterminate />],
		["Radio", <Radio key="0" label="Yes" name="r" />],
		["Radio checked", <Radio key="0" label="Yes" name="r" checked />],
		["Radio disabled", <Radio key="0" label="Yes" name="r" disabled />],
		[
			"Radio error",
			<Radio key="0" label="Yes" name="r" error="Required" />,
		],
		["Skeleton", <Skeleton key="0" />],
		["Slider", <Slider key="0" label="Volume" value={3} onChange={noop} />],
		[
			"Slider aria-label",
			<Slider key="0" aria-label="Volume" value={3} onChange={noop} />,
		],
		[
			"Slider disabled",
			<Slider
				key="0"
				label="Volume"
				value={3}
				onChange={noop}
				disabled
			/>,
		],
		[
			"Slider error",
			<Slider
				key="0"
				label="Volume"
				value={3}
				onChange={noop}
				error="Too low"
			/>,
		],
		["Spinner", <Spinner key="0" />],
		[
			"Td/Th in a table",
			<div key="0" role="table" aria-label="People">
				<div role="row">
					<Th>Name</Th>
					<Th sortable sortDirection="asc" onSort={noop}>
						Age
					</Th>
				</div>
				<div role="row">
					<Td>Ada</Td>
					<Td>36</Td>
				</div>
			</div>,
		],
		["TextArea", <TextArea key="0" label="Notes" />],
		[
			"TextArea with counter",
			<TextArea key="0" label="Notes" maxLength={100} showCharCounter />,
		],
		["TextArea disabled", <TextArea key="0" label="Notes" disabled />],
		["TextArea error", <TextArea key="0" label="Notes" error="Required" />],
		[
			"TimePicker",
			<TimePicker key="0" label="Start" value="09:30" onChange={noop} />,
		],
		[
			"TimePicker unlabelled",
			<TimePicker key="0" value={null} onChange={noop} />,
		],
		[
			"TimePicker disabled",
			<TimePicker
				key="0"
				label="Start"
				value="09:30"
				onChange={noop}
				disabled
			/>,
		],
		[
			"TimePicker error",
			<TimePicker
				key="0"
				label="Start"
				value={null}
				onChange={noop}
				error="Required"
			/>,
		],
		["Title", <Title key="0">Heading</Title>],
		["Toggle", <Toggle key="0" label="Wifi" />],
		["Toggle checked", <Toggle key="0" label="Wifi" checked />],
		["Toggle disabled", <Toggle key="0" label="Wifi" disabled />],
		["Toggle error", <Toggle key="0" label="Wifi" error="Required" />],
		[
			"TruncatedTooltipText",
			<TruncatedTooltipText key="0">Long text</TruncatedTooltipText>,
		],
	];

	it.each(cases)("%s", async (_name, element) => {
		render(element);
		await expectNoA11yViolations();
	});

	it("NavItem reduced, tooltip open", async () => {
		const user = userEvent.setup();
		render(
			<NavItem href="/a" picto="home" isReduced>
				Home
			</NavItem>
		);
		await user.tab();
		await screen.findByRole("tooltip");
		await expectNoA11yViolations();
	});
});
