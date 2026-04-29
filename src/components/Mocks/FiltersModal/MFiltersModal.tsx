import React from "react";

import * as Yup from "yup";

import { TFieldsGroup } from "@interfaces/TFields";
import { TFiltersSlice } from "@interfaces/TFiltersContext";
import { TFilterModalFilter } from "@interfaces/TFiltersModal";

import { IEditableCardProps } from "../../organisms/EditableCard/EditableCard";
import { IFormRendererProps } from "../../organisms/FormRenderer/FormRenderer";
import { Alert } from "@components/atoms";
import { Tag } from "@components/atoms";

export type TMockedUsersFilters = TFiltersSlice<{
	search?: string;
	sortOrder?: "asc" | "desc";
	location?: string | null;
	status?: string | null;
	status2?: string | null;
	status3?: string | null;
	statusMultiple?: string[] | null;
	createdFrom?: string | null;
	createdTo?: string | null;
	mobility?: string[];
	isOut?: boolean | null;
}>;

export type TMockedFilters = {
	users: TMockedUsersFilters;
	establishments: {
		search?: string;
		name?: string | null;
		type?: string | null;
	};
};

export const MOCKED_FILTERMODAL_FILTERS: TMockedFilters = {
	users: {
		status: null,
		status2: null,
		status3: null,
		statusMultiple: null,
		search: "",
		sortOrder: "asc",
		location: null,
		createdFrom: null,
		createdTo: null,
		isOut: null,
		mobility: [],
	},
	establishments: {
		name: null,
		type: null,
	},
};

const STATUS_OPTIONS = [
	{ label: "Active", value: "active" },
	{ label: "Inactive", value: "inactive" },
];

export const sampleFilters: TFieldsGroup[] = [
	{
		fields: [
			{
				name: "status",
				type: "select",
				label: "Status",
				options: STATUS_OPTIONS,
				valueDisplay: (option) => option.label,
			},
			{
				name: "status2",
				type: "select",
				label: "Filter with hidden label",
				options: STATUS_OPTIONS,
				valueDisplay: (option) => option.label,
				showFieldLabel: false,
			},
			{
				name: "status3",
				type: "select",
				label: "Filter without reset button",
				options: STATUS_OPTIONS,
				valueDisplay: (option) => option.label,
				showResetButton: false,
			},
			{
				name: "statusMultiple",
				type: "select",
				label: "Status (Multiple)",
				options: STATUS_OPTIONS,
				isMulti: true,
				renderValuesOutside: true,
				valueDisplay: (option) => option.label,
			},

			{
				name: "createdAt",
				type: "period",
				label: "Créé le",
				from: {
					name: "createdFrom",
				},
				to: {
					name: "createdTo",
				},
			},
			{
				name: "search",
				type: "input",
				label: "Search Term",
			},
			{
				name: "mobility",
				type: "checkbox",
				label: "Mobility",
				options: [
					{ label: "Remote", value: "remote" },
					{ label: "On-site", value: "on-site" },
					{ label: "Hybrid", value: "hybrid" },
				],
			},
			{
				name: "isOut",
				type: "radio",
				label: "Is Out",
				options: [
					{ label: "Yes", value: true },
					{ label: "No", value: false },
				],
				defaultValue: null,
				chip: (value) => (value === true ? "Is Out" : "Is Not Out"),
			},
			{
				name: "globalCustomFilter",
				type: "custom",
				label: "Global Custom Filter",
				value: "Custom Value",
			},
			{
				name: "localCustomFilter",
				type: "localCustom",
				label: "Local Custom Filter",
				value: "Custom Value",
				renderer: ({ value, label }: TFilterModalFilter) => (
					<div>
						<strong>{label}BLABLABLA:</strong> {value || "N/A"}
					</div>
				),
			},
		],
	},
];

export const multiColumnFilters: TFieldsGroup[] = [
	{
		title: "User Filters",
		fields: [
			{
				name: "status",
				type: "select",
				label: "Status",
				options: STATUS_OPTIONS,
				value:
					STATUS_OPTIONS.find(
						(option) =>
							option.value ===
							MOCKED_FILTERMODAL_FILTERS.users.status
					) || null,
				valueDisplay: (option) => option.label,
			},
			{
				name: "location",
				type: "input",
				label: "Location",
			},
			{
				name: "createdAt",
				type: "period",
				label: "Créé le",
				from: {
					name: "createdFrom",
				},
				to: {
					name: "createdTo",
				},
			},
		],
	},
	{
		title: "Other Filters",
		fields: [
			{
				name: "search",
				type: "input",
				label: "Search Term",
			},
		],
	},
];

export const MockedFiltersContextOptions = {
	defaultValues: {
		search: "",
	},
	countCallback: (filters: TMockedUsersFilters) => {
		let count = 0;
		if (filters.status) count++;
		if (filters.status2) count++;
		if (filters.status3) count++;
		if (filters.statusMultiple?.length) count++;
		if (filters.search) count++;
		if (filters.location) count++;
		if (filters.createdFrom || filters.createdTo) count++;
		if (filters.mobility?.length) count++;
		if (filters.isOut !== null) count++;

		return count;
	},
};

/* datas */

