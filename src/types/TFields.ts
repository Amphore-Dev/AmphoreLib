import { FormikContextType } from "formik";

import {
	IButtonProps,
	IInputProps,
	INumberInputProps,
	IPictoProps,
	ITextAreaProps,
	IToggleProps,
	ITimePickerProps,
} from "@components/atoms";
import {
	ICheckboxesFilterProps,
	IDatePickerProps,
	IFilesFieldProps,
	IPeriodFilterProps,
	IRadioFilterProps,
	ISelectProps,
	ITimeRangeFilterProps,
} from "@components/molecules";

import { TPictoName } from "@constants/index";

/**
 * `NumberInput`/`DatePicker`/`TimePicker` require `value`/`onChange` on the
 * real component (stricter than v1's equivalents, which had them optional).
 * A field *descriptor* never sets them itself — `FieldRenderer` always
 * injects both — so they're omitted here and re-added as optional, instead
 * of forcing every descriptor object to redundantly declare them.
 */
type TOmitControlled<P> = Omit<P, "value" | "onChange">;

export type TFieldPropsByType<
	T = unknown,
	CustomProps extends Record<string, object> = Record<never, never>,
> = {
	select: ISelectProps<T>;
	date: TOmitControlled<IDatePickerProps> & {
		value?: Date | null;
		onChange?: (value: Date | null) => void;
	};
	period: IPeriodFilterProps;
	time: TOmitControlled<ITimePickerProps> & {
		value?: string | null;
		onChange?: (value: string | null) => void;
	};
	timeRange: ITimeRangeFilterProps;
	input: IInputProps;
	number: TOmitControlled<INumberInputProps> & {
		value?: number | null;
		onChange?: (value: number | null) => void;
	};
	textarea: ITextAreaProps;
	checkbox: ICheckboxesFilterProps;
	radio: IRadioFilterProps;
	toggle: IToggleProps;
	file: IFilesFieldProps;
} & CustomProps;

export type TFieldType<
	CustomProps extends Record<string, object> = Record<never, never>,
> = keyof TFieldPropsByType<unknown, CustomProps>;

type TFormikContextValues = FormikContextType<object>["values"];

export type TBaseField<
	Name extends string,
	Type extends TFieldType<CustomProps>,
	CustomProps extends Record<string, object> = Record<never, never>,
> = {
	name: Name;
	type: Type;
	label?:
		| string
		| ((values: TFormikContextValues, isEditing: boolean) => string);
	displayLabel?:
		| string
		| React.ReactNode
		| ((
				values: TFormikContextValues,
				isEditing: boolean
		  ) => string | React.ReactNode);
	required?: boolean;
	/** Fully overrides the field's rendering for this one field. */
	renderer?: (
		props: TFieldPropsByType<unknown, CustomProps>[Type]
	) => JSX.Element;
	/** Fully overrides the read-only display for this one field (ignores `renderer`). */
	valueRenderer?: (values: TFormikContextValues) => React.ReactNode;
	/** Transforms the field's stored value before it's displayed/edited (e.g. a timestamp -> "dd/MM/yyyy"). */
	getFieldValue?: (values: TFormikContextValues) => unknown;
	resetOnApply?: boolean;
	onReset?: (formikCtx: FormikContextType<object>) => void;
	defaultValue?: unknown;
	picto?: TPictoName | IPictoProps;
	hidden?:
		| boolean
		| ((values: TFormikContextValues, isEditing: boolean) => boolean);
	/** Shows an "+ Ajouter" button in place of an empty value in read-only mode. */
	addOnEmptyValue?: boolean;
	valueDisplay?: (values: TFormikContextValues) => React.ReactNode;
	showFieldLabel?: boolean;
	showResetButton?: boolean;
	wrapperClassName?: string;
	beforeFieldComponent?:
		| React.ReactNode
		| ((values: TFormikContextValues) => React.ReactNode);
	afterFieldComponent?:
		| React.ReactNode
		| ((values: TFormikContextValues) => React.ReactNode);
	/** Dynamic display order among sibling fields. */
	order?: (values: TFormikContextValues, isEditing: boolean) => number;
};

export type TFieldDisplayProps = {
	className?: string;
	info?: {
		text: React.ReactNode;
		textClassName?: string;
		picto?: TPictoName | IPictoProps;
		onClick?: (props?: object) => void;
		maxLines?: number;
	};
	action?: {
		label: string;
		picto?: TPictoName | IPictoProps;
		buttonProps?: IButtonProps;
		onClick?: (props?: object) => void;
	};
};

export type TFieldState = {
	isEditing: boolean;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
	value: unknown;
};

export type TField<
	Name extends string = string,
	CustomProps extends Record<string, object> = Record<never, never>,
	BaseField = TBaseField<Name, TFieldType<CustomProps>, CustomProps> & {
		displayProps?:
			| TFieldDisplayProps
			| ((state: TFieldState) => TFieldDisplayProps);
	},
> = {
	[Type in TFieldType<CustomProps>]: BaseField &
		TFieldPropsByType<unknown, CustomProps>[Type];
}[TFieldType<CustomProps>];

export type TFieldsGroup<T = TField> = {
	title?: string;
	fields: T[] | ((isEditing: boolean) => T[]);
	/** Columns for this group's own field grid, if different from the form's. */
	columns?: number;
	className?: string;
};

export type TFieldRendererMap<
	CustomProps extends Record<string, object> = Record<never, never>,
> = {
	[K in TFieldType<CustomProps>]: (
		props: TFieldPropsByType<unknown, CustomProps>[K]
	) => JSX.Element;
};

export type TLooseFieldRendererMap = Partial<
	Record<string, (props: object) => JSX.Element>
>;

export type TEditFields = TField[] | TFieldsGroup[];
