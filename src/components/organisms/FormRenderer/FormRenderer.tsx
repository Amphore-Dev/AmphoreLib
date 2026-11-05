import React, { PropsWithChildren } from "react";

import {
	Formik,
	FormikComputedProps,
	FormikContextType,
	FormikProps,
	useFormikContext,
} from "formik";
import { isEqual, omit } from "lodash";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { Button, Divider, FlexGrid, IFlexGridProps } from "@components/atoms";
import { IModalProps, Modal } from "@components/molecules/Modal/Modal";

import { computeModalSize, genGroups, hasValue } from "@utils/UFormGroups";
import { genericForwardRef } from "@utils/UForwardRef";
import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import {
	ITestIdProps,
	TEditFields,
	TFieldRendererMap,
	TFieldsGroup,
	TFieldType,
	TLabel,
	TLooseFieldRendererMap,
} from "@interfaces/index";

import { FieldRenderer } from "../FieldRenderer/FieldRenderer";

import styles from "./FormRenderer.module.scss";

/**
 * Field types for which "required" is shown on the label (as a suffix)
 * rather than as an asterisk next to it — a checkbox/radio/toggle group or
 * a two-input range reads better that way. Typed against `TFieldType`
 * itself (not a loose `string[]` like v1's `REQUIRED_FIELD_ON_LABEL`), so
 * adding a field type that needs this can't silently be forgotten here.
 */
const REQUIRED_FIELD_ON_LABEL: Partial<Record<TFieldType, true>> = {
	radio: true,
	checkbox: true,
	toggle: true,
	timeRange: true,
};

export interface IFormRendererProps<K = object>
	extends
		Partial<
			Pick<
				IModalProps,
				| "open"
				| "onClose"
				| "header"
				| "footer"
				| "closeOnOverlayClick"
				| "closeOnEscape"
				| "hideCloseButton"
				| "closeLabel"
				| "portal"
			>
		>,
		Omit<IFlexGridProps, "children" | "onSubmit" | "onReset">,
		ITestIdProps {
	initialValues?: K;
	initialTouched?: FormikComputedProps<K>["initialTouched"];
	onSubmit?: (values: K) => void;
	fields:
		| TEditFields
		| ((formikCtx: FormikProps<K>, isEditing: boolean) => TEditFields);
	displayGroupTitles?: boolean;
	groupBackground?: boolean;
	fieldsRenderers?: Partial<TFieldRendererMap>;
	showResetFieldButton?: boolean;
	showFieldLabels?: boolean;
	size?: IModalProps["size"];
	/** Passed straight through to Formik — the validation library itself (Yup, Zod+adapter...) is the consumer's choice. */
	validationSchema?: unknown;
	/** Renders inside a Modal instead of directly in the page. */
	inModal?: boolean;
	modalProps?: Partial<IModalProps>;
	/** Formik context to read fields' current values from — required if `fields` is a function, or to drive per-field resets. */
	formikCtx?: FormikProps<K>;
	/** Disables every field (and its individual reset button). Doesn't affect the form's own actions (submit/reset). */
	disableFields?: boolean;
	setFieldValue?: FormikProps<K>["setFieldValue"];
	defaultValues?: Partial<K>;
	minItemWidth?: string;
	wrapperGridProps?: Omit<IFlexGridProps, "children">;
	/** Modal footer labels. Default to "Submit"/"Cancel"/"Reset" (or `common.submit`/`common.cancel`/`common.reset`, or `FormRenderer.submitLabel`/`cancelLabel`/`resetLabel` from the nearest AmphoreProvider — see useAmphoreLabels). `FormRenderer` and `FormRendererWithFormik` share the same `"FormRenderer"` namespace — two views of the same conceptual component. */
	submitLabel?: TLabel;
	cancelLabel?: TLabel;
	resetLabel?: TLabel;
	title?: string;
}

/**
 * V2 FormRenderer — a grid of fields built from their definitions, inline or
 * in a Modal.
 *
 * Native props, `className` and `ref` go to the form's grid. `data-testid`
 * names the form: inline it sits on the grid, with `inModal` on the dialog,
 * the grid taking `-form`. Derived testids: `-field-<name>`, `-reset-<name>`,
 * Modal's own, `-primary` (submit), `-secondary` (cancel), `-reset` (reset
 * form).
 */
