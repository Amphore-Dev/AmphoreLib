import React from "react";

import { FormikContextType, useFormikContext } from "formik";

import {
	Input,
	NumberInput,
	TextArea,
	TimePicker,
	Toggle,
} from "@components/atoms";
import {
	CheckboxFilter,
	ColorPickerField,
	DatePicker,
	FilesField,
	PeriodFilter,
	RadioFilter,
	Select,
	TimeRangeFilter,
} from "@components/molecules";

import {
	TBaseField,
	TFieldPropsByType,
	TFieldRendererMap,
	TFieldType,
	TLooseFieldRendererMap,
} from "@interfaces/index";

export interface IFieldRendererProps extends TBaseField<string, TFieldType> {
	customRenderers?: TLooseFieldRendererMap;
	/** Formik context, forwarded by FormRenderer — used to build default per-type onChange handlers. */
	formik?: FormikContextType<object>;
	/** Forwarded to the underlying field so an external `<label htmlFor>` (FormRenderer's own header) can target it. Not the field's own visible label — see `TBaseField.label` / FormRenderer's `showFieldLabels` for that. */
	id?: string;
	disabled?: boolean;
	/** Runtime value for this field, computed by FormRenderer from `formik.values`. */
	value?: unknown;
}

/**
 * V2 FieldRenderer — a `type -> component` map, the one place in this
 * system that touches Formik directly (to build a default `onChange` per
 * type when the field descriptor doesn't provide its own). Every mapped
 * component is otherwise a plain controlled V2 component — no
 * `withFormikWrapper`-style ambient coupling anywhere below this layer (see
 * memory/react-library-fields-audit.md).
 */
export const FieldRenderer: React.FC<IFieldRendererProps> = ({
	customRenderers,
	renderer,
	valueDisplay: _valueDisplay,
	addOnEmptyValue: _addOnEmptyValue,
	displayLabel: _displayLabel,
	getFieldValue: _getFieldValue,
	resetOnApply: _resetOnApply,
	onReset: _onReset,
	defaultValue: _defaultValue,
	showFieldLabel: _showFieldLabel,
	showResetButton: _showResetButton,
	wrapperClassName: _wrapperClassName,
	beforeFieldComponent: _beforeFieldComponent,
	afterFieldComponent: _afterFieldComponent,
	order: _order,
	formik,
	...props
}) => {
	const formikCtx = useFormikContext<Record<string, unknown>>();
	const setFieldValue = formik?.setFieldValue ?? formikCtx.setFieldValue;

	if (props.hidden) return null;

	const renderers: TFieldRendererMap = {
		select: ({ onChange, ...fieldProps }) => (
			<Select
				isClearable
				{...fieldProps}
				onChange={
					onChange ??
					((value) => {
						void setFieldValue(props.name, value);
					})
				}
			/>
		),
		date: ({ onChange, ...fieldProps }) => (
			<DatePicker
				value={null}
				{...fieldProps}
				onChange={
					onChange ??
					((value) => {
						void setFieldValue(props.name, value);
					})
				}
			/>
		),
		period: (fieldProps) => (
			<PeriodFilter
				{...fieldProps}
				onChange={
					fieldProps.onChange ??
					((fieldName, value) => {
						void setFieldValue(String(fieldName), value);
					})
				}
			/>
		),
		time: ({ onChange, ...fieldProps }) => (
			<TimePicker
				value={null}
				{...fieldProps}
				onChange={
					onChange ??
					((value) => {
						void setFieldValue(props.name, value);
					})
				}
			/>
		),
		timeRange: (fieldProps) => (
			<TimeRangeFilter
				{...fieldProps}
				onChange={
					fieldProps.onChange ??
					((fieldName, value) => {
						void setFieldValue(String(fieldName), value);
					})
				}
			/>
		),
		input: ({ onChange, ...fieldProps }) => (
			<Input
				{...fieldProps}
				onChange={
					onChange ??
					((value) => {
						void setFieldValue(props.name, value);
					})
				}
			/>
		),
		number: ({ onChange, ...fieldProps }) => (
			<NumberInput
				value={null}
				{...fieldProps}
				onChange={
					onChange ??
					((value) => {
						void setFieldValue(props.name, value);
					})
				}
			/>
		),
		textarea: ({ onChange, ...fieldProps }) => (
			<TextArea
				{...fieldProps}
				onChange={
					onChange ??
					((value) => {
						void setFieldValue(props.name, value);
					})
				}
			/>
		),
		checkbox: (fieldProps) => (
			<CheckboxFilter
				{...fieldProps}
				onChange={
					fieldProps.onChange ??
					((value) => {
						void setFieldValue(props.name, value);
					})
				}
			/>
		),
		radio: (fieldProps) => (
			<RadioFilter
				{...fieldProps}
				onChange={
					fieldProps.onChange ??
					((value) => {
						void setFieldValue(props.name, value);
					})
				}
			/>
		),
		toggle: ({ onChange, ...fieldProps }) => (
			<Toggle
				checked={!!props.value}
				{...fieldProps}
				onChange={
					onChange ??
					((checked) => {
						void setFieldValue(props.name, checked);
					})
				}
			/>
		),
		file: (fieldProps) => (
			<FilesField
				{...fieldProps}
				name={fieldProps.name ?? props.name}
				onChange={
					fieldProps.onChange ??
					((value) => {
						void setFieldValue(props.name, value);
					})
				}
			/>
		),
		color: ({ value, onChange, ...fieldProps }) => (
			<ColorPickerField
				{...fieldProps}
				value={value ?? ""}
				onChange={
					onChange ??
					((next) => {
						void setFieldValue(props.name, next);
					})
				}
			/>
		),
	};

	function renderByType<K extends TFieldType>(
		type: K,
		fieldProps: TFieldPropsByType[K]
	) {
		const customRenderer = customRenderers?.[String(type)] as
			| ((fieldProps: TFieldPropsByType[K]) => JSX.Element)
			| undefined;
		const custom = renderer ?? customRenderer;
		if (!custom) return renderers[type](fieldProps);

		// A custom renderer gets the same deal as the built-in ones: an
		// `onChange` that writes through Formik unless the descriptor
		// brought its own. Without this it would have no way to set the
		// value at all - the Formik context is this layer's, not the
		// consumer's.
		return custom({
			...fieldProps,
			onChange:
				(fieldProps as { onChange?: unknown }).onChange ??
				((value: unknown) => {
					void setFieldValue(props.name, value);
				}),
		} as TFieldPropsByType[K]);
	}

	const type = (props.type ?? "input") as TFieldType;
	const fieldProps = props as unknown as TFieldPropsByType[typeof type];

	return renderByType(type, fieldProps);
};
