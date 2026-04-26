import React from "react";

import { StoryFn } from "@storybook/react";
import { useSearchParams } from "react-router";
import {
	BrowserRouter,
	createBrowserRouter,
	createRoutesFromChildren,
	Route,
	RouterProvider,
} from "react-router";

import { format } from "date-fns";

import { useCreateRouterAdapter } from "@hooks/useCreateRouterAdapter";

import { createFiltersContext } from "./FiltersContext";

type TPlanningFilters = {
	date: string;
	status: "active" | "completed" | "todo";
};

type TUsersFilters = {
	search?: string;
	sortOrder: "asc" | "desc";
	location: string | null;
};

type TFilters = {
	planning: TPlanningFilters;
	users: TUsersFilters;
};

const FILTERS: TFilters = {
	planning: {
		date: format(new Date(), "yyyy-MM-dd"),
		status: "active",
	},
	users: {
		search: "",
		sortOrder: "asc",
		location: null,
	},
};

const { Provider: FiltersProvider, useFiltersContext } =
	createFiltersContext<TFilters>();

const Template: StoryFn = ({ adapterHook }) => {
	return (
		<FiltersProvider defaultFilters={FILTERS} adapterHook={adapterHook}>
			<div>
				<h2>Filters Context Provider</h2>

				<table className="w-full">
					<tbody>
						<tr className="[&_td]:border [&_td]:p-4 [&>td]:content-start">
							<td>
								<h2>Component A</h2>
								<p>
									<b>Set</b> values for <b>planning</b> filters
								</p>
								<PlanningFiltersSetter />
							</td>
							<td>
								<PlanningFiltersValues />
							</td>
						</tr>
					</tbody>
				</table>
				<table className="w-full mt-16">
					<tbody>
						<tr className="[&_td]:border [&_td]:p-4 [&>td]:content-start">
							<td>
								<UsersFiltersSetters />
							</td>
							<td>
								<UsersFiltersValue />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p className="mt-8 text-neutral-200">
				<i>Design ignoble mais ça marche</i>
			</p>
		</FiltersProvider>
	);
};

const PlanningFiltersSetter = () => {
	const { filters, setFilter } = useFiltersContext("planning");
	return (
		<div>
			<table className="w-full mt-4">
				<tbody>
					<tr className="bg-teal-200">
						<td colSpan={2}>Planning Filters</td>
					</tr>
					<tr>
						<td>Date</td>
						<td>
							<input
								type="date"
								value={filters.date}
								onChange={(e) =>
									setFilter(
										"date",
										e.target.value ||
											format(new Date(), "yyyy-MM-dd")
									)
								}
								className="w-full p-2 border-2 border-neutral-300 rounded"
							/>
						</td>
					</tr>
					<tr>
						<td>Status</td>
						<td>
							<select
								value={filters.status}
								onChange={(e) =>
									setFilter(
										"status",
										e.target
											.value as TPlanningFilters["status"]
									)
								}
								className="w-full p-2 pr-4 border-2 border-neutral-300 rounded"
							>
								<option value="active">Active</option>
								<option value="completed">Completed</option>
								<option value="todo">Todo</option>
							</select>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

const PlanningFiltersValues = () => {
	const { filters } = useFiltersContext("planning");
	return (
		<div>
			<h2>Component B</h2>
			<p>
				<b>Read</b> values for <b>planning</b> filters
			</p>
			<table className="w-full mt-4">
				<tbody>
					<tr className="bg-teal-200">
						<td colSpan={2}>Planning Filters</td>
					</tr>
					<tr>
						<td>Date</td>
						<td>{filters.date}</td>
					</tr>
					<tr>
						<td>Status</td>
						<td>{filters.status}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

const UsersFiltersSetters = () => {
	const { filters: userFilters, setFilter: setUserFilter } =
		useFiltersContext("users");

	return (
		<div>
			<h2>Component C</h2>
			<p>
				<b>Set</b> values for <b>users</b> & <b>planning</b> filters
			</p>
			<table className="w-full mt-4">
				<tbody>
					<tr className="bg-red-200">
						<td colSpan={2}>Users Filters</td>
					</tr>
					<tr>
						<td>Search</td>
						<td>
							<input
								type="text"
								value={userFilters.search}
								onChange={(e) =>
									setUserFilter("search", e.target.value)
								}
								className="w-full p-2 border-2 border-neutral-300 rounded"
							/>
						</td>
					</tr>
					<tr>
						<td>Sort Order</td>
						<td>
							<select
								value={userFilters.sortOrder}
								onChange={(e) =>
									setUserFilter(
										"sortOrder",
										e.target
											.value as TUsersFilters["sortOrder"]
									)
								}
								className="w-full p-2 pr-4 border-2 border-neutral-300 rounded"
							>
								<option value="asc">Ascending</option>
								<option value="desc">Descending</option>
							</select>
						</td>
					</tr>
					<tr>
						<td>Location</td>
						<td>
							<input
								type="text"
								value={userFilters.location || ""}
								onChange={(e) =>
									setUserFilter("location", e.target.value)
								}
								className="w-full p-2 border-2 border-neutral-300 rounded"
							/>
						</td>
					</tr>
				</tbody>
			</table>
			<PlanningFiltersSetter />
		</div>
	);
};

const UsersFiltersValue = () => {
	const { filters } = useFiltersContext("users");
	return (
		<div>
			<h2>Component D</h2>
			<p>
				<b>Read</b> values for <b>users</b> filters
			</p>
			<table className="w-full mt-4">
				<tbody>
					<tr className="bg-red-200">
						<td colSpan={2}>Users Filters</td>
					</tr>
					<tr>
						<td>Search</td>
						<td>{filters.search}</td>
					</tr>
					<tr>
						<td>Sort Order</td>
						<td>{filters.sortOrder}</td>
					</tr>
					<tr>
						<td>Location</td>
						<td>{filters.location}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

const WrappedTemplate = () => {
	const adapter = useCreateRouterAdapter(useSearchParams());
	return <Template adapterHook={adapter} />;
};

export const ReactRouterAdapter = () => {
	return (
		<BrowserRouter>
			<WrappedTemplate />
		</BrowserRouter>
	);
};

export const CreateBrowserRouter = () => {
	const router = createBrowserRouter(
		createRoutesFromChildren([
			<Route path="*" element={<WrappedTemplate />}></Route>,
		])
	);

	return <RouterProvider router={router} />;
};

export default {
	title: "Contexts/FiltersContext",

	parameters: {
		docs: {
			page: () => <Template />,
		},
	},
};

export const Default = Template.bind({});