const FormRendererBase = <K extends object>(
	{
		title,
		open,
		onClose,
		fields,
		displayGroupTitles = true,
		groupBackground = false,
		fieldsRenderers,
		showResetFieldButton = false,
		showFieldLabels = true,
		inModal = false,
		modalProps,
		columns = 1,
		gap = "1rem",
		minItemWidth = "250px",
		formikCtx = { values: {} as K } as FormikProps<K>,
		disableFields,
		setFieldValue,
		defaultValues,
		wrapperGridProps,
		submitLabel: submitLabelProp,
		cancelLabel: cancelLabelProp,
		resetLabel: resetLabelProp,
		className,
		initialValues: _initialValues,
		initialTouched: _initialTouched,
		onSubmit: _onSubmit,
		validationSchema: _validationSchema,
		header: _header,
		footer: _footer,
		closeOnOverlayClick: _closeOnOverlayClick,
		closeOnEscape: _closeOnEscape,
		hideCloseButton: _hideCloseButton,
		closeLabel: _closeLabel,
		portal: _portal,
		size: _size,
		...props
	}: IFormRendererProps<K>,
	ref: React.ForwardedRef<HTMLDivElement>
) => {
	const { resolve } = useAmphoreLabels("FormRenderer");
	const submitLabel = resolve("submitLabel", submitLabelProp, "submit");
	const cancelLabel = resolve("cancelLabel", cancelLabelProp, "cancel");
	const resetLabel = resolve("resetLabel", resetLabelProp, "reset");

	const result =
		typeof fields === "function" ? fields(formikCtx, true) : fields;

	const groups: TFieldsGroup[] = genGroups(result);
	const fieldsDisabled = disableFields || formikCtx.isSubmitting;
	const testId = props["data-testid"];

	return (
		<FormWrapper
			columns={wrapperGridProps?.columns || columns}
			inModal={inModal}
			title={title}
			onClose={onClose}
			open={open}
			modalProps={modalProps}
			submitLabel={submitLabel}
			cancelLabel={cancelLabel}
			data-testid={testId}
		>
			<FlexGrid
				gap="1rem"
				minItemWidth="250px"
				columns={columns}
				{...props}
				{...wrapperGridProps}
				ref={ref}
				data-testid={inModal ? deriveTestId(testId, "form") : testId}
				className={cn([
					styles.body,
					className,
					wrapperGridProps?.className,
				])}
			>
				{groups.map((group, groupIndex) => {
					const groupFields =
						typeof group.fields === "function"
							? group.fields(true)
							: group.fields;

					const groupColumns = group.columns || columns;
					let orderIndex = 1;

					return (
						<div
							key={group.title ?? groupIndex}
							className={cn([
								styles.group,
								groups.length > 1 &&
									groupBackground &&
									styles.groupBackground,
								group.className,
							])}
						>
							{!!group.title && displayGroupTitles && (
								<div className={styles.groupTitleWrapper}>
									<p className={styles.groupTitle}>
										{group.title}
									</p>
									<Divider />
								</div>
							)}

							<FlexGrid
								columns={groupColumns}
								minItemWidth={minItemWidth}
								gap={gap}
							>
								{groupFields.map((field, fieldIndex) => {
									const isHidden =
										typeof field.hidden === "function"
											? field.hidden(
													formikCtx.values,
													true
												)
											: field.hidden;
									if (isHidden) return null;

									const order =
										typeof field.order === "function"
											? field.order(
													formikCtx.values,
													true
												)
											: orderIndex++;

									const formikFieldValue = (
										formikCtx.values as Record<
											string,
											unknown
										>
									)[field.name];

									const fieldValue = field.getFieldValue
										? field.getFieldValue(formikCtx.values)
										: formikFieldValue;

									const fieldDefaultValue =
										field.defaultValue ??
										(
											defaultValues as
												| Record<string, unknown>
												| undefined
										)?.[field.name];

									const fieldHasDefault =
										typeof fieldDefaultValue !==
											"undefined" &&
										typeof fieldValue !== "undefined";

									const isDirty = fieldHasDefault
										? !isEqual(
												fieldValue,
												fieldDefaultValue
											)
										: hasValue(fieldValue);

									const fieldLabel =
										typeof field.label === "function"
											? field.label(
													formikCtx.values,
													true
												)
											: field.label || field.name;

									const displayedLabel = field.displayLabel
										? typeof field.displayLabel ===
											"function"
											? field.displayLabel(
													formikCtx.values,
													true
												)
											: field.displayLabel
										: fieldLabel;

									const showFieldReset =
										showResetFieldButton &&
										field.showResetButton !== false;

									const showLabel =
										(field.showFieldLabel !== false &&
											showFieldLabels) ||
										field.showFieldLabel === true;

									const beforeFieldComponent =
										typeof field.beforeFieldComponent ===
										"function"
											? field.beforeFieldComponent(
													formikCtx.values
												)
											: field.beforeFieldComponent;

									const afterFieldComponent =
										typeof field.afterFieldComponent ===
										"function"
											? field.afterFieldComponent(
													formikCtx.values
												)
											: field.afterFieldComponent;

									const { name, type } =
										field as typeof field & {
											name: string;
											type: TFieldType;
										};
									// `hidden` is resolved above (isHidden) — omitted here so a
									// functional `hidden` doesn't reach FieldRenderer, whose own
									// (much simpler) `if (props.hidden) return null` check would
									// otherwise treat the function itself as always-truthy.
									// `label` is also omitted: it's rendered exactly once, by
									// this component's own header below (as a real
									// `<label htmlFor>`, not just text) — never by the
									// underlying atom. Forwarding it there too used to render
									// the same text twice (the atom's own `<label>` plus this
									// header). When `showLabel` is off there's now no label at
									// all, on either side — not even one moved onto the atom.
									const fieldProps = omit(field, [
										"name",
										"type",
										"hidden",
										"label",
									]);

									return (
										<div
											key={`${name}-${fieldIndex}`}
											className={cn([
												styles.groupItem,
												showResetFieldButton &&
													styles.groupItemWithReset,
												field.wrapperClassName,
											])}
											style={{ order }}
										>
											<div
												className={
													styles.groupItemHeader
												}
											>
												{showLabel && (
													<label
														htmlFor={name}
														className={
															styles.groupItemLabel
														}
													>
														{displayedLabel}
														{field.required &&
															REQUIRED_FIELD_ON_LABEL[
																type
															] && (
																<span
																	className={
																		styles.requiredLabel
																	}
																>
																	*
																</span>
															)}
													</label>
												)}

												{(showLabel || isDirty) &&
													showFieldReset && (
														<Button
															picto="refresh"
															color="primary"
															variant="link"
															className={cn([
																styles.resetBtn,
																(!isDirty ||
																	fieldsDisabled) &&
																	styles.resetBtnDisabled,
															])}
															size="sm"
															data-testid={deriveTestId(
																testId,
																"reset",
																name
															)}
															onClick={() =>
																field.onReset
																	? field.onReset(
																			formikCtx as unknown as FormikContextType<object>
																		)
																	: void (
																			setFieldValue ??
																			formikCtx.setFieldValue
																		)(
																			name,
																			typeof fieldDefaultValue !==
																				"undefined"
																				? fieldDefaultValue
																				: null
																		)
															}
															disabled={
																!isDirty ||
																fieldsDisabled
															}
														>
															{resetLabel}
														</Button>
													)}
											</div>

											{beforeFieldComponent}

											<FieldRenderer
												name={name}
												type={type}
												id={name}
												value={fieldValue}
												data-testid={deriveTestId(
													testId,
													"field",
													name
												)}
												{...fieldProps}
												formik={
													formikCtx as unknown as FormikContextType<object>
												}
												customRenderers={
													fieldsRenderers as
														| TLooseFieldRendererMap
														| undefined
												}
												disabled={
													("disabled" in fieldProps &&
														!!fieldProps.disabled) ||
													fieldsDisabled
												}
											/>

											{afterFieldComponent}
										</div>
									);
								})}
							</FlexGrid>
						</div>
					);
				})}
			</FlexGrid>
		</FormWrapper>
	);
};

