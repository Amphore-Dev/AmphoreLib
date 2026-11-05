import React from "react";

import { Button } from "@components/atoms/Button/Button";
import { Input } from "@components/atoms/Input/Input";
import { Select } from "@components/molecules/Select/Select";

import { createFiltersContext } from "./FiltersContext";

type TOrdersFilters = { status?: string | null; search?: string };
type TSlices = { orders: TOrdersFilters };

const { Provider, useFiltersContext } = createFiltersContext<TSlices>();

const STATUSES = [
	{ value: "open", label: "Open" },
	{ value: "closed", label: "Closed" },
];

const DEFAULT_FILTERS: TSlices = { orders: { status: null, search: "" } };

const OrdersFilters = () => {
	const { filters, setFilter, setFilters } = useFiltersContext("orders");

	return (
		<div style={{ display: "grid", gap: "1rem", maxWidth: 320 }}>
			<Select
				label="Status"
				options={STATUSES}
				value={filters.status ?? null}
				onChange={(status) =>
					setFilter("status", status as string | null)
				}
			/>
			<Input
				label="Search"
				value={filters.search ?? ""}
				onChange={(search) => setFilter("search", search)}
			/>
			<Button
				variant="outline"
				onClick={() => setFilters(DEFAULT_FILTERS.orders)}
			>
				Reset
			</Button>
			<pre style={{ margin: 0 }}>{JSON.stringify(filters, null, 2)}</pre>
		</div>
	);
};

/**
 * One slice of filter state, shared by whatever reads it. The guide covers URL
 * sync and persistence, see Guides/FiltersContext.
 */
export default {
	title: "Contexts/FiltersContext",
	tags: ["!autodocs"],
	parameters: { controls: { disable: true } },
};

export const Base = () => (
	<Provider defaultFilters={DEFAULT_FILTERS}>
		<OrdersFilters />
	</Provider>
);
