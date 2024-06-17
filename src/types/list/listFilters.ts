export interface IFilterStatus {
	name: string;
	value?: string;
}

export interface IFilters {
	[key: string]: any;
}

export interface IDatesFilter extends IFilters {
	dateBetweenStart?: string;
	dateBetweenEnd?: string;
	dateBetweenName?: string;
}

export interface IPageFilter extends IFilters {
	page?: number;
	limit?: number;
	total?: number;
}

export interface ISearchFilter extends IFilters {
	freeSearch?: string;
}

export interface IStatusFilter extends IFilters {
	status?: string;
}

export interface IFiltersProps {
	filters: any;
	setFilter: (filter: string, value?: any) => void;
}

export interface IFiltersWithDatesProps extends IFiltersProps {
	setDates: (dates: IDatesFilter) => void;
}

export interface ITableFilters
	extends ISearchFilter,
		IDatesFilter,
		IPageFilter,
		IStatusFilter {}

export interface ITableFiltersProps {
	status: IFilterStatus[]; // liste des status
	statusKey?: string; // utilisé pour utiliser un autre nom de clé que status, par exemple "type" pours les factures
	search?: false;
	searchPlaceholder?: string;
	filters: ITableFilters;
	onChange: (filter: string, value?: any) => void;
}
