import React from "react";

import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { Formik } from "formik";
import { describe, expect, it, vi } from "vitest";

import type { TField } from "@interfaces/index";

import {
	INativePropsCase,
	expectNativeProps,
} from "../../tests/expectNativeProps";

import * as atoms from "./atoms";
import * as molecules from "./molecules";
import { useContextMenu } from "./molecules";
import * as organisms from "./organisms";
import * as templates from "./templates";

const {
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
} = atoms;
const {
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
} = molecules;
const {
	ActiveFilters,
	EditableCard,
	FieldRenderer,
	FileViewer,
	FiltersModal,
	FormRenderer,
	FormRendererWithFormik,
	Table,
	TodoList,
	Tour,
} = organisms;
const { PageHeader } = templates;

const noop = () => {};
const file = new File(["x"], "a.png", { type: "image/png" });
const options = [
	{ label: "One", value: "one" },
	{ label: "Two", value: "two" },
];
const fields: TField[] = [{ name: "city", type: "input", label: "City" }];
const columns = [{ key: "name", label: "Name" }];

const ContextMenuCase = ({
	menuRef,
	...native
}: {
	menuRef: React.Ref<HTMLDivElement>;
}) => {
	const menu = useContextMenu<void>();
	return (
		<>
			<button onContextMenu={(e) => menu.show(e, undefined)}>open</button>
			<ContextMenu ref={menuRef} menu={menu} items={[]} {...native} />
		</>
	);
};

/** The field box around a form control: where `className` goes on these. */
const fieldBox = (target: HTMLElement) => target.parentElement;
/** `<svg>` inside a Picto wrapper. */
const svgOf = (target: HTMLElement) => target.querySelector("svg");

