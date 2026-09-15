import { TBaseField, TField, TFieldsGroup, TFieldType } from "./TFields";

type TBaseFilter<Name extends string, Type extends TFieldType> = TBaseField<
	Name,
	Type
> & {
	chip?: (value: unknown, filtersValues: unknown) => React.ReactNode;
	chipLabel?: string | ((value: unknown, filtersValues: unknown) => string);
	valueDisplay?: (option: unknown) => React.ReactNode;
};

/** Discriminated union of every possible filter field. */
export type TFilterModalFilter<Name extends string = string> = TField<
	Name,
	Record<never, never>
> &
	TBaseFilter<Name, TFieldType>;

export type TFiltersModalGroup = TFieldsGroup<TFilterModalFilter>;
