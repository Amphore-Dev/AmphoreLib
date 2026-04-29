import React, { Fragment, useState } from "react";

import { FormikContextType } from "formik";
import { useTranslation } from "react-i18next";

import { TFieldsGroup } from "@interfaces/TFields";

import {
	FormRenderer,
	FormRendererWithFormik,
	IFormRendererProps,
	IModal,
} from "../FormRenderer/FormRenderer";
import { Button } from "@components/atoms";
import { Grid, IGridProps } from "@components/atoms";
import {
	DescriptionList,
	IDescriptionListProps,
	SectionCard,
} from "@components/molecules";

import { genGroups } from "@utils/UEditModal";
import { cn } from "@utils/cn";
import { hasValue } from "@utils/objects";

import "./EditableCard.scss";

export interface IEditableCardProps<K = object> extends Omit<
	IFormRendererProps<K>,
	"children" | "onSubmit" | "columns"
> {
	title: IModal["title"];
	actions?: React.ReactNode;
	className?: string;
	onSubmit?: (values: K) => Promise<void> | void;
	onCancel?: () => void;
	onClickOnEdit?: () => void;
	modalProps?: Partial<IModal>;
	disabled?: boolean;
	fields: IFormRendererProps<K>["fields"];
	values?: object;
	columns?: number;
	editColumns?: number;
	editItemsColumns?: number;
	mergeGroupsForDisplay?: boolean;
	validationSchema?: IFormRendererProps<K>["validationSchema"];
	displayRequiredAsterisk?: boolean;
	editInModal?: boolean;
	isEditing?: boolean;
	addOnEmptyValue?: boolean;
	formikWrapper?: boolean;
	displayGridProps?: IGridProps;
}

export const EditableCard: React.FC<IEditableCardProps> = ({
	title,
	fields,
	actions,
	className,
	modalProps,
	onSubmit = () => {},
	onCancel,
	onClickOnEdit,
	disabled = false,
	values = {},
	columns = 4,
	editColumns = 1,
	editItemsColumns = 1,
	mergeGroupsForDisplay = true,
	validationSchema,
	displayRequiredAsterisk = true,
	editInModal = true,
	isEditing = false,
	addOnEmptyValue = true,
	formikWrapper = true,
	displayGridProps,
	...editModalProps
}) => {
	const { t } = useTranslation();
	const [IsEditing, setIsEditing] = useState(isEditing);

	const handleClose = () => {
		setIsEditing(false);
		onCancel?.();
	};

	const handleSubmit = (newValues: object) => {
		return Promise.resolve(onSubmit(newValues)).then(() => {
			setIsEditing(false);
		});
	};

	const FormWrapperComponent = formikWrapper
		? FormRendererWithFormik
		: FormRenderer;

	return (
		<SectionCard
			className={cn(["al__editable-card", className])}
			title={title}
			actions={
				<>
					{actions}
					{!disabled && (
						<Button
							color="transparent"
							size="s"
							picto="edit"
							className={cn([
								"al__editable-card__edit-btn",
								IsEditing &&
									!editInModal &&
									"al__editable-card__edit-btn--hidden",
							])}
							onClick={() => {
								setIsEditing(!IsEditing);
								onClickOnEdit?.();
							}}
						>
							<span>{t("global.edit")}</span>
						</Button>
					)}
				</>
			}
		>
			{(editInModal || !IsEditing) && (
				<Fields
					fields={fields}
					data={values}
					columns={columns}
					mergeForDisplay={mergeGroupsForDisplay}
					isEditing={IsEditing}
					setIsEditing={setIsEditing}
					displayRequiredAsterisk={displayRequiredAsterisk}
					addOnEmptyValue={addOnEmptyValue}
					gridProps={displayGridProps}
				/>
			)}

			{IsEditing && (
				<FormWrapperComponent
					title={title}
					fields={fields}
					showFieldLabels={false}
					validationSchema={validationSchema}
					modalProps={modalProps}
					{...editModalProps}
					wrapperGridProps={{ columns: editColumns }}
					columns={editItemsColumns}
					initialValues={{
						...values,
						...(editModalProps.initialValues || {}),
					}}
					onSubmit={handleSubmit}
					isOpen={IsEditing}
					onClose={handleClose}
					inModal={editInModal}
				/>
			)}
		</SectionCard>
	);
};

