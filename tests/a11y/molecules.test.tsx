import React, { useEffect } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, it, vi } from "vitest";

import { Button } from "@components/atoms";
import {
	Accordion,
	AddTodoItem,
	AsyncSelect,
	BottomPanel,
	Breadcrumb,
	CheckboxFilter,
	ChipInput,
	ColorPickerField,
	ConfirmModal,
	ContextMenu,
	DatePicker,
	Dropdown,
	FilesField,
	HeadBar,
	InputSearch,
	Modal,
	NavList,
	PasswordField,
	PeriodFilter,
	Popover,
	RadioFilter,
	SectionCard,
	Select,
	SidePanel,
	SummaryList,
	SummaryListItem,
	TabPanel,
	TableHead,
	TableRow,
	Tabs,
	TimeRangeFilter,
	TodoItem,
	ToolBar,
	Tooltip,
	useContextMenu,
} from "@components/molecules";

import { expectNoA11yViolations } from "../axe";

const noop = () => {};
const options = [
	{ value: "a", label: "Alpha" },
	{ value: "b", label: "Beta", disabled: true },
	{ value: "c", label: "Gamma" },
];
const grouped = [
	{ label: "Greek", options },
	{ label: "Latin", options: [{ value: "d", label: "Delta" }] },
];
const tabs = [
	{ value: "a", label: "One" },
	{ value: "b", label: "Two", disabled: true },
];
const menuItems = [
	{ label: "Edit", onClick: noop },
	{ label: "Delete", onClick: noop, disabled: true },
];
const columns = [{ key: "name" as const, label: "Name", sortable: true }];

const stubViewport = (matches: boolean) =>
	vi.stubGlobal(
		"matchMedia",
		vi.fn(() => ({
			matches,
			addEventListener: noop,
			removeEventListener: noop,
		}))
	);