export const FormRenderer = genericForwardRef(FormRendererBase, "FormRenderer");

export interface IFormRendererWithFormikProps<K = object> extends Omit<
	IFormRendererProps<K>,
	"initialValues" | "onSubmit" | "validationSchema"
> {
	initialValues: K;
	onSubmit?: (values: K) => void;
	onReset?: () => void;
	validationSchema?: unknown;
	defaultValues?: Partial<K>;
	/** Shows a "reset the whole form" secondary action next to submit. */
	resetFormButton?: boolean;
	/** Defaults to "Reset fields" (or `FormRenderer.resetFormLabel` from the nearest AmphoreProvider — see useAmphoreLabels). No commonKey — "Reset fields" differs from the bare "Reset" in `common` (which `resetLabel` above resolves against). */
	resetFormLabel?: TLabel;
	/** Extra condition, OR-ed with the default `isSubmitting || !dirty || !isValid`. The function form receives live Formik context — useful to gate submit on an async check still in flight. */
	disableSubmit?: boolean | ((formikCtx: FormikProps<K>) => boolean);
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. `FormRenderer` and `FormRendererWithFormik` are two views of the same conceptual component and share the `"FormRenderer"` namespace, so their label keys are combined into a single type here rather than exported twice. */
export type TFormRendererLabels = Pick<
	IFormRendererProps,
	"submitLabel" | "cancelLabel" | "resetLabel"
> &
	Pick<IFormRendererWithFormikProps, "resetFormLabel">;

/** FormRenderer inside its own Formik: same native props, same `ref`, same derived testids. */
const FormRendererWithFormikBase = <K extends object>(
	{
		onSubmit = () => {},
		onReset,
		disableSubmit,
		resetFormButton = false,
		resetFormLabel: resetFormLabelProp,
		submitLabel: submitLabelProp,
		cancelLabel: cancelLabelProp,
		onClose = () => {},
		defaultValues,
		...props
	}: IFormRendererWithFormikProps<K>,
	ref: React.ForwardedRef<HTMLDivElement>
) => {
	const { initialValues, validationSchema, initialTouched } = props;
	const testId = props["data-testid"];
	const { resolve } = useAmphoreLabels("FormRenderer");
	const resetFormLabel = resolve("resetFormLabel", resetFormLabelProp);
	const submitLabel = resolve("submitLabel", submitLabelProp, "submit");
	const cancelLabel = resolve("cancelLabel", cancelLabelProp, "cancel");

	return (
		<Formik
			initialValues={initialValues}
			initialTouched={initialTouched}
			onSubmit={onSubmit}
			validationSchema={validationSchema}
			validateOnMount
		>
			{(formikCtx: FormikProps<K>) => {
				const extraSubmitDisabled =
					typeof disableSubmit === "function"
						? disableSubmit(formikCtx)
						: !!disableSubmit;
				const submitDisabled =
					formikCtx.isSubmitting ||
					!formikCtx.dirty ||
					!formikCtx.isValid ||
					extraSubmitDisabled;

				return (
					<FormRenderer
						{...(props as IFormRendererProps<K>)}
						ref={ref}
						groupBackground={props.groupBackground ?? props.inModal}
						formikCtx={formikCtx}
						onClose={onClose}
						defaultValues={defaultValues}
						submitLabel={submitLabel}
						cancelLabel={cancelLabel}
						modalProps={{
							...props.modalProps,
							footer:
								props.modalProps?.footer ??
								(props.inModal ? (
									<div className={styles.footerActions}>
										{resetFormButton && (
											<Button
												variant="ghost"
												data-testid={deriveTestId(
													testId,
													"reset"
												)}
												onClick={() => {
													formikCtx.resetForm({
														values: (defaultValues ??
															{}) as K,
													});
													onReset?.();
												}}
												disabled={
													formikCtx.isSubmitting
												}
											>
												{resetFormLabel}
											</Button>
										)}
										<Button
											variant="outline"
											onClick={onClose}
											data-testid={deriveTestId(
												testId,
												"secondary"
											)}
											disabled={formikCtx.isSubmitting}
										>
											{cancelLabel}
										</Button>
										<Button
											onClick={() =>
												formikCtx.submitForm()
											}
											data-testid={deriveTestId(
												testId,
												"primary"
											)}
											isLoading={formikCtx.isSubmitting}
											disabled={submitDisabled}
										>
											{submitLabel}
										</Button>
									</div>
								) : undefined),
						}}
					/>
				);
			}}
		</Formik>
	);
};

export const FormRendererWithFormik = genericForwardRef(
	FormRendererWithFormikBase,
	"FormRendererWithFormik"
);

interface IFormWrapperProps<K extends object>
	extends Partial<Omit<IFormRendererProps<K>, "fields">>, PropsWithChildren {
	columns: number;
	inModal?: boolean;
	submitLabel: string;
	cancelLabel: string;
}

const FormWrapper = <K extends object>({
	title,
	onClose = () => {},
	open = false,
	columns,
	children,
	inModal = false,
	modalProps,
	submitLabel,
	cancelLabel,
	"data-testid": testId,
}: IFormWrapperProps<K>) => {
	const { submitForm, isSubmitting, dirty } = useFormikContext<K>();

	if (!inModal) return <>{children}</>;
	if (!open) return null;

	return (
		<Modal
			title={title}
			onClose={onClose}
			open={open}
			size={computeModalSize(columns)}
			closeOnOverlayClick={!isSubmitting && !dirty}
			closeOnEscape={!isSubmitting}
			hideCloseButton={isSubmitting}
			data-testid={testId}
			{...modalProps}
			footer={
				modalProps?.footer ?? (
					<div className={styles.footerActions}>
						<Button
							variant="outline"
							onClick={onClose}
							disabled={isSubmitting}
							data-testid={deriveTestId(testId, "secondary")}
						>
							{cancelLabel}
						</Button>
						<Button
							onClick={() => submitForm()}
							isLoading={isSubmitting}
							data-testid={deriveTestId(testId, "primary")}
						>
							{submitLabel}
						</Button>
					</div>
				)
			}
		>
			<div className={styles.modalContent}>{children}</div>
		</Modal>
	);
};