interface IFieldsProps {
	fields?: IFormRendererProps["fields"];
	data?: object;
	columns?: number;
	mergeForDisplay?: boolean;
	isEditing?: boolean;
	setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
	displayRequiredAsterisk?: boolean;
	addOnEmptyValue?: boolean;
	gridProps?: IGridProps;
}

const Fields: React.FC<IFieldsProps> = ({
	fields,
	data = {},
	columns = 4,
	mergeForDisplay = true,
	isEditing = false,
	setIsEditing,
	displayRequiredAsterisk = true,
	addOnEmptyValue = false,
	gridProps,
}) => {
	const { t } = useTranslation();
	if (!fields) return null;

	const result =
		typeof fields === "function"
			? fields({ values: {} } as FormikContextType<object>, isEditing)
			: fields;

	const groups: TFieldsGroup[] = genGroups(result, mergeForDisplay);

	const GroupWrapper = mergeForDisplay ? Fragment : "div";
	const GroupWrapperProps = mergeForDisplay
		? {}
		: {
				className: "al__editable-card__fields-group",
				style: {
					gridTemplateColumns:
						"repeat(auto-fill, minmax(max(var(--grid-item-min-width), var(--grid-item-max-width)), 1fr))",
					gridGap: "var(--grid-layout-gap)",
				},
			};

	return (
		<Grid
			columns={columns}
			minItemWidth="200px"
			gap="1rem"
			{...gridProps}
			className={cn([
				!mergeForDisplay
					? "al__editable-card__fields"
					: "al__editable-card__fields--merged",
				gridProps?.className,
			])}
		>
			{groups.map((group, index) => {
				const groupFields =
					typeof group.fields === "function"
						? group.fields(false)
						: group.fields;

				let orderIndex = 1;
				return (
					<GroupWrapper
						key={group.title || `field-group-${index}`}
						{...GroupWrapperProps}
					>
						{groupFields.map((field) => {
							if (
								typeof field.hidden === "function"
									? field.hidden(data, false)
									: field.hidden
							)
								return null;

							if (field.valueRenderer) {
								return (
									<Fragment key={field.name}>
										{field.valueRenderer(data)}
									</Fragment>
								);
							}

							const order = field.order
								? field.order(data, false)
								: orderIndex++;
							const value = data[field.name as keyof typeof data];
							const displayedValue = field.valueDisplay
								? field.valueDisplay(data)
								: data && hasValue(value)
									? value
									: "-";

							const displayProps =
								typeof field.displayProps === "function"
									? field.displayProps({
											isEditing: !!isEditing,
											setIsEditing:
												setIsEditing || (() => {}),
											value,
										})
									: field.displayProps || {};

							const displayedLabel = (
								typeof field.label === "function"
									? field.label(
											{
												values: data,
											} as FormikContextType<object>,
											false
										)
									: field.label || field.name
							) as IDescriptionListProps["label"];

							const addButton =
								((addOnEmptyValue &&
									field.addOnEmptyValue !== false) ||
									field.addOnEmptyValue) &&
								!hasValue(value)
									? {
											text: t("global.add"),
											picto: "add",
											pictoClassName:
												"al__editable-card__add-btn-picto",
											onClick: () => setIsEditing?.(true),
										}
									: { text: displayedValue };

							const infos = {
								...displayProps?.info,
								onClick: displayProps?.info?.onClick
									? () => {
											displayProps?.info?.onClick?.({
												setIsEditing,
												isEditing,
												value,
											});
										}
									: undefined,
								...addButton,
							} as IDescriptionListProps["info"];

							return (
								<DescriptionList
									key={field.name}
									label={displayedLabel}
									info={infos}
									style={{ order }}
									action={
										displayProps?.action
											? {
													...displayProps.action,
													onClick: displayProps.action
														.onClick
														? () => {
																displayProps.action?.onClick?.(
																	{
																		setIsEditing,
																		isEditing,
																		value,
																	}
																);
															}
														: undefined,
												}
											: undefined
									}
									required={
										displayRequiredAsterisk &&
										field.required
									}
									className={displayProps?.className}
								/>
							);
						})}
					</GroupWrapper>
				);
			})}
		</Grid>
	);
};