export type TMockedData = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	dateOfBirth: string;
	customField: string;
	nullValueField: null | string;
	emptyArrayField: any[];
	isOut: boolean;
	hasAgreement: boolean;
	status?: {
		value: "active" | "inactive";
	};
	insurance?: number;
};

export const MOCKED_DATA: TMockedData = {
	firstName: "John",
	lastName: "Doe",
	email: "john.doe@example.com",
	phone: "123-456-7890",
	dateOfBirth: "1996-11-07T00:00:00+00:00",
	customField: "",
	nullValueField: null,
	emptyArrayField: [],
	isOut: false,
	hasAgreement: false,
};

export const MOCKED_FIELDS_VALIDATION_SCHEMA = Yup.object().shape({
	firstName: Yup.string().required("First name is required"),
	lastName: Yup.string().required("Last name is required"),
	price: Yup.number()
		.typeError("Price must be a number")
		.required("Price is required"),
});

export const MOCKED_FIELDS: IEditableCardProps["fields"] = [
	{
		name: "firstName",
		type: "input",
		label: "First Name",
		required: true,
	},
	{
		name: "lastName",
		type: "input",
		label: "Last Name",
		required: true,
	},
	{
		name: "email",
		type: "input",
		label: "Email",
		displayProps: {
			info: {
				picto: "mail",
				textClassName: "!text-primary-500",
				href: `mailto:${MOCKED_DATA.email}`,
			},
		},
	},
	{
		name: "age",
		type: "quantity",
		label: "Age (this field as dynamic order depending on the editing state)",
		min: 0,
		showFieldLabel: true,
		order: (values, isEditing) => {
			return isEditing ? 2 : 0; // Affiche le champ "Age" en premier lorsqu'on n'est pas en mode édition, et en troisième position lorsqu'on est en mode édition
		},
	},
	{
		name: "hours",
		type: "time",
		label: "Hours per week",
	},
	{
		name: "file",
		type: "file",
		label: "File",
		valueDisplay: (values) => {
			return values?.file ? `${values.file?.length} file(s)` : "No files";
		},
	},
	{
		name: "multipleFiles",
		type: "file",
		label: "Files",
		maxFiles: 5,
		orientation: "horizontal",
		size: "small",
		valueDisplay: (values) => {
			return values?.multipleFiles?.length
				? `${values.multipleFiles.length} file(s)`
				: "No files";
		},
		wrapperClassName: "col-span-full",
	},
	{
		name: "price",
		type: "number",
		label: "Price",
		decimal: 4,
		step: 0.0001,
		required: true,
	},
	{
		name: "comment",
		type: "textarea",
		label: "Comment",
		minHeight: 200,
		wrapperClassName: "col-span-full",
	},
	{
		name: "insurance",
		type: "number",
		label: "Insurance",
		decimal: 2,
		step: 0.01,
		addOnEmptyValue: true, // Affiche un bouton "+ Ajouter" lorsque la valeur est vide
		beforeFieldComponent: <Alert>Before Field Component</Alert>,
		afterFieldComponent: (values: TMockedData) =>
			values.insurance ? (
				<Alert>After Field Component: {values.insurance}</Alert>
			) : null,
	},
	{
		name: "hiddenField",
		type: "input",
		label: "Hidden Field",
		hidden: true, // Ce champ ne sera pas affiché },
	},
	{
		name: "isOut",
		type: "radio",
		label: "Is Out",
		required: true,
		options: [
			{ label: "Yes", value: true },
			{ label: "No", value: false },
		],
		valueDisplay: (data: TMockedData) => (data.isOut ? "Yes" : "No"),
		showFieldLabel: true,
	},
	{
		name: "hiddenFunctionField",
		type: "input",
		label: "Hidden Function Field",
		hidden: (values: TMockedData) => {
			return values.isOut !== true; // Ce champ sera caché si "Is Out" est égal à "No"
		},
	},
	{
		name: "emptyArrayField",
		type: "input",
		label: "Empty Array Field",
	},
	{
		name: "phone",
		type: "input",
		label: "Phone",
		disabled: true, // Ce champ sera affiché mais désactivé
	},
	{
		name: "dateOfBirth",
		type: "date",
		label: "Date of Birth",
		pickerProps: {
			disabled: {
				after: new Date(),
			},
		},
	},
	{
		name: "nullValueField",
		type: "input",
		label: "Null Value Field",
	},
	{
		name: "customField",
		type: "input",
		label: "Custom Field",
		addOnEmptyValue: true, // Affiche un bouton "+ Ajouter" lorsque la valeur est vide
		displayProps: {
			info: {
				picto: "check",
			},
		},
	},
	{
		name: "status",
		label: (_: TMockedData, isEditing: boolean) =>
			isEditing ? "Status " : false,
		valueDisplay: (values) => {
			return (
				<Tag
					color={
						values?.status?.value === "active" ? "success" : "error"
					}
				>
					{values?.status?.value === "active" ? "Active" : "Inactive"}
				</Tag>
			);
		},
		type: "select",
		options: [
			{ label: "Active", value: "active" },
			{ label: "Inactive", value: "inactive" },
		],
	},
	{
		name: "hasAgreement",
		type: "toggle",
		label: "Agreement",
		valueDisplay: (data) => (data.hasAgreement ? "Accord cadre" : "-"),
	},
];
