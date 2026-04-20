import React, { useCallback, useState } from "react";

import { StoryFn } from "@storybook/react";

import { Range } from "../../atoms/Range/Range";
import { IToolBarItem, IToolBarProps, ToolBar } from "./ToolBar";

import { cn } from "@utils/cn";

export default {
	title: "Components/Molecules/ToolBar",
	component: ToolBar,
	argTypes: {
		position: {
			control: "radio",
			options: ["top", "bottom"],
		},
	},
};

const Template: StoryFn<IToolBarProps> = (args) => {
	const [active, setActive] = useState(args.activeItem);
	return (
		<div style={{ height: "160px", position: "relative" }}>
			<ToolBar {...args} activeItem={active} onChange={setActive} />
		</div>
	);
};

export const Base = Template.bind({});
Base.args = {
	items: [
		{ id: "search", label: "Rechercher", picto: "search" },
		{ id: "save", label: "Enregistrer", picto: "save" },
		{ id: "trash", label: "Réinitialiser", picto: "trash" },
	] as IToolBarItem[],
	position: "bottom",
};

export const TopPosition = Template.bind({});
TopPosition.args = {
	items: [
		{ id: "search", label: "Rechercher", picto: "search" },
		{ id: "edit", label: "Modifier", picto: "edit" },
		{
			id: "settings",
			label: "Paramètres",
			picto: "settings",
			popover: (
				<p style={{ margin: 0, fontSize: "0.875rem" }}>
					Panneau paramètres
				</p>
			),
		},
		{
			id: "settings2",
			label: "Paramètres2",
			picto: "settings",
			popover: (
				<p style={{ margin: 0, fontSize: "0.875rem" }}>
					Panneau paramètres 2
				</p>
			),
		},
		{ id: "trash", label: "Supprimer", picto: "trash" },
	] as IToolBarItem[],
	position: "top",
};

export const WithPopover = () => {
	const [active, setActive] = useState<string | undefined>(undefined);

	const items: IToolBarItem[] = [
		{ id: "search", label: "Rechercher", picto: "search" },
		{
			id: "settings",
			label: "Paramètres",
			picto: "settings",
			popover: (
				<p style={{ margin: 0, fontSize: "0.875rem" }}>
					Panneau paramètres
				</p>
			),
		},
		{ id: "save", label: "Enregistrer", picto: "save" },
	];

	return (
		<div style={{ height: "200px", position: "relative" }}>
			<ToolBar items={items} activeItem={active} onChange={setActive} />
		</div>
	);
};

export const WithCustomComponent = () => {
	const [active, setActive] = useState<string | undefined>(undefined);

	const ColorSwatch: React.FC<{ isActive?: boolean }> = ({ isActive }) => (
		<div
			style={{
				width: 20,
				height: 20,
				borderRadius: "50%",
				background: "linear-gradient(135deg, #f97316, #ec4899)",
				outline: isActive ? "2px solid currentColor" : "none",
				outlineOffset: 2,
			}}
		/>
	);

	const items: IToolBarItem[] = [
		{ id: "search", label: "Rechercher", picto: "search" },
		{
			id: "color",
			label: "Couleur",
			component: ColorSwatch,
			popover: (
				<p style={{ margin: 0, fontSize: "0.875rem" }}>
					Sélecteur de couleur
				</p>
			),
		},
		{ id: "save", label: "Enregistrer", picto: "save" },
	];

	return (
		<div style={{ height: "200px", position: "relative" }}>
			<ToolBar items={items} activeItem={active} onChange={setActive} />
		</div>
	);
};

export const WithDisabled = Template.bind({});
WithDisabled.args = {
	items: [
		{ id: "search", label: "Rechercher", picto: "search" },
		{ id: "save", label: "Enregistrer", picto: "save", disabled: true },
		{ id: "trash", label: "Supprimer", picto: "trash" },
	] as IToolBarItem[],
	position: "bottom",
};

export const StoriesGenLike = Template.bind({});
StoriesGenLike.args = {
	items: [
		{ id: "search", label: "Rechercher", picto: "search" },
		{
			id: "settings",
			label: "Paramètres",
			picto: "settings",
			popover: (ref) => {
				const [value, setValue] = useState(50);
				const [activeSlider, setActiveSlider] = useState<string | null>(
					null
				);

				const handleMouseDown = useCallback(
					(sliderId: string) => {
						setActiveSlider(sliderId);
						if (ref.current)
							ref.current.classList.add("transparent");
					},
					[ref]
				);

				const handleMouseUp = useCallback(() => {
					setActiveSlider(null);
					if (ref.current)
						ref.current.classList.remove("transparent");
				}, [ref]);

				return (
					<div className="flex flex-col gap-4 min-w-[200px] p-4 ">
						<Range
							min={0}
							max={100}
							value={value}
							onChange={setValue}
							onMouseDownCapture={() => handleMouseDown("a")}
							onMouseUpCapture={handleMouseUp}
							className={cn([
								"bg-neutral-800",
								activeSlider &&
									activeSlider !== "a" &&
									"opacity-0 ",
							])}
						/>
						<Range
							min={0}
							max={100}
							value={value}
							onChange={setValue}
							onMouseDownCapture={() => handleMouseDown("b")}
							onMouseUpCapture={handleMouseUp}
							className={cn([
								"bg-neutral-800",
								activeSlider &&
									activeSlider !== "b" &&
									"opacity-0",
							])}
						/>
						<Range
							min={0}
							max={100}
							value={value}
							onChange={setValue}
							onMouseDownCapture={() => handleMouseDown("c")}
							onMouseUpCapture={handleMouseUp}
							className={cn([
								"bg-neutral-800",
								activeSlider &&
									activeSlider !== "c" &&
									"opacity-0",
							])}
						/>
					</div>
				);
			},
			tooltipProps: {
				className: "custom-tooltip",
			},
		},
		{ id: "save", label: "Enregistrer", picto: "save", disabled: true },
		{ id: "trash", label: "Supprimer", picto: "trash" },
	] as IToolBarItem[],
	position: "top",
};
