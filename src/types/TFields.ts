import { TPictoName } from "@constants/CPictos";
import { FormikContextType } from "formik";

import { IButtonProps, IPictoProps, IToggleProps } from "@components/atoms";
import {
	ISelectProps,
	ITextAreaProps,
	ITextFieldProps,
	ITimePickerProps,
} from "@components/molecules";
import { ICheckboxesFilterProps } from "@components/molecules/FieldRenderer/FieldsModels/CheckboxFilter/CheckboxFilter";
import { IRadioFilterProps } from "@components/molecules/FieldRenderer/FieldsModels/RadioFilter/RadioFilter";

export type TFieldPropsByType<
	T = unknown,
	CustomProps extends Record<string, object> = Record<never, never>,
> = {
	select: ISelectProps<T>;
	time: ITimePickerProps;
	input: ITextFieldProps;
	textarea: ITextAreaProps;
	checkbox: ICheckboxesFilterProps;
	radio: IRadioFilterProps;
	toggle: IToggleProps;
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
	required?: boolean;
	renderer?: (
		props: TFieldPropsByType<unknown, CustomProps>[Type]
	) => JSX.Element;
	valueRenderer?: (values: TFormikContextValues) => React.ReactNode; // Permet de personnaliser complètement l'affichage du champ en mode lecture seule (le champ "renderer" est ignoré dans ce cas)
	getFieldValue?: (values: TFormikContextValues) => unknown; // Permet de transformer la valeur du champ avant de l'afficher (ex: pour afficher une date au format "DD/MM/YYYY" alors que la valeur est un timestamp)
	resetOnApply?: boolean;
	onReset?: (formikCtx: FormikContextType<object>) => void;
	defaultValue?: unknown;
	picto?: IPictoProps["icon"] | IPictoProps;
	hidden?:
		| boolean
		| ((values: TFormikContextValues, isEditing: boolean) => boolean);
	addOnEmptyValue?: boolean; // Permet d'ajouter un bouton "+ Ajouter" lorsque la valeur du champ est vide
	valueDisplay?: (values: TFormikContextValues) => React.ReactNode; // Permet de personnaliser l'affichage de la valeur du champ en mode lecture seule
	showFieldLabel?: boolean; // Permet de masquer le label du champ
	showResetButton?: boolean; // Permet d'afficher un bouton de réinitialisation du champ
	wrapperClassName?: string; // Permet d'ajouter une classe CSS personnalisée au wrapper du champ
	beforeFieldComponent?:
		| React.ReactNode
		| ((values: TFormikContextValues) => React.ReactNode); // Permet d'ajouter un composant avant le champ (ex: pour afficher un message de validation personnalisé)
	afterFieldComponent?:
		| React.ReactNode
		| ((values: TFormikContextValues) => React.ReactNode); // Permet d'ajouter un composant après le champ (ex: pour afficher un message de validation personnalisé)
	order?: (values: TFormikContextValues, isEditing: boolean) => number; // Permet de définir l'ordre d'affichage des champs de manière dynamique en fonction de leurs valeurs
};

export type TFieldDisplayProps = {
	className?: string;
	info?: {
		text: React.ReactNode;
		textClassName?: string;
		picto?: TPictoName;
		pictoClassName?: string;
		pictoProps?: IPictoProps;
		onClick?: (props?: object) => void;
		isUnderlined?: boolean;
		href?: string;
		maxLines?: number;
	};
	action?: {
		label: string;
		picto?: TPictoName;
		pictoClassName?: string;
		pictoProps?: IPictoProps;
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
	columns?: number; // nombre de colonnes pour l'affichage des champs de ce groupe (si différent de columns ou editColumns)
	className?: string; // Permet d'ajouter une classe CSS personnalisée au groupe
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