const OpenContextMenu = () => {
	const menu = useContextMenu();
	useEffect(() => {
		menu.show(
			{
				preventDefault: noop,
				clientX: 1,
				clientY: 1,
			} as unknown as React.MouseEvent,
			undefined
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return <ContextMenu menu={menu} items={menuItems} />;
};

describe("axe: molecules", () => {
	const cases: [string, React.ReactElement][] = [
		[
			"Accordion",
			<Accordion
				key="0"
				value={["a"]}
				items={[
					{ value: "a", title: "One", content: "First" },
					{ value: "b", title: "Two", content: "Second" },
					{
						value: "c",
						title: "Off",
						content: "Third",
						disabled: true,
					},
				]}
			/>,
		],
		[
			"Accordion with headings",
			<Accordion
				key="0"
				headingLevel={3}
				value={[]}
				items={[{ value: "a", title: "One", content: "First" }]}
			/>,
		],
		["AddTodoItem", <AddTodoItem key="0" onAdd={noop} />],
		[
			"AddTodoItem multiline",
			<AddTodoItem key="0" onAdd={noop} multiline />,
		],
		[
			"AsyncSelect",
			<AsyncSelect
				key="0"
				label="City"
				loadOptions={() => Promise.resolve([])}
			/>,
		],
		[
			"BottomPanel open",
			<BottomPanel key="0" open onOpenChange={noop}>
				Content
			</BottomPanel>,
		],
		[
			"BottomPanel docked",
			<BottomPanel key="0" open={false} onOpenChange={noop}>
				Content
			</BottomPanel>,
		],
		[
			"Breadcrumb",
			<Breadcrumb
				key="0"
				items={[{ label: "Home", href: "/" }, { label: "Page" }]}
			/>,
		],
		[
			"CheckboxFilter",
			<CheckboxFilter key="0" label="Colors" options={options} />,
		],
		[
			"CheckboxFilter error",
			<CheckboxFilter
				key="0"
				label="Colors"
				options={options}
				error="Pick one"
			/>,
		],
		["ChipInput", <ChipInput key="0" label="Tags" value={["a"]} />],
		[
			"ChipInput counter and invalid chip",
			<ChipInput
				key="0"
				label="Tags"
				value={["a"]}
				maxCount={3}
				validate={() => false}
			/>,
		],
		["ChipInput disabled", <ChipInput key="0" label="Tags" disabled />],
		[
			"ChipInput error",
			<ChipInput key="0" label="Tags" error="Required" />,
		],
		[
			"ColorPickerField",
			<ColorPickerField
				key="0"
				label="Color"
				value="#336699"
				onChange={noop}
			/>,
		],
		[
			"ColorPickerField swatch only",
			<ColorPickerField
				key="0"
				label="Color"
				value="#336699"
				onChange={noop}
				hideValue
			/>,
		],
		[
			"ColorPickerField error",
			<ColorPickerField
				key="0"
				label="Color"
				value="#336699"
				onChange={noop}
				error="Required"
			/>,
		],
		[
			"ConfirmModal",
			<ConfirmModal
				key="0"
				open
				title="Delete?"
				onClose={noop}
				onConfirm={noop}
			>
				Sure?
			</ConfirmModal>,
		],
		["ContextMenu open", <OpenContextMenu key="0" />],
		[
			"DatePicker",
			<DatePicker key="0" label="Date" value={null} onChange={noop} />,
		],
		[
			"DatePicker filled",
			<DatePicker
				key="0"
				label="Date"
				value={new Date(2026, 0, 5)}
				onChange={noop}
			/>,
		],
		[
			"DatePicker disabled",
			<DatePicker
				key="0"
				label="Date"
				value={null}
				onChange={noop}
				disabled
			/>,
		],
		[
			"DatePicker error",
			<DatePicker
				key="0"
				label="Date"
				value={null}
				onChange={noop}
				error="Required"
			/>,
		],
		[
			"Dropdown",
			<Dropdown key="0" items={menuItems}>
				<Button>Open</Button>
			</Dropdown>,
		],
		["FilesField", <FilesField key="0" maxFiles={2} name="docs" />],
		["HeadBar", <HeadBar key="0" onMenuClick={noop} />],
		["InputSearch", <InputSearch key="0" onChange={noop} />],
		[
			"Modal",
			<Modal key="0" open title="Title" onClose={noop}>
				Body
			</Modal>,
		],
		[
			"Modal without a title",
			<Modal key="0" open onClose={noop}>
				Body
			</Modal>,
		],
		[
			"Modal portaled",
			<Modal key="0" open title="Title" onClose={noop} portal>
				Body
			</Modal>,
		],
		[
			"NavList",
			<NavList
				key="0"
				items={[{ href: "/a", label: "Home", picto: "home" }]}
			/>,
		],
		[
			"NavList reduced",
			<NavList
				key="0"
				isReduced
				items={[{ href: "/a", label: "Home", picto: "home" }]}
			/>,
		],
		["PasswordField", <PasswordField key="0" label="Password" />],
		[
			"PasswordField error",
			<PasswordField key="0" label="Password" error="Required" />,
		],
		["PeriodFilter", <PeriodFilter key="0" />],
		[
			"PeriodFilter with range",
			<PeriodFilter key="0" range={{ value: "between" }} />,
		],
		["PeriodFilter disabled", <PeriodFilter key="0" disabled />],
		[
			"Popover",
			<Popover key="0" content="Content">
				<Button>Open</Button>
			</Popover>,
		],
		[
			"RadioFilter",
			<RadioFilter key="0" label="Color" options={options} value="a" />,
		],
		[
			"RadioFilter error",
			<RadioFilter
				key="0"
				label="Color"
				options={options}
				error="Pick one"
			/>,
		],
		[
			"SectionCard",
			<SectionCard key="0" title="Title">
				Body
			</SectionCard>,
		],
		["Select", <Select key="0" label="Fruit" options={options} />],
		[
			"Select filled, clearable",
			<Select
				key="0"
				label="Fruit"
				options={options}
				value="a"
				isClearable
			/>,
		],
		[
			"Select multiple",
			<Select
				key="0"
				label="Fruit"
				options={options}
				value={["a", "c"]}
				multiple
			/>,
		],
		[
			"Select disabled",
			<Select key="0" label="Fruit" options={options} disabled />,
		],
		[
			"Select error",
			<Select key="0" label="Fruit" options={options} error="No" />,
		],
		[
			"SummaryList",
			<SummaryList
				key="0"
				items={[
					{ label: "Name", value: "Ada" },
					{
						label: "Site",
						value: "Example",
						href: "/x",
						action: { label: "Edit", onClick: noop },
					},
				]}
			/>,
		],
		[
			"SummaryList grid",
			<SummaryList
				key="0"
				layout="grid"
				items={[{ label: "Name", value: "Ada" }]}
			/>,
		],
		[
			"SummaryListItem",
			<SummaryListItem key="0" label="Name" value="Ada" />,
		],
		[
			"TableHead and TableRow",
			<div key="0" role="table" aria-label="People">
				<TableHead columns={columns} onSort={noop} />
				<TableRow item={{ name: "Ada" }} columns={columns} />
			</div>,
		],
		[
			"Tabs with panel",
			<div key="0">
				<Tabs items={tabs} value="a" onChange={noop} />
				<TabPanel active>Panel</TabPanel>
			</div>,
		],
		[
			"Tabs tied to their panel",
			<div key="0">
				<Tabs
					aria-label="Sections"
					idPrefix="demo"
					items={tabs}
					value="a"
					onChange={noop}
				/>
				<TabPanel idPrefix="demo" value="a" active>
					Panel
				</TabPanel>
			</div>,
		],
		["TimeRangeFilter", <TimeRangeFilter key="0" />],
		[
			"TodoItem",
			<ul key="0">
				<TodoItem
					text="Buy milk"
					dragHandleProps={{ "aria-label": "Move" }}
				/>
			</ul>,
		],
		[
			"ToolBar",
			<ToolBar
				key="0"
				items={[
					{ id: "a", label: "Bold", picto: "edit" },
					{ id: "b", label: "Link", popoverContent: "Content" },
					{ id: "c", label: "Off", disabled: true },
				]}
			/>,
		],
		[
			"Tooltip",
			<Tooltip key="0" content="Hint">
				<Button>Hover</Button>
			</Tooltip>,
		],
	];

	it.each(cases)("%s", async (_name, element) => {
		render(element);
		await expectNoA11yViolations();
	});

	it("Tooltip open", async () => {
		const user = userEvent.setup();
		render(
			<Tooltip content="Hint">
				<Button>Hover</Button>
			</Tooltip>
		);
		await user.tab();
		await screen.findByRole("tooltip");
		await expectNoA11yViolations();
	});

	it("Dropdown open", async () => {
		const user = userEvent.setup();
		render(
			<Dropdown items={menuItems}>
				<Button>Open</Button>
			</Dropdown>
		);
		await user.click(screen.getByRole("button", { name: "Open" }));
		await screen.findByRole("menu");
		await expectNoA11yViolations();
	});

	it("Popover open", async () => {
		const user = userEvent.setup();
		render(
			<Popover content="Content">
				<Button>Open</Button>
			</Popover>
		);
		await user.click(screen.getByRole("button", { name: "Open" }));
		await screen.findByRole("dialog");
		await expectNoA11yViolations();
	});

	it("DatePicker calendar open", async () => {
		const user = userEvent.setup();
		render(<DatePicker label="Date" value={null} onChange={noop} />);
		await user.click(screen.getByRole("button"));
		await screen.findByRole("dialog");
		await expectNoA11yViolations();
	});

	it("ColorPickerField picker open", async () => {
		const user = userEvent.setup();
		render(
			<ColorPickerField label="Color" value="#336699" onChange={noop} />
		);
		await user.click(screen.getByRole("button"));
		await screen.findByRole("dialog");
		await expectNoA11yViolations();
	});

	it.each([
		["single", {}],
		["multiple", { multiple: true, value: ["a"] }],
		["grouped", { options: grouped }],
		["searchable", { searchable: true }],
		["searchable, no results", { searchable: true, options: [] }],
		["loading", { isLoading: true }],
	])("Select open: %s", async (_name, props) => {
		const user = userEvent.setup();
		render(<Select<string> label="Fruit" options={options} {...props} />);
		await user.click(screen.getByRole("combobox"));
		await screen.findByRole("listbox");
		await expectNoA11yViolations();
	});

	it("TodoItem editing", async () => {
		const user = userEvent.setup();
		render(
			<ul>
				<TodoItem text="Buy milk" />
			</ul>
		);
		await user.click(screen.getByRole("button", { name: "Buy milk" }));
		await screen.findByRole("textbox");
		await expectNoA11yViolations();
	});

	describe("SidePanel", () => {
		afterEach(() => {
			vi.unstubAllGlobals();
		});

		it("docked column", async () => {
			stubViewport(false);
			render(
				<SidePanel open onOpenChange={noop} title="Details">
					Body
				</SidePanel>
			);
			await expectNoA11yViolations();
		});

		it("rich title", async () => {
			stubViewport(false);
			render(
				<SidePanel open onOpenChange={noop} title={<b>Details</b>}>
					Body
				</SidePanel>
			);
			await expectNoA11yViolations();
		});

		it("mobile bottom panel", async () => {
			stubViewport(true);
			render(
				<SidePanel open onOpenChange={noop} title="Details">
					Body
				</SidePanel>
			);
			await expectNoA11yViolations();
		});

		it("mobile modal", async () => {
			stubViewport(true);
			render(
				<SidePanel
					open
					onOpenChange={noop}
					title="Details"
					mobileMode="modal"
				>
					Body
				</SidePanel>
			);
			await expectNoA11yViolations();
		});
	});
});
