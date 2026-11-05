import React, { useState } from "react";

import { FormikProps } from "formik";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { Badge, Button, IButtonProps } from "@components/atoms";
import { IModalProps } from "@components/molecules/Modal/Modal";

import { computeModalSize } from "@utils/UFormGroups";
import { genericForwardRef } from "@utils/UForwardRef";
import { composeHandlers } from "@utils/UHandlers";
import { deriveTestId } from "@utils/UTestId";

import {
	ITestIdProps,
	IUseFiltersContext,
	TEditFields,
	TFieldRendererMap,
	TFiltersSlice,
	TLabel,
} from "@interfaces/index";

import { FormRendererWithFormik } from "../FormRenderer/FormRenderer";

export interface IFiltersModalProps<
	T extends Record<string, TFiltersSlice<object>>,
	K extends keyof T,
	S = T[K],
>
	extends Omit<IButtonProps, "title" | "onReset" | "children">, ITestIdProps {
	/** Modal title. Defaults to "Filters" (or `FiltersModal.title` from the nearest AmphoreProvider — see useAmphoreLabels). No commonKey. */
	title?: TLabel;
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
	modalSize?: IModalProps["size"];
	buttonProps?: IButtonProps;
	/** Label for the "Filter" button that opens the modal. Defaults to "Filter" (or `FiltersModal.buttonLabel` from the nearest AmphoreProvider — see useAmphoreLabels). No commonKey — wording differs from any bare `common` verb. */
	buttonLabel?: TLabel;
	/** Label for the modal's submit action. Defaults to "Apply" (or `FiltersModal.applyLabel`). No commonKey. */
	applyLabel?: TLabel;
	/** Label for the modal's "Reset filters" action. Defaults to "Reset filters" (or `FiltersModal.resetLabel`). No commonKey — "Reset filters" differs from the bare "Reset" in `common`. */
	resetLabel?: TLabel;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TFiltersModalLabels = Pick<
	IFiltersModalProps<Record<string, TFiltersSlice<object>>, string>,
	"title" | "buttonLabel" | "applyLabel" | "resetLabel"
>;

const FiltersModalBase = <
	T extends Record<string, TFiltersSlice<object>>,
	K extends keyof T,
	S = T[K],
>(
	{
		title: titleProp,
		filters,
		filtersContext,
		onReset,
		onApply,
		displayGroupTitles = true,
		fieldsRenderers: filtersRenderers,
		defaultValues,
		columns = 1,
		modalSize,
		buttonProps,
		buttonLabel: buttonLabelProp,
		applyLabel: applyLabelProp,
		resetLabel: resetLabelProp,
		...props
	}: IFiltersModalProps<T, K, S>,
	ref: React.ForwardedRef<HTMLButtonElement>
) => {
	const { resolve } = useAmphoreLabels("FiltersModal");
	const title = resolve("title", titleProp);
	const buttonLabel = resolve("buttonLabel", buttonLabelProp);
	const applyLabel = resolve("applyLabel", applyLabelProp);
	const resetLabel = resolve("resetLabel", resetLabelProp);

	const {
		setFilters,
		filters: contextFilterValues,
		...filtersCtxRest
	} = (filtersContext ?? {}) as Partial<
		IUseFiltersContext<T, K, TFiltersSlice<S>>
	>;

	const [isOpen, setIsOpen] = useState(false);

	const calculatedFilters =
		typeof filters === "function"
			? filters(
					{ values: contextFilterValues } as FormikProps<
						TFiltersSlice<S>
					>,
					filtersCtxRest.options
				)
			: filters;

	if (!calculatedFilters?.length) return null;

	const resolvedDefaultValues =
		defaultValues ??
		(filtersContext?.options?.defaultValues as
			| Partial<TFiltersSlice<S>>
			| undefined);

	const handleSubmit = (values: TFiltersSlice<S>) => {
		setFilters?.(values, true);
		return Promise.resolve(onApply?.(values)).then(() => {
			setIsOpen(false);
		});
	};

	return (
		<>
			<Button
				picto="sliders"
				variant="outline"
				{...props}
				{...buttonProps}
				ref={ref}
				onClick={composeHandlers(
					props.onClick,
					buttonProps?.onClick,
					() => setIsOpen(true)
				)}
			>
				{buttonLabel}
				{!!filtersCtxRest.options?.countCallback && (
					<Badge size="sm" pill>
						{filtersCtxRest.options.countCallback(
							(contextFilterValues || {}) as TFiltersSlice<S>
						)}
					</Badge>
				)}
			</Button>

			{isOpen && (
				<FormRendererWithFormik
					data-testid={deriveTestId(
						buttonProps?.["data-testid"] ?? props["data-testid"],
						"modal"
					)}
					modalProps={{
						size: modalSize ?? computeModalSize(columns),
					}}
					title={title}
					initialValues={contextFilterValues as TFiltersSlice<S>}
					onSubmit={handleSubmit}
					open={isOpen}
					onClose={() => setIsOpen(false)}
					fields={() => calculatedFilters}
					fieldsRenderers={{
						...filtersRenderers,
						...filtersContext?.fieldRenderers,
					}}
					submitLabel={applyLabel}
					key={filtersContext?.filtersKey?.toString() ?? "default"}
					displayGroupTitles={displayGroupTitles}
					showFieldLabels
					showResetFieldButton
					inModal
					resetFormButton
					resetFormLabel={resetLabel}
					defaultValues={resolvedDefaultValues}
					columns={columns}
					onReset={onReset}
				/>
			)}
		</>
	);
};

/**
 * V2 FiltersModal — a "Filters" button (with an active-count Badge) that
 * opens a `FormRendererWithFormik` modal built from the same field
 * descriptors as everything else in this system. All strings are props
 * with English fallback defaults (decision 3), no i18next dependency.
 *
 * Native props and `ref` go to the "Filters" button, as `buttonProps` do
 * (`onClick` runs alongside opening the modal). Derived testids: `-modal`,
 * and FormRendererWithFormik's below it (`-modal-primary`...).
 */
export const FiltersModal = genericForwardRef(FiltersModalBase, "FiltersModal");
