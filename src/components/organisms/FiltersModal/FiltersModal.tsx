import React, { useState } from "react";

import { FormikProps } from "formik";
import { t } from "i18next";
import {
	IUseFiltersContext,
	TEditFields,
	TFieldRendererMap,
	TFieldsGroup,
	TFiltersSlice,
} from "types";

import { Badge, Button } from "@components/atoms";
import {
	FormRendererWithFormik,
	IModal,
} from "@components/organisms/FormRenderer/FormRenderer";

import { computeModalSize } from "@utils/UEditModal";

export type TFilterList = TFieldsGroup[];

export interface IFiltersModalProps<
	T extends Record<string, TFiltersSlice<object>>,
	K extends keyof T,
	S = T[K],
> extends Omit<IModal, "title"> {
	title?: string;

	filters:
		| TEditFields
		| ((
				formikCtx: FormikProps<TFiltersSlice<S>>,
				filtersOptions?: IUseFiltersContext<T, K, S>["options"]
		  ) => TEditFields);

	filtersContext?: IUseFiltersContext<T, K, S>;
	onReset?: () => void;
	onApply?: (filters: S) => void;
	displayGroupTitles?: boolean;
	fieldsRenderers?: Partial<TFieldRendererMap>;
	defaultValues?: Partial<TFiltersSlice<S>>;
	columns?: number;
	modalSize?: IModal["size"];
}

export const FiltersModal = <
	T extends Record<string, TFiltersSlice<object>>,
	K extends keyof T,
	S = T[K],
>({
	title,
	filters,
	filtersContext,
	onReset,
	onApply,
	displayGroupTitles = true,
	fieldsRenderers: filtersRenderers,
	defaultValues,
	columns = 1,
	modalSize,
}: IFiltersModalProps<T, K, S>) => {
	const {
		setFilters,
		filters: _filters,
		...filtersCtxRest
	} = (filtersContext ?? {}) as Partial<
		IUseFiltersContext<T, K, TFiltersSlice<S>>
	>;

	const [isOpen, setIsOpen] = useState(false);

	const calculatedFilters =
		typeof filters === "function"
			? filters(
					{ values: _filters } as FormikProps<TFiltersSlice<S>>,
					filtersCtxRest.options
				)
			: filters;

	if (!calculatedFilters?.length) {
		return null;
	}

	const _defaultValues =
		defaultValues ||
		(filtersContext?.options?.defaultValues as Partial<TFiltersSlice<S>>);

	const handleSubmit = (values: TFiltersSlice<S>) => {
		setFilters?.(values, true);

		return Promise.resolve(onApply?.(values)).then(() => {
			setIsOpen(false);
		});
	};
	return (
		<>
			<Button
				onClick={() => setIsOpen(true)}
				picto={{
					icon: "sliders",
					rotation: 90,
				}}
				color="white"
				className="al__filters-button"
			>
				{t("filters.filter")}
				<Badge
					value={
						filtersCtxRest.options?.countCallback
							? filtersCtxRest.options.countCallback(
									(_filters || {}) as TFiltersSlice<S>
								)
							: 0
					}
				/>
			</Button>
			{isOpen && (
				<FormRendererWithFormik
					modalProps={{
						size: modalSize || computeModalSize(columns),
						primaryAction: {
							label: t("filters.apply"),
						},
						secondaryAction: {
							label: t("filters.resetFilters"),
							action: () => {
								setFilters?.(
									(_defaultValues || {}) as TFiltersSlice<S>,
									true
								);
								onReset?.();
							},
						},
					}}
					title={title || t("filters.title")}
					initialValues={_filters as TFiltersSlice<S>}
					onSubmit={handleSubmit}
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					fields={() => calculatedFilters}
					fieldsRenderers={{
						...filtersRenderers,
						...filtersContext?.fieldRenderers,
					}}
					alwaysActiveSubmitButton={true}
					shouldCloseAfterAction={false}
					key={filtersContext?.filtersKey?.toString() ?? "default"}
					displayGroupTitles={displayGroupTitles}
					showFieldLabels={true}
					showResetFieldButton={true}
					inModal={true}
					resetFormButton={true}
					defaultValues={_defaultValues || {}}
					columns={columns}
				/>
			)}
		</>
	);
};