const CASES: Record<string, INativePropsCase> = {
	// Display and containers: the root.
	Badge: { render: (n) => <Badge {...n} />, target: "span" },
	Button: { render: (n) => <Button {...n} />, target: "button" },
	Card: { render: (n) => <Card {...n} />, target: "div" },
	CountDown: {
		render: (n) => <CountDown onEnd={noop} {...n} />,
		target: "span",
	},
	Divider: {
		render: (n) => <Divider {...n} />,
		target: '[role="separator"]',
	},
	DocumentPreview: {
		render: (n) => (
			<DocumentPreview file={new File(["x"], "a.txt")} {...n} />
		),
		target: "div",
	},
	FlexGrid: { render: (n) => <FlexGrid {...n} />, target: "div" },
	FlexGridItem: { render: (n) => <FlexGridItem {...n} />, target: "div" },
	Grid: { render: (n) => <Grid {...n} />, target: "div" },
	InfoMessage: {
		render: (n) => <InfoMessage {...n} />,
		target: '[role="status"]',
	},
	InputErrorMessage: {
		render: (n) => <InputErrorMessage {...n}>Wrong</InputErrorMessage>,
		target: "p",
	},
	Link: { render: (n) => <Link href="#a" {...n} />, target: "a" },
	NavItem: { render: (n) => <NavItem href="#a" {...n} />, target: "a" },
	Picto: {
		render: (n) => <Picto icon="search" {...n} />,
		target: "[data-amphore-svg-wrapper]",
		classNameOn: svgOf,
	},
	Skeleton: { render: (n) => <Skeleton {...n} />, target: "div" },
	Spinner: { render: (n) => <Spinner {...n} />, target: '[role="status"]' },
	Td: { render: (n) => <Td {...n} />, target: '[role="gridcell"]' },
	Th: { render: (n) => <Th {...n} />, target: '[role="columnheader"]' },
	TabPanel: {
		render: (n) => <TabPanel active {...n} />,
		target: '[role="tabpanel"]',
	},
	Title: { render: (n) => <Title as="h2" {...n} />, target: "h2" },
	TruncatedTooltipText: {
		render: (n) => <TruncatedTooltipText {...n}>Text</TruncatedTooltipText>,
		target: "span",
	},
	Accordion: {
		render: (n) => <Accordion items={[]} {...n} />,
		target: "div",
	},
	Breadcrumb: {
		render: (n) => <Breadcrumb items={[{ label: "Home" }]} {...n} />,
		target: "nav",
	},
	HeadBar: { render: (n) => <HeadBar {...n} />, target: "div" },
	NavList: { render: (n) => <NavList items={[]} {...n} />, target: "nav" },
	SectionCard: {
		render: (n) => <SectionCard title="Title" {...n} />,
		target: "div",
	},
	SummaryList: {
		render: (n) => <SummaryList items={[]} {...n} />,
		target: "dl",
	},
	SummaryListItem: {
		render: (n) => <SummaryListItem label="Label" value="Value" {...n} />,
		target: "div",
	},
	TableHead: {
		render: (n) => <TableHead columns={columns} {...n} />,
		target: '[role="row"]',
	},
	TableRow: {
		render: (n) => <TableRow item={{}} columns={columns} {...n} />,
		target: '[role="row"]',
	},
	TodoItem: { render: (n) => <TodoItem text="Text" {...n} />, target: "li" },
	ToolBar: { render: (n) => <ToolBar items={[]} {...n} />, target: "div" },
	FileViewer: {
		render: (n) => <FileViewer src="a.png" {...n} />,
		target: "div",
	},
	Table: {
		render: (n) => (
			<Table columns={columns} items={[]} getItemKey={() => 1} {...n} />
		),
		target: '[role="grid"]',
	},
	TodoList: {
		render: (n) => <TodoList items={[]} onChange={noop} {...n} />,
		target: "ul",
	},
	PageHeader: { render: (n) => <PageHeader {...n} />, target: "div" },
	ActiveFilters: {
		render: (n) => (
			<ActiveFilters rightContent={<span>Right</span>} {...n} />
		),
		target: "div",
	},
	AddTodoItem: {
		render: (n) => <AddTodoItem onAdd={noop} {...n} />,
		target: "div",
	},
	PeriodFilter: { render: (n) => <PeriodFilter {...n} />, target: "div" },
	TimeRangeFilter: {
		render: (n) => <TimeRangeFilter {...n} />,
		target: "div",
	},
	FilesField: { render: (n) => <FilesField {...n} />, target: "div" },
	ColorPicker: {
		render: (n) => <ColorPicker value="#000000" onChange={noop} {...n} />,
		target: "div",
	},

	// Form controls: the interactive element. `className` goes to the box
	// around it where there is one: width classes must cover the whole box.
	Checkbox: {
		render: (n) => <Checkbox {...n} />,
		target: 'input[type="checkbox"]',
	},
	Radio: { render: (n) => <Radio {...n} />, target: 'input[type="radio"]' },
	Toggle: { render: (n) => <Toggle {...n} />, target: '[role="switch"]' },
	Input: {
		render: (n) => <Input {...n} />,
		target: "input",
		classNameOn: fieldBox,
	},
	NumberInput: {
		render: (n) => <NumberInput value={null} onChange={noop} {...n} />,
		target: "input",
		classNameOn: fieldBox,
	},
	TextArea: {
		render: (n) => <TextArea {...n} />,
		target: "textarea",
		classNameOn: fieldBox,
	},
	Slider: {
		render: (n) => <Slider value={1} onChange={noop} {...n} />,
		target: 'input[type="range"]',
		classNameOn: fieldBox,
	},
	ChipInput: {
		render: (n) => <ChipInput {...n} />,
		target: "input",
		classNameOn: fieldBox,
	},
	InputSearch: {
		render: (n) => <InputSearch onChange={noop} {...n} />,
		target: "input",
		classNameOn: fieldBox,
	},
	PasswordField: {
		render: (n) => <PasswordField {...n} />,
		target: "input",
		classNameOn: fieldBox,
	},
	Progress: {
		render: (n) => <Progress {...n} />,
		target: '[role="progressbar"]',
		classNameOn: fieldBox,
	},
	Select: {
		render: (n) => <Select options={options} {...n} />,
		target: '[role="combobox"]',
	},
	AsyncSelect: {
		render: (n) => <AsyncSelect loadOptions={async () => options} {...n} />,
		target: '[role="combobox"]',
	},
	DatePicker: {
		render: (n) => <DatePicker value={null} onChange={noop} {...n} />,
		target: "button",
	},
	ColorPickerField: {
		render: (n) => (
			<ColorPickerField value="#000000" onChange={noop} {...n} />
		),
		target: "button",
	},

	// Composites: the element holding their semantics, or their root.
	CheckboxFilter: {
		render: (n) => <CheckboxFilter options={options} {...n} />,
		target: '[role="group"]',
	},
	RadioFilter: {
		render: (n) => <RadioFilter options={options} {...n} />,
		target: '[role="radiogroup"]',
	},
	Tabs: {
		render: (n) => (
			<Tabs
				items={[{ label: "One", value: "one" }]}
				value="one"
				onChange={noop}
				{...n}
			/>
		),
		target: '[role="tablist"]',
	},
	InputFile: { render: (n) => <InputFile {...n} />, target: "div" },
	TimePicker: {
		render: (n) => <TimePicker value={null} onChange={noop} {...n} />,
		target: "div",
	},
	Modal: {
		render: (n) => <Modal open onClose={noop} {...n} />,
		target: '[role="dialog"]',
	},
	ConfirmModal: {
		render: (n) => (
			<ConfirmModal open onClose={noop} onConfirm={noop} {...n} />
		),
		target: '[role="dialog"]',
	},
	BottomPanel: {
		render: (n) => <BottomPanel open onOpenChange={noop} {...n} />,
		target: '[role="dialog"]',
	},
	SidePanel: {
		render: (n) => <SidePanel open onOpenChange={noop} {...n} />,
		target: '[role="complementary"]',
	},
	Tour: {
		render: (n) => (
			<Tour
				open
				onClose={noop}
				steps={[{ title: "Title", content: "Content" }]}
				{...n}
			/>
		),
		target: '[role="dialog"]',
	},

	// No element of their own: the floating element they open.
	Popover: {
		render: (n) => (
			<Popover open content="Content" {...n}>
				<button>open</button>
			</Popover>
		),
		target: '[role="dialog"]',
	},
	Tooltip: {
		render: (n) => (
			<Tooltip content="Content" {...n}>
				<button>open</button>
			</Tooltip>
		),
		target: '[role="tooltip"]',
		open: () => {
			fireEvent.mouseEnter(screen.getByText("open"));
		},
	},
	Dropdown: {
		render: (n) => (
			<Dropdown items={[]} {...n}>
				<button>open</button>
			</Dropdown>
		),
		target: '[role="menu"]',
		open: () => {
			fireEvent.click(screen.getByText("open"));
		},
	},
	ContextMenu: {
		render: ({ ref, ...n }) => <ContextMenuCase menuRef={ref} {...n} />,
		target: '[role="menu"]',
		open: () => {
			fireEvent.contextMenu(screen.getByText("open"));
		},
	},
	FiltersModal: {
		render: (n) => <FiltersModal filters={fields} {...n} />,
		target: "button",
	},

	// The form's grid.
	FormRenderer: {
		render: (n) => (
			<Formik initialValues={{}} onSubmit={noop}>
				<FormRenderer fields={fields} {...n} />
			</Formik>
		),
		target: "div",
	},
	FormRendererWithFormik: {
		render: (n) => (
			<FormRendererWithFormik initialValues={{}} fields={fields} {...n} />
		),
		target: "div",
	},
	EditableCard: {
		render: (n) => <EditableCard title="Title" fields={fields} {...n} />,
		target: "div",
	},

	// Dispatches on `type`, to a component this table already covers: props
	// reach it, but there's no one element for a `ref` to mean.
	FieldRenderer: {
		render: ({ ref: _ref, ...n }) => (
			<Formik initialValues={{}} onSubmit={noop}>
				<FieldRenderer name="city" type="input" {...n} />
			</Formik>
		),
		target: "input",
		classNameOn: fieldBox,
		refOn: null,
	},
};

