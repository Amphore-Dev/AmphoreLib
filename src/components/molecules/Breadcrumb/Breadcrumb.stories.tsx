import React, { useState } from "react";

import { Badge } from "../../atoms/Badge/Badge";
import { Picto } from "../../atoms/Picto/Picto";
import { Popover } from "../Popover/Popover";

import { Breadcrumb } from "./Breadcrumb";

export default {
	title: "Components/Molecules/Breadcrumb",
	component: Breadcrumb,
	argTypes: {
		navigationLabel: { control: "text" },
	},
};

export const Base = () => (
	<Breadcrumb
		items={[
			{ label: "Home", href: "/" },
			{ label: "Projects", href: "/projects" },
			{ label: "Marketing site" },
		]}
	/>
);

export const CustomSeparator = () => (
	<Breadcrumb
		items={[
			{ label: "Home", href: "/" },
			{ label: "Projects", href: "/projects" },
			{ label: "Marketing site" },
		]}
		separator={<Picto icon="chevron" style={{ width: "0.75rem" }} />}
	/>
);

export const WithHiddenEntry = () => (
	<Breadcrumb
		items={[
			{ label: "Home", href: "/" },
			// e.g. a step you only sometimes want in the trail.
			{ label: "Filtered", href: "/x", hidden: true },
			{ label: "Projects", href: "/projects" },
			{ label: "Marketing site" },
		]}
	/>
);

export const SingleEntry = () => <Breadcrumb items={[{ label: "Home" }]} />;

export const Empty = () => (
	<p>
		Nothing renders below (empty items):
		<Breadcrumb items={[]} />
	</p>
);

const CALENDARS = [
	{ label: "Personal", value: "cal-1", color: "#e2673f" },
	{ label: "Team", value: "cal-2", color: "#3f7fe2" },
];
const PROJECTS = [
	{ label: "Marketing site", value: "proj-1", color: "#3fe293" },
	{ label: "Mobile app", value: "proj-2", color: "#e2b93f" },
];

// A single label with a swatch + a Popover of choices, closing on pick —
// stands in for Chronos's own BreadcrumbSelect (a Popover+Badge molecule
// living in Chronos, not this lib). Reproduces the app's real
// HomeBreadcrumb: a clickable home icon, then two of these pickers, none
// of them an `href` — each `label` is fully custom, interactive content,
// not a link.
const BreadcrumbPicker: React.FC<{
	options: { label: string; value: string; color: string }[];
	value: string | null;
	onChange: (value: string | null) => void;
	allLabel: string;
}> = ({ options, value, onChange, allLabel }) => {
	const selected = options.find((o) => o.value === value);
	return (
		<Popover
			closeOnClick
			content={
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "0.25rem",
					}}
				>
					<button
						type="button"
						onClick={() => onChange(null)}
						style={{ background: "transparent", border: "none" }}
					>
						{allLabel}
					</button>
					{options.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => onChange(option.value)}
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.375rem",
								cursor: "pointer",
								border: "none",
								background: "transparent",
							}}
						>
							<span
								style={{
									width: "0.5rem",
									height: "0.5rem",
									borderRadius: "50%",
									background: option.color,
									display: "inline-block",
								}}
							/>
							{option.label}
						</button>
					))}
				</div>
			}
		>
			<button
				type="button"
				style={{
					display: "flex",
					alignItems: "center",
					gap: "0.375rem",
					background: "transparent",
					border: "none",
					cursor: "pointer",
				}}
			>
				{selected && (
					<span
						style={{
							width: "0.5rem",
							height: "0.5rem",
							borderRadius: "50%",
							background: selected.color,
							display: "inline-block",
						}}
					/>
				)}
				<Badge color="neutral" size="sm">
					{selected?.label ?? allLabel}
				</Badge>
			</button>
		</Popover>
	);
};

export const CustomLabel = () => {
	const [calendar, setCalendar] = useState<string | null>("cal-1");
	const [project, setProject] = useState<string | null>(null);
	return (
		<Breadcrumb
			items={[
				{
					label: (
						<Picto icon="home" onClick={() => setCalendar(null)} />
					),
				},
				{
					label: (
						<BreadcrumbPicker
							options={CALENDARS}
							value={calendar}
							onChange={setCalendar}
							allLabel="All calendars"
						/>
					),
				},
				{
					label: (
						<BreadcrumbPicker
							options={PROJECTS}
							value={project}
							onChange={setProject}
							allLabel="All projects"
						/>
					),
				},
			]}
		/>
	);
};
