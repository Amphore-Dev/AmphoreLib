import React, { Fragment, useState } from "react";

import { FormikContextType } from "formik";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { Button, Grid, IGridProps } from "@components/atoms";
import { IModalProps } from "@components/molecules";
import { SectionCard } from "@components/molecules/SectionCard/SectionCard";
import { SummaryListItem } from "@components/molecules/SummaryListItem/SummaryListItem";

import {
	genGroups,
	getDefaultValueDisplay,
	hasValue,
} from "@utils/UFormGroups";
import { cn } from "@utils/cn";

import { TFieldsGroup, TLabel, TSummaryListItem } from "@interfaces/index";

import {
	FormRenderer,
	FormRendererWithFormik,
	IFormRendererProps,
} from "../FormRenderer/FormRenderer";

import styles from "./EditableCard.module.scss";

const NOOP = () => {};

export interface IEditableCardProps<K = object> extends Omit<
	IFormRendererProps<K>,
	"children" | "onSubmit" | "columns" | "title"
> {
	title: React.ReactNode;
	actions?: React.ReactNode;
	className?: string;
	onSubmit?: (values: K) => Promise<void> | void;
	onCancel?: () => void;
	onClickOnEdit?: () => void;
	modalProps?: Partial<IModalProps>;
	/** Hides the built-in "Edit" button. Doesn't close the other entry points (`addOnEmptyValue`, `displayProps.*.onClick`) — for that, use `readOnly`. */
	hideEditButton?: boolean;
	/**
	 * Read-only card: hides "Edit", drops every empty-value "Add"
	 * button (even one a field re-enables via `field.addOnEmptyValue`), and
	 * disables the edit form's fields — needed for an always-editing card
	 * (`editInModal={false}` + `defaultIsEditing`), which has no display mode
	 * of its own to fall back on. Doesn't touch `displayProps.*.onClick`
	 * escape hatches the caller supplied — those stay the caller's own
	 * responsibility.
	 */
	readOnly?: boolean;
	disableFields?: boolean;
	fields: IFormRendererProps<K>["fields"];
	values?: object;
	columns?: number;
	editColumns?: number;
	editItemsColumns?: number;
	mergeGroupsForDisplay?: boolean;
	validationSchema?: IFormRendererProps<K>["validationSchema"];
	displayRequiredAsterisk?: boolean;
	editInModal?: boolean;
	/** Initial edit state. Uncontrolled — only the value at mount matters, the card manages it after. */
	defaultIsEditing?: boolean;
	addOnEmptyValue?: boolean;
	/** Uses `FormRendererWithFormik` for the edit form (live validation, dependent fields...). Off falls back to plain `FormRenderer`. */
	formikWrapper?: boolean;
	displayGridProps?: IGridProps;
	/** Label for the built-in "Edit" button. Defaults to "Edit" (or `common.edit`/`EditableCard.editLabel` from the nearest AmphoreProvider — see useAmphoreLabels). */
	editLabel?: TLabel;
	/** Label for each empty-value "Add" button. Defaults to "Add" (or `common.add`/`EditableCard.addLabel` from the nearest AmphoreProvider). */
	addLabel?: TLabel;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TEditableCardLabels = Pick<
	IEditableCardProps,
	"editLabel" | "addLabel"
>;

export const EditableCard: React.FC<IEditableCardProps> = ({
	title,
	fields,
	actions,
	className,
	modalProps,
	onSubmit = () => {},
	onCancel,
	onClickOnEdit,
	hideEditButton,
	readOnly = false,
	values = {},
	columns = 4,
	editColumns = 1,
	editItemsColumns = 1,
	mergeGroupsForDisplay = true,
	validationSchema,
	displayRequiredAsterisk = true,
	editInModal = true,
	defaultIsEditing,
	disableFields,
	addOnEmptyValue = true,
	formikWrapper = true,
	displayGridProps,
	editLabel: editLabelProp,
	addLabel: addLabelProp,
	...editModalProps
}) => {
	const { resolve } = useAmphoreLabels("EditableCard");
	const editLabel = resolve("editLabel", editLabelProp, "edit");
	const addLabel = resolve("addLabel", addLabelProp, "add");
	const shouldHideEditButton = readOnly || !!hideEditButton;
	const [isEditing, setIsEditing] = useState(defaultIsEditing ?? false);

	const handleClose = () => {
		setIsEditing(false);
		onCancel?.();
	};

	const handleSubmit = (newValues: object) =>
		Promise.resolve(onSubmit(newValues)).then(() => setIsEditing(false));

	const FormWrapperComponent = formikWrapper
		? FormRendererWithFormik
		: FormRenderer;

	return (
		<SectionCard
			className={cn([styles.card, className])}
			title={title}
			actions={
				<>
					{actions}
					{!shouldHideEditButton && (
						<Button
							color="neutral"
							variant="outline"
							size="sm"
							picto="edit"
							className={cn([
								styles.editBtn,
								isEditing &&
									!editInModal &&
									styles.editBtnHidden,
							])}
							onClick={() => {
								setIsEditing(!isEditing);
								onClickOnEdit?.();
							}}
						>
							{editLabel}
						</Button>
					)}
				</>
			}
		>
			{(editInModal || !isEditing) && (
				<DisplayFields
					fields={fields}
					data={values}
					columns={columns}
					mergeForDisplay={mergeGroupsForDisplay}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					displayRequiredAsterisk={displayRequiredAsterisk}
					addOnEmptyValue={addOnEmptyValue}
					readOnly={readOnly}
					gridProps={displayGridProps}
					addLabel={addLabel}
				/>
			)}

			{isEditing && (
				<FormWrapperComponent
					title={title as string}
					fields={fields}
					showFieldLabels
					validationSchema={validationSchema}
					modalProps={modalProps}
					{...editModalProps}
					disableFields={readOnly || disableFields}
					wrapperGridProps={{
						columns: editColumns,
						...editModalProps.wrapperGridProps,
					}}
					columns={editItemsColumns}
					initialValues={{
						...values,
						...(editModalProps.initialValues || {}),
					}}
					onSubmit={handleSubmit}
					open={isEditing}
					onClose={handleClose}
					inModal={editInModal}
				/>
			)}
		</SectionCard>
	);
};

interface IDisplayFieldsProps {
	fields?: IFormRendererProps["fields"];
	data?: object;
	columns?: number;
	mergeForDisplay?: boolean;
	isEditing?: boolean;
	setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
	displayRequiredAsterisk?: boolean;
	addOnEmptyValue?: boolean;
	/** Drops the "Add" buttons — display-only, entering edit is the caller's job elsewhere. */
	readOnly?: boolean;
	gridProps?: IGridProps;
	addLabel: string;
}

const DisplayFields: React.FC<IDisplayFieldsProps> = ({
	fields,
	data = {},
	columns = 4,
	mergeForDisplay = true,
	isEditing = false,
	setIsEditing = NOOP,
	displayRequiredAsterisk = true,
	addOnEmptyValue = false,
	readOnly = false,
	gridProps,
	addLabel,
}) => {
	if (!fields) return null;

	const result =
		typeof fields === "function"
			? fields({ values: {} } as FormikContextType<object>, isEditing)
			: fields;

	const groups: TFieldsGroup[] = genGroups(result, mergeForDisplay);

	// One field -> one <div style={{order}}><SummaryListItem/></div>, same
	// for every group regardless of merge mode — only how the *groups*
	// themselves get assembled differs below.
	const renderGroupFields = (group: TFieldsGroup) => {
		const groupFields =
			typeof group.fields === "function"
				? group.fields(false)
				: group.fields;

		let orderIndex = 1;

		return groupFields.map((field) => {
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

			const order = field.order ? field.order(data, false) : orderIndex++;
			const value = (data as Record<string, unknown>)[field.name];
			const displayedValue = field.valueDisplay
				? field.valueDisplay(data)
				: (getDefaultValueDisplay(field.type, value) ??
					(hasValue(value) ? (value as React.ReactNode) : "-"));

			const displayProps =
				typeof field.displayProps === "function"
					? field.displayProps({
							isEditing: !!isEditing,
							setIsEditing,
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
			) as string;

			const showAddButton =
				!readOnly &&
				((addOnEmptyValue && field.addOnEmptyValue !== false) ||
					field.addOnEmptyValue) &&
				!hasValue(value);

			const resolvedValue: React.ReactNode = showAddButton ? (
				<Button
					variant="link"
					size="sm"
					picto="add"
					onClick={() => setIsEditing(true)}
				>
					{addLabel}
				</Button>
			) : (
				displayedValue
			);

			const item: TSummaryListItem = {
				label: displayedLabel,
				value: resolvedValue,
				required: displayRequiredAsterisk && field.required,
				picto: displayProps?.info?.picto,
				maxLines: displayProps?.info?.maxLines ?? 2,
				// The add-button case renders its own <Button> as
				// `value` below — giving the item its own onClick
				// too would wrap that button in another native
				// <button> (invalid HTML, double-fires the click).
				onClick:
					!showAddButton && displayProps?.info?.onClick
						? () =>
								displayProps?.info?.onClick?.({
									setIsEditing,
									isEditing,
									value,
								})
						: undefined,
				action: displayProps?.action
					? {
							label: displayProps.action.label,
							picto: displayProps.action.picto,
							onClick: () =>
								displayProps?.action?.onClick?.({
									setIsEditing,
									isEditing,
									value,
								}),
						}
					: undefined,
			};

			return (
				<div
					key={field.name}
					className={displayProps?.className}
					style={{ order }}
				>
					<SummaryListItem {...item} />
				</div>
			);
		});
	};

	// Merged: one flat Grid, every field from every group as its own direct
	// child (flatMap — a field's own `order` only needs to make sense
	// within this single shared context).
	if (mergeForDisplay) {
		return (
			<Grid
				columns={columns}
				minItemWidth="200px"
				gap="1rem 2rem"
				{...gridProps}
				className={cn([styles.fieldsMerged, gridProps?.className])}
			>
				{groups.flatMap(renderGroupFields)}
			</Grid>
		);
	}

	// Not merged: each group gets its *own* Grid instance — its own layout
	// context, so a field's `order` (reset to 1 per group) only reorders
	// within that group, never bleeding into a sibling's. Stacked full-width
	// by a plain flex-column wrapper: giving the outer Grid these group
	// blocks as direct children (the previous approach) makes each block
	// *one* grid/flex item — one column wide, several fitting side by side
	// per row up to `columns` — instead of a full-width row of its own.
	return (
		<div className={cn([styles.fields, gridProps?.className])}>
			{groups.map((group, index) => (
				<Grid
					key={group.title || `field-group-${index}`}
					columns={columns}
					minItemWidth="200px"
					gap="1rem 2rem"
					{...gridProps}
					className={styles.fieldsGroup}
				>
					{renderGroupFields(group)}
				</Grid>
			))}
		</div>
	);
};