describe("native props", () => {
	it.each(Object.keys(CASES))("%s", (name) => expectNativeProps(CASES[name]));

	it("covers every exported component", () => {
		const exported = Object.entries({
			...atoms,
			...molecules,
			...organisms,
			...templates,
		})
			.filter(
				([name, value]) =>
					/^[A-Z]/.test(name) &&
					(typeof value === "function" || typeof value === "object")
			)
			.map(([name]) => name);
		expect(exported.filter((name) => !(name in CASES))).toEqual([]);
	});
});

describe("merging, not overwriting", () => {
	it("keeps internal attributes out of reach of a stray prop", () => {
		render(<Button data-size="stray" data-color="stray" size="sm" />);
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("data-size", "sm");
		expect(button).toHaveAttribute("data-color", "primary");
	});

	it.each([
		["FlexGrid", FlexGrid],
		["Grid", Grid],
	])("%s keeps a consumer style next to its layout vars", (_, Component) => {
		render(<Component data-testid="grid" style={{ marginTop: "1px" }} />);
		const grid = screen.getByTestId("grid");
		expect(grid).toHaveStyle({ marginTop: "1px" });
		expect(grid.style.getPropertyValue("--_item-min-width")).toBe("200px");
	});

	it("Table keeps a consumer style next to its grid template", () => {
		render(
			<Table
				data-testid="table"
				style={{ marginTop: "1px" }}
				columns={columns}
				items={[]}
				getItemKey={() => 1}
			/>
		);
		const table = screen.getByTestId("table");
		expect(table).toHaveStyle({ marginTop: "1px" });
		expect(table.style.gridTemplateColumns).not.toBe("");
	});

	it("Popover keeps a consumer style next to its position", () => {
		render(
			<Popover open content="Content" style={{ marginTop: "1px" }}>
				<button>open</button>
			</Popover>
		);
		const panel = screen.getByRole("dialog");
		expect(panel).toHaveStyle({ marginTop: "1px", position: "fixed" });
	});

	it("a field's aria-describedby keeps the error's id next to the consumer's", () => {
		render(<Input aria-describedby="hint" error="Wrong" />);
		const describedBy = screen
			.getByRole("textbox")
			.getAttribute("aria-describedby");
		expect(describedBy?.split(" ")).toHaveLength(2);
		expect(describedBy).toContain("hint");
	});

	it("Slider keeps a consumer id", () => {
		render(<Slider id="volume" label="Volume" value={1} onChange={noop} />);
		expect(screen.getByLabelText("Volume")).toHaveAttribute("id", "volume");
	});

	it("Breadcrumb's aria-label wins over its default", () => {
		render(<Breadcrumb aria-label="Trail" items={[{ label: "Home" }]} />);
		expect(screen.getByRole("navigation")).toHaveAttribute(
			"aria-label",
			"Trail"
		);
	});

	it("BottomPanel's aria-label wins over its default", () => {
		render(<BottomPanel open onOpenChange={noop} aria-label="Cart" />);
		expect(screen.getByRole("dialog")).toHaveAttribute(
			"aria-label",
			"Cart"
		);
	});
});

