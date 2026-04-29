import { TBaseField, TField, TFieldsGroup, TFieldType } from "./TFields";

type BaseFilter<Name extends string, Type extends TFieldType> = TBaseField<
	Name,
	Type
> & {
	chip?: (value: unknown, filtersValues: unknown) => React.ReactNode;
	chipLabel?: string | ((value: unknown, filtersValues: unknown) => string);
	valueDisplay?: (option: any) => React.ReactNode;
};

// Union discriminée de tous les filtres possibles
export type TFilterModalFilter<Name extends string = string> = TField<
	Name,
	BaseFilter<Name, TFieldType>
>;

export type TFiltersModalGroup = TFieldsGroup<TFilterModalFilter>;
