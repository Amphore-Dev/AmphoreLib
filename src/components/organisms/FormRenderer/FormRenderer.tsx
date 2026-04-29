import React, { PropsWithChildren } from "react";

import {
	Formik,
	FormikComputedProps,
	FormikProps,
	useFormikContext,
} from "formik";
import { t } from "i18next";

import {
	TEditFields,
	TFieldRendererMap,
	TFieldsGroup,
} from "@interfaces/TFields";

import { FieldRenderer } from "../../molecules/FieldRenderer/FieldRenderer";
import { Button, Divider, IGridProps, Modal } from "@components/atoms";
import { Grid } from "@components/atoms";

import { computeModalSize, genGroups } from "@utils/UEditModal";
import { cn } from "@utils/cn";
import { hasValue } from "@utils/objects";

import "./FormRenderer.scss";

export interface IModalAction {
	label?: string;
	action?: () => void | Promise<void>;
	disabled?: boolean;
}

export interface IModal {
	title?: React.ReactNode;
	isOpen?: boolean;
	onClose?: () => void;
	size?: "s" | "m" | "l";
	primaryAction?: IModalAction;
	secondaryAction?: IModalAction;
}

export interface IFormRendererProps<K = object>
	extends Partial<Omit<IModal, "size">>, Omit<IGridProps, "children"> {
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
	size?: IModal["size"];
	validationSchema?: unknown;
	inModal?: boolean;
	modalProps?: Partial<IModal>;
	formikCtx?: FormikProps<K>;
	isSubmitting?: boolean;
	setFieldValue?: FormikProps<K>["setFieldValue"];
	defaultValues?: Partial<K>;
	minItemWidth?: string;
	wrapperGridProps?: Omit<IGridProps, "children">;
}

const REQUIRED_FIELD_ON_LABEL = ["radio", "checkbox", "toggle"];

export const FormRenderer = <K extends object>({
	title,
	isOpen,
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
	isSubmitting = false,
	setFieldValue,
	defaultValues,
	wrapperGridProps,
}: IFormRendererProps<K>) => {
	const result =
		typeof fields === "function" ? fields(formikCtx, true) : fields;

	const groups: TFieldsGroup[] = genGroups(result);
	const _isSubmitting = isSubmitting || formikCtx.isSubmitting;

	return (
		<FormWrapper
			columns={wrapperGridProps?.columns || columns}
			inModal={inModal}
			title={title}
			onClose={onClose}
			isOpen={isOpen}
			modalProps={modalProps}
		>
			<Grid
				gap={"1rem"}
				minItemWidth={"250px"}
				columns={columns}
				{...wrapperGridProps}
				className="al__form-renderer-body"
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
								"al__form-renderer-group",
								groups.length > 1 &&
									groupBackground &&
									"al__form-renderer-group--background",
								group.className,
							])}
						>
							{!!group.title && displayGroupTitles && (
								<div className="al__form-renderer-group-title-wrapper">
									<p className="al__form-renderer-group-title">
										{group.title}
									</p>
									<Divider />
								</div>
							)}

							<Grid
								columns={groupColumns}
								minItemWidth={minItemWidth}
								gap={gap}
							>
								{groupFields.map(
									(
										{ hidden, getFieldValue, ...field },
										filterIndex
									) => {
										const isHidden =
											typeof hidden === "function"
												? hidden(formikCtx.values, true)
												: hidden;
										if (isHidden) return null;

										const order =
											typeof field.order === "function"
												? field.order(
														formikCtx.values,
														true
													)
												: orderIndex++;

										const formikFieldValue =
											formikCtx.values[
												field.name as keyof K
											];

										const fieldValue = getFieldValue
											? getFieldValue(formikCtx.values)
											: formikFieldValue;

										const fieldDefaultValue =
											field.defaultValue ??
											defaultValues?.[
												field.name as keyof K
											];

										const _hasValue =
											typeof fieldDefaultValue !==
												"undefined" &&
											typeof fieldValue !== "undefined"
												? JSON.stringify(fieldValue) !==
													JSON.stringify(
														fieldDefaultValue
													)
												: hasValue(fieldValue);

										const displayedLabel =
											typeof field.label === "function"
												? field.label(
														formikCtx.values,
														true
													)
												: field.label || field.name;

										const _showResetFieldButton =
											showResetFieldButton &&
											field.showResetButton !== false;

										const _showFieldLabels =
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

										return (
											<div
												key={`${field.name}-${filterIndex}`}
												className={cn([
													"al__form-renderer-group-item",
													showResetFieldButton &&
														"al__form-renderer-group-item--with-reset",
													field.wrapperClassName as
														| string
														| undefined,
												])}
												style={{ order }}
											>
												<div className="al__form-renderer-group-item-header">
													{_showFieldLabels && (
														<p className="al__form-renderer-group-item-label">
															{displayedLabel}
															{field.required &&
																REQUIRED_FIELD_ON_LABEL.includes(
																	field.type as string
																) && (
																	<span className="al__form-renderer-group-item-required-label">
																		*
																	</span>
																)}
														</p>
													)}
													{(_showFieldLabels ||
														_hasValue) &&
														_showResetFieldButton && (
															<Button
																color="transparent"
																className={cn([
																	"al__form-renderer-group-item-reset-btn",
																	(!_hasValue ||
																		_isSubmitting) &&
																		"al__form-renderer-group-item-reset-btn--disabled",
																])}
																size="s"
																onClick={() =>
																	field.onReset
																		? field.onReset(
																				formikCtx
																			)
																		: (
																				setFieldValue ??
																				formikCtx.setFieldValue
																			)?.(
																				field.name,
																				typeof fieldDefaultValue !==
																					"undefined"
																					? fieldDefaultValue
																					: null
																			)
																}
																disabled={
																	!_hasValue ||
																	_isSubmitting
																}
															>
																{t(
																	"filters.reset"
																)}
															</Button>
														)}
												</div>
												{beforeFieldComponent}
												<FieldRenderer
													value={fieldValue}
													{...field}
													label={
														displayedLabel as string
													}
													formik={
														formikCtx as unknown as import("formik").FormikContextType<unknown>
													}
													customRenderers={
														fieldsRenderers
													}
													disabled={
														(field.disabled as
															| boolean
															| undefined) ||
														_isSubmitting
													}
												/>
												{afterFieldComponent}
											</div>
										);
									}
								)}
							</Grid>
						</div>
					);
				})}
			</Grid>
		</FormWrapper>
	);
};