describe("composed handlers", () => {
	it("Th: onClick and sorting both run", () => {
		const onClick = vi.fn();
		const onSort = vi.fn();
		render(<Th sortable onSort={onSort} onClick={onClick} />);
		fireEvent.click(screen.getByRole("columnheader"));
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onSort).toHaveBeenCalledTimes(1);
	});

	it("Th: onKeyDown and sorting both run", () => {
		const onKeyDown = vi.fn();
		const onSort = vi.fn();
		render(<Th sortable onSort={onSort} onKeyDown={onKeyDown} />);
		fireEvent.keyDown(screen.getByRole("columnheader"), { key: "Enter" });
		expect(onKeyDown).toHaveBeenCalledTimes(1);
		expect(onSort).toHaveBeenCalledTimes(1);
	});

	it("Th: onClick isn't dropped when not sortable", () => {
		const onClick = vi.fn();
		render(<Th onClick={onClick} />);
		fireEvent.click(screen.getByRole("columnheader"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("NumberInput: onFocus and onBlur run alongside its own formatting", () => {
		const onFocus = vi.fn();
		const onBlur = vi.fn();
		const onChange = vi.fn();
		render(
			<NumberInput
				value={1234}
				onChange={onChange}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
		);
		const input = screen.getByRole("textbox");
		fireEvent.focus(input);
		expect(onFocus).toHaveBeenCalledTimes(1);
		expect(input).toHaveValue("1234");
		fireEvent.blur(input);
		expect(onBlur).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(1234);
	});

	it("ChipInput: onKeyDown and onBlur run alongside the chip handling", () => {
		const onKeyDown = vi.fn();
		const onBlur = vi.fn();
		const onChange = vi.fn();
		render(
			<ChipInput
				onChange={onChange}
				onKeyDown={onKeyDown}
				onBlur={onBlur}
			/>
		);
		const input = screen.getByRole("textbox");
		fireEvent.change(input, { target: { value: "one" } });
		fireEvent.keyDown(input, { key: "Enter" });
		expect(onKeyDown).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(["one"]);
		fireEvent.blur(input);
		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	it("Select: onKeyDown runs alongside opening with Enter", () => {
		const onKeyDown = vi.fn();
		render(<Select options={options} onKeyDown={onKeyDown} />);
		const trigger = screen.getByRole("combobox");
		fireEvent.keyDown(trigger, { key: "Enter" });
		expect(onKeyDown).toHaveBeenCalledTimes(1);
		expect(screen.getByRole("listbox")).toBeInTheDocument();
	});

	it("Popover: onClick runs alongside closeOnClick", () => {
		const onClick = vi.fn();
		const onOpenChange = vi.fn();
		render(
			<Popover
				open
				closeOnClick
				onOpenChange={onOpenChange}
				onClick={onClick}
				content="Content"
			>
				<button>open</button>
			</Popover>
		);
		fireEvent.click(screen.getByText("Content"));
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("InputFile: onDrop runs alongside the drop handling", () => {
		const onDrop = vi.fn();
		const onChange = vi.fn();
		render(
			<InputFile data-testid="file" onDrop={onDrop} onChange={onChange} />
		);
		fireEvent.drop(screen.getByTestId("file"), {
			dataTransfer: { files: [file] },
		});
		expect(onDrop).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it("FiltersModal: buttonProps.onClick no longer replaces opening the modal", () => {
		const onClick = vi.fn();
		render(
			<FiltersModal
				filters={fields}
				filtersContext={{ filters: {} } as never}
				buttonProps={{ onClick }}
			/>
		);
		fireEvent.click(screen.getByRole("button"));
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});
});

describe("wrapperProps", () => {
	it.each([
		["Input", <Input key="c" wrapperProps={{ "data-testid": "w" }} />],
		[
			"Checkbox",
			<Checkbox key="c" wrapperProps={{ "data-testid": "w" }} />,
		],
		[
			"Select",
			<Select
				key="c"
				options={options}
				wrapperProps={{ "data-testid": "w" }}
			/>,
		],
		[
			"Tabs",
			<Tabs
				key="c"
				items={[]}
				value=""
				onChange={noop}
				wrapperProps={{ "data-testid": "w" }}
			/>,
		],
		[
			"Progress",
			<Progress key="c" wrapperProps={{ "data-testid": "w" }} />,
		],
	])("%s: reach the outer container", (_, element) => {
		const { container } = render(element);
		expect(container.firstElementChild).toBe(screen.getByTestId("w"));
	});

	it("merges its className with wrapperClassName", () => {
		render(
			<Input
				wrapperClassName="one"
				wrapperProps={{ "data-testid": "w", className: "two" }}
			/>
		);
		expect(screen.getByTestId("w")).toHaveClass("one", "two");
	});
});

describe("dedicated props", () => {
	it("Select: menuProps reach the listbox", () => {
		render(
			<Select
				options={options}
				menuProps={{ "data-testid": "menu", className: "mine" }}
			/>
		);
		fireEvent.click(screen.getByRole("combobox"));
		const listbox = screen.getByRole("listbox");
		expect(listbox).toBe(screen.getByTestId("menu"));
		expect(listbox).toHaveClass("mine");
	});

	it("Select: inputProps reach the search field, onChange composed", () => {
		const onChange = vi.fn();
		const onSearchChange = vi.fn();
		render(
			<Select
				searchable
				options={options}
				onSearchChange={onSearchChange}
				inputProps={{ "aria-label": "Find", onChange }}
			/>
		);
		fireEvent.click(screen.getByRole("combobox"));
		fireEvent.change(screen.getByLabelText("Find"), {
			target: { value: "o" },
		});
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onSearchChange).toHaveBeenCalledWith("o");
	});

	it("InputFile: inputProps reach the hidden input", () => {
		const { container } = render(
			<InputFile inputProps={{ "data-testid": "file" }} />
		);
		expect(container.querySelector('input[type="file"]')).toBe(
			screen.getByTestId("file")
		);
	});

	it("TimePicker: one set of props per input", () => {
		render(
			<TimePicker
				value={null}
				onChange={noop}
				hoursInputProps={{ "data-testid": "h" }}
				minutesInputProps={{ "data-testid": "m" }}
			/>
		);
		expect(screen.getByTestId("h")).toHaveAttribute("placeholder", "HH");
		expect(screen.getByTestId("m")).toHaveAttribute("placeholder", "mm");
	});

	it("ColorPicker tells native props from the picker's own options", () => {
		render(
			<ColorPicker
				data-testid="picker"
				value="#000000"
				onChange={noop}
				showAlpha={false}
			/>
		);
		const picker = screen.getByTestId("picker");
		expect(picker).not.toHaveAttribute("showalpha");
		expect(picker).not.toHaveAttribute("value");
	});

	it("FilesField sends upload props to the slots, native ones to the grid", () => {
		render(
			<FilesField
				data-testid="files"
				id="upload"
				maxFiles={1}
				accept=".pdf"
			/>
		);
		const grid = screen.getByTestId("files");
		expect(grid).not.toHaveAttribute("accept");
		expect(screen.getByTestId("files-slot-0-input")).toHaveAttribute(
			"accept",
			".pdf"
		);
	});
});

describe("derived testids", () => {
	it("are none without a base: the library never invents one", () => {
		const { container } = render(
			<>
				<Modal open onClose={noop} title="Title">
					Body
				</Modal>
				<InputFile />
				<TextArea />
				<Picto icon="search" />
				<Badge onRemove={noop}>Badge</Badge>
			</>
		);
		expect(container.querySelector("[data-testid]")).toBeNull();
	});

	it("Modal: title, close, content, footer, overlay", () => {
		render(
			<Modal
				data-testid="m"
				open
				onClose={noop}
				title="Title"
				footer="Footer"
			>
				Body
			</Modal>
		);
		expect(screen.getByTestId("m-title")).toHaveTextContent("Title");
		expect(screen.getByTestId("m-close")).toBeInTheDocument();
		expect(screen.getByTestId("m-content")).toHaveTextContent("Body");
		expect(screen.getByTestId("m-footer")).toHaveTextContent("Footer");
		expect(screen.getByTestId("m-overlay")).toBeInTheDocument();
	});

	it("ConfirmModal: primary and secondary", () => {
		const onConfirm = vi.fn();
		const onClose = vi.fn();
		render(
			<ConfirmModal
				data-testid="c"
				open
				onClose={onClose}
				onConfirm={onConfirm}
				confirmText="Yes"
				cancelText="No"
			/>
		);
		expect(screen.getByTestId("c-primary")).toHaveTextContent("Yes");
		expect(screen.getByTestId("c-secondary")).toHaveTextContent("No");
	});

	it("Dropdown: items by id, position as a fallback", () => {
		render(
			<Dropdown
				data-testid="d"
				items={[
					{ id: "rename", label: "Rename", onClick: noop },
					{ label: "Delete", onClick: noop },
				]}
			>
				<button>open</button>
			</Dropdown>
		);
		fireEvent.click(screen.getByText("open"));
		expect(screen.getByTestId("d-item-rename")).toHaveTextContent("Rename");
		expect(screen.getByTestId("d-item-1")).toHaveTextContent("Delete");
	});

	it("Select: options by value, position for an object value", () => {
		const objects = [{ label: "One", value: { id: 1 } }];
		render(
			<>
				<Select data-testid="s" options={options} />
				<Select data-testid="o" options={objects} />
			</>
		);
		fireEvent.click(screen.getByTestId("s"));
		expect(screen.getByTestId("s-option-one")).toHaveTextContent("One");
		fireEvent.click(screen.getByTestId("o"));
		expect(screen.getByTestId("o-option-0")).toHaveTextContent("One");
	});

	it("Table: every row's part sits below the row's", () => {
		render(
			<TableRow
				data-testid="t-row-1"
				item={{ name: "Ada" }}
				columns={columns}
			/>
		);
		expect(screen.getByTestId("t-row-1-name")).toHaveTextContent("Ada");
	});

	it("Tabs: tabs by value", () => {
		render(
			<Tabs
				data-testid="t"
				items={[{ label: "One", value: "one" }]}
				value="one"
				onChange={noop}
			/>
		);
		expect(screen.getByTestId("t-tab-one")).toHaveTextContent("One");
	});

	it("FormRendererWithFormik in a modal: buttons and fields", async () => {
		render(
			<FormRendererWithFormik
				data-testid="f"
				inModal
				open
				title="Title"
				initialValues={{}}
				fields={fields}
			/>
		);
		await waitFor(() =>
			expect(screen.getByRole("dialog")).toBe(screen.getByTestId("f"))
		);
		expect(screen.getByTestId("f-title")).toBeInTheDocument();
		expect(screen.getByTestId("f-primary")).toBeInTheDocument();
		expect(screen.getByTestId("f-secondary")).toBeInTheDocument();
		expect(screen.getByTestId("f-form")).toBeInTheDocument();
		expect(screen.getByTestId("f-field-city").tagName).toBe("INPUT");
	});

	it("EditableCard: edit button, then the form below `-form`", async () => {
		render(<EditableCard data-testid="e" title="Title" fields={fields} />);
		expect(screen.getByTestId("e-title")).toBeInTheDocument();
		fireEvent.click(screen.getByTestId("e-edit"));
		await waitFor(() =>
			expect(screen.getByRole("dialog")).toBe(
				screen.getByTestId("e-form")
			)
		);
		expect(screen.getByTestId("e-form-primary")).toBeInTheDocument();
	});

	it("a field's error sits below the field's", () => {
		render(<Input data-testid="i" error="Wrong" />);
		expect(screen.getByTestId("i-error")).toHaveTextContent("Wrong");
	});
});

describe("FieldRenderer", () => {
	const TYPES: [string, object][] = [
		["select", { options }],
		["date", {}],
		["period", { value: "2024" }],
		["time", {}],
		["timeRange", { value: "10:00" }],
		["input", {}],
		["number", {}],
		["textarea", {}],
		["chips", {}],
		["checkbox", { options }],
		["radio", { options }],
		["toggle", {}],
		["file", {}],
		["color", {}],
	];

	it.each(TYPES)(
		"%s: no field definition key reaches the DOM",
		async (type, extra) => {
			const error = vi.spyOn(console, "error").mockImplementation(noop);
			const { container } = render(
				<Formik initialValues={{}} onSubmit={noop}>
					<FieldRenderer
						{...({
							name: "city",
							type,
							label: "City",
							picto: "search",
							required: true,
							value: undefined,
							valueRenderer: noop,
							displayProps: {},
							chip: noop,
							chipLabel: "Chip",
							...extra,
						} as never)}
					/>
				</Formik>
			);
			await act(async () => {});

			const attributes = Array.from(container.querySelectorAll("*"))
				.flatMap((el) => Array.from(el.attributes))
				.map((attribute) => attribute.name.toLowerCase());
			for (const key of [
				"picto",
				"valuerenderer",
				"displayprops",
				"chip",
				"chiplabel",
				"label",
			]) {
				expect(attributes).not.toContain(key);
			}
			expect(
				container.querySelector(`[type="${type}"]:not(input)`)
			).toBeNull();
			expect(container.querySelector("div[value]")).toBeNull();
			expect(error).not.toHaveBeenCalled();
			error.mockRestore();
		}
	);

	it("still gives a custom renderer the whole definition", () => {
		const renderer = vi.fn(() => <span />);
		render(
			<Formik initialValues={{}} onSubmit={noop}>
				<FieldRenderer
					{...({
						name: "city",
						type: "input",
						displayProps: {},
						renderer,
					} as never)}
				/>
			</Formik>
		);
		expect(renderer).toHaveBeenCalledWith(
			expect.objectContaining({ type: "input", displayProps: {} })
		);
	});
});
