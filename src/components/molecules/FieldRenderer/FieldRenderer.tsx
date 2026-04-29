import React, { FC } from "react";

import {
	TBaseField,
	TFieldPropsByType,
	TFieldRendererMap,
	TFieldType,
	TLooseFieldRendererMap,
} from "@/types";
import { useFormikContext } from "formik";

import { Select } from "../Select/Select";
import { TextArea } from "../TextArea/TextArea";
import { TextField } from "../TextField/TextField";
import { TimePicker } from "../TimePicker/TimePicker";
import { CheckboxFilter } from "./FieldsModels/CheckboxFilter/CheckboxFilter";
import { RadioFilter } from "./FieldsModels/RadioFilter/RadioFilter";
import { Toggle } from "@components/atoms";

interface IFieldRendererProps extends TBaseField<
	string,
	TFieldType,
	{ valueDisplay?: (values: object) => React.ReactNode }
> {
	customRenderers?: TLooseFieldRendererMap;
	displayProps?: object; // Props supplémentaires à passer au composant d'affichage en mode lecture seule
}

export const FieldRenderer: FC<IFieldRendererProps> = ({
	customRenderers,
	renderer,
	valueDisplay: _valueDisplay, // suppressions des props spécifiques à l'affichage qui ne sont pas utilisées dans ce composant
	displayProps: _displayProps,
	addOnEmptyValue: _addOnEmptyValue,
	...props
}) => {
	const { setFieldValue, setFieldTouched } = useFormikContext();

	if (props.hidden) {
		return null;
	}

	const renderers: TFieldRendererMap = {
		select: (props) => (
			<Select
				menuPosition="fixed"
				valueAsObject={true}
				isClearable={true}
				{...props}
			/>
		),
		time: (props) => <TimePicker {...props} />,
		input: (props) => <TextField {...props} />,
		textarea: (props) => <TextArea {...props} />,
		toggle: ({ onChange, ...props }) => (
			<Toggle
				checked={!!props.value}
				{...props}
				onChange={
					onChange ||
					((checked) => {
						if (props.name) {
							setFieldValue(props.name, checked);
						}
					})
				}
			/>
		),
		checkbox: ({ onChange, ...props }) => (
			<CheckboxFilter
				{...props}
				onChange={
					onChange ||
					((name, value) => {
						setFieldValue(name, value);
					})
				}
			/>
		),
		radio: ({ onChange, ...props }) => (
			<RadioFilter
				{...props}
				onChange={
					onChange ||
					((name, value) => {
						setFieldValue(name, value);
					})
				}
			/>
		),
	};

	function renderByType<K extends TFieldType>(
		type: K,
		props: TFieldPropsByType[K]
	) {
		const customRenderer = customRenderers?.[String(type)] as
			| ((props: TFieldPropsByType[K]) => JSX.Element)
			| undefined;
		const Renderer =
			renderer || customRenderer || renderers[type] || renderers.input;

		return Renderer(props);
	}

	const type = (props.type ?? "input") as TFieldType;

	return renderByType(type, props);
};