export interface IFormRendererWithFormikProps<K = object> extends Omit<
	IFormRendererProps<K>,
	"initialValues" | "onSubmit" | "validationSchema"
> {
	initialValues: K;
	onSubmit?: (values: K) => void;
	onReset?: () => void;
	validationSchema?: unknown;
	defaultValues?: Partial<K>;
	resetFormButton?: boolean;
	alwaysActiveSubmitButton?: boolean;
}

export const FormRendererWithFormik = <K extends object>({
	onSubmit = () => {},
	alwaysActiveSubmitButton,
	...props
}: IFormRendererWithFormikProps<K>) => {
	const { initialValues, validationSchema, defaultValues, initialTouched } =
		props;
	return (
		<Formik
			initialValues={initialValues}
			initialTouched={initialTouched}
			onSubmit={onSubmit}
			validationSchema={validationSchema}
			validateOnMount={true}
		>
			{(formikCtx: FormikProps<K>) => (
				<FormRenderer
					{...props}
					groupBackground={props.groupBackground ?? props.inModal}
					formikCtx={formikCtx}
					onSubmit={(values) =>
						new Promise<void>((resolve) =>
							resolve(onSubmit(values))
						)
					}
					modalProps={{
						...props.modalProps,
						primaryAction: {
							disabled:
								!alwaysActiveSubmitButton &&
								(formikCtx.isSubmitting ||
									!formikCtx.dirty ||
									!formikCtx.isValid),
							...props.modalProps?.primaryAction,
							action: () => formikCtx.submitForm(),
						},
						secondaryAction: props.resetFormButton
							? {
									label: t("filters.resetFilters"),
									...props.modalProps?.secondaryAction,
									action: () => {
										formikCtx.resetForm({
											values: (defaultValues || {}) as K,
										});
									},
								}
							: props.modalProps?.secondaryAction,
					}}
				/>
			)}
		</Formik>
	);
};

interface IFormWrapperProps<K extends object>
	extends Partial<Omit<IFormRendererProps<K>, "fields">>, PropsWithChildren {
	columns: number;
	inModal?: boolean;
}

const FormWrapper = <K extends object>({
	title,
	onClose = () => {},
	isOpen = false,
	columns,
	children,
	inModal = false,
	modalProps,
}: IFormWrapperProps<K>) => {
	const { submitForm, isSubmitting, dirty } = useFormikContext<K>();

	if (!inModal) return <>{children}</>;
	if (!isOpen) return null;

	const primaryAction = modalProps?.primaryAction;
	const secondaryAction = modalProps?.secondaryAction;

	return (
		<Modal
			title={title as string | undefined}
			onClose={onClose}
			isDisplayed={isOpen}
			size={computeModalSize(columns)}
			closeOnClickOutside={!isSubmitting && !dirty}
		>
			<div className="al__form-wrapper-modal-content">
				{children}
				<div className="al__form-wrapper-modal-actions">
					{secondaryAction && (
						<Button
							color="transparent"
							outline
							onClick={secondaryAction.action ?? onClose}
							disabled={secondaryAction.disabled || isSubmitting}
						>
							{secondaryAction.label ?? t("global.cancel")}
						</Button>
					)}
					{primaryAction && (
						<Button
							color="primary"
							onClick={
								primaryAction.action ?? (() => submitForm())
							}
							disabled={primaryAction.disabled || isSubmitting}
							isLoading={isSubmitting}
						>
							{primaryAction.label ?? t("global.validate")}
						</Button>
					)}
				</div>
			</div>
		</Modal>
	);
};
