import React, { ChangeEvent, useState } from "react";

import { useTranslation } from "react-i18next";

import { TFieldRendererMap } from "@interfaces/TFields";

import {
	Button,
	IButtonProps,
	IInputSearchProps,
	InputSearch,
	Link,
} from "@components/atoms";
import { ActiveFilters, ITabBarProps, TabBar } from "@components/molecules";
import { FiltersModal, IFiltersModalProps } from "@components/organisms/";

import { cn } from "@utils/cn";

import "./PageHeader.scss";

type THeaderButton = IButtonProps & {
	hidden?: boolean;
};

type TPageHeaderFilters = {
	filters?: IFiltersModalProps<any, any>["filters"];
	filtersContext?: IFiltersModalProps<any, any>["filtersContext"];
	searchValue?: string;
	onSearchChange?: (
		value: string | null,
		e?: ChangeEvent<HTMLInputElement>
	) => void;
	fieldsRenderers?: Partial<TFieldRendererMap>;
	onFiltersChange?: (filters: any) => void;
	searchInputProps?: Partial<IInputSearchProps>;
};

type TPageHeaderTab = ITabBarProps["tabs"][number] &
	Partial<Omit<IPageHeaderProps, "tabs">> &
	TPageHeaderFilters & {
		hidden?: boolean;
	};

type TTabBarProps = Partial<Omit<ITabBarProps, "tabs">> & {
	tabs?: TPageHeaderTab[];
	useTabTitleAsPageTitle?: boolean;
	initialTabId?: string;
};

export interface IPageHeaderProps extends TTabBarProps, TPageHeaderFilters {
	title?: React.ReactNode;
	titleAfter?: React.ReactNode;
	buttons?: THeaderButton[];
	secondaryButtons?: THeaderButton[];
	className?: string;
	isLoading?: boolean;
	totalCount?: number;
	onBack?: () => void;
	onBackLabel?: string;
	countMessage?: string;
}

export const PageHeader: React.FC<IPageHeaderProps> = ({
	title,
	buttons,
	secondaryButtons,
	className,
	filtersContext,
	searchValue,
	onSearchChange,
	searchInputProps,
	isLoading,
	totalCount,
	countMessage,
	filters,
	tabs,
	fieldsRenderers,
	onBack,
	onBackLabel,
	onFiltersChange,
	titleAfter,
	...props
}) => {
	const { t } = useTranslation();
	const [InternalTabState, setInternalTabState] = useState(
		props?.initialTabId || props?.selectedTabId || tabs?.[0]?.id || null
	);

	const ActiveTab =
		props.selectedTabId !== undefined
			? props.selectedTabId
			: InternalTabState;

	const setActiveTab =
		props.onSelectTab !== undefined
			? props.onSelectTab
			: setInternalTabState;

	const activeTabItem = tabs?.find((t) => t.id === ActiveTab);

	const activeFilters = activeTabItem?.filters || filters;
	const activeFiltersContext =
		activeTabItem?.filtersContext || filtersContext;

	const activeSearch = {
		value: activeTabItem?.searchValue ?? searchValue,
		onChange: activeTabItem?.onSearchChange ?? onSearchChange,
		...activeTabItem?.searchInputProps,
		...searchInputProps,
	};
	const activeButtons = activeTabItem?.buttons || buttons;
	const activeSecondaryButtons =
		activeTabItem?.secondaryButtons || secondaryButtons;

	const genHeaderActions = () => {
		if (
			!activeButtons?.length &&
			!activeSecondaryButtons?.length &&
			!activeFilters &&
			!activeSearch.onChange
		)
			return null;
		return (
			<div className="al__page-header__actions">
				{!!activeSecondaryButtons?.length && (
					<div className="al__page-header__buttons">
						{activeSecondaryButtons.map(
							(button, index) =>
								!button.hidden && (
									<Button key={index} {...button} />
								)
						)}
					</div>
				)}

				{!!activeFilters && (
					<FiltersModal
						filters={activeFilters}
						filtersContext={activeFiltersContext}
						key={activeFiltersContext?.filtersKey}
						fieldsRenderers={{
							...activeFiltersContext?.fieldRenderers,
							...fieldsRenderers,
						}}
						onApply={onFiltersChange}
					/>
				)}

				{!!activeSearch.onChange && (
					<div className="al__page-header__search">
						<InputSearch
							key={`${activeTabItem?.id || "default"}-search-input`}
							name="page-header-search"
							label={t("search.label")}
							debounced={true}
							delay={500}
							minLength={3}
							size="s"
							{...activeSearch}
							onChange={activeSearch.onChange}
							value={activeSearch.value}
						/>
					</div>
				)}

				{!!activeButtons?.length && (
					<div className="al__page-header__buttons">
						{activeButtons.map(
							(button, index) =>
								!button.hidden && (
									<Button key={index} {...button} />
								)
						)}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className={cn(["al__page-header", className])}>
			{onBack && (
				<Link
					onClick={onBack}
					aria-label={onBackLabel || t("global.back")}
					className="al__page-header__back-button"
					picto="chevron"
					pictoProps={{
						rotation: 180,
						className: "al__page-header__back-button__picto",
					}}
					pictoClassName="al__page-header__back-button__picto"
					label={onBackLabel || t("global.back")}
				/>
			)}
			<div
				className={cn([
					"al__page-header__top",
					tabs?.length
						? "al__page-header__top--with-tabs"
						: "al__page-header__top--no-tabs",
				])}
			>
				<div className="al__page-header__left-content">
					<div className="al__page-header__title-block">
						<h1 className="al__page-header__title">{title}</h1>
						{titleAfter && (
							<div className="al__page-header__title-after">
								{titleAfter}
							</div>
						)}
					</div>
					<p className="al__page-header__subtitle">
						{isLoading
							? t("global.loading")
							: totalCount !== undefined
								? countMessage ||
									t("results.count", { count: totalCount })
								: null}
					</p>
				</div>

				{tabs ? (
					<div className="al__page-header__tabs">
						<TabBar
							tabs={tabs.filter((tab) => !tab.hidden) || []}
							activeTab={activeTabItem?.id}
							onChange={setActiveTab}
						/>
					</div>
				) : null}

				<div className="al__page-header__actions-row">
					{tabs ? (
						<ActiveFilters
							filtersContext={activeFiltersContext}
							filters={
								typeof activeFilters === "function"
									? activeFilters(
											activeFiltersContext?.filters
										)
									: activeFilters
							}
							className="al__page-header__active-filters"
							key={activeTabItem?.id}
							rightContent={genHeaderActions()}
						/>
					) : (
						genHeaderActions()
					)}
				</div>
			</div>

			{!tabs && (
				<div className="al__page-header__bottom-active-filters">
					<ActiveFilters
						filtersContext={filtersContext}
						filters={
							typeof filters === "function"
								? filters(filtersContext?.filters)
								: filters
						}
					/>
				</div>
			)}
		</div>
	);
};
