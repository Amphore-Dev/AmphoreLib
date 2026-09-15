import React, { useState } from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import {
	Button,
	IButtonProps,
	IInputSearchProps,
	InputSearch,
} from "@components/atoms";
import { ActiveFilters, Tabs } from "@components/molecules";
import { FiltersModal, IFiltersModalProps } from "@components/organisms";

import { genGroups } from "@utils/UFormGroups";
import { cn } from "@utils/cn";

import {
	IUseFiltersContext,
	TFieldRendererMap,
	TFiltersModalGroup,
	TFiltersSlice,
	TLabel,
	TTabItem,
} from "@interfaces/index";

import styles from "./PageHeader.module.scss";

type THeaderButton = IButtonProps & { hidden?: boolean; key?: React.Key };

/**
 * PageHeader is the outer-most consumer of the filters system — it doesn't
 * know (or need to know) any app's concrete slice shape, only that it's
 * *some* `TFiltersSlice`. `unknown`-in-generic-position rather than `any`:
 * still type-erased where it has to be, but doesn't silently accept
 * anything unrelated to the shapes `IUseFiltersContext`/`FiltersModal`
 * actually expect.
 */
type TAnyFiltersSlice = TFiltersSlice<object>;
type TAnyFiltersContext = IUseFiltersContext<
	Record<string, TAnyFiltersSlice>,
	string
>;

type TPageHeaderFilters = {
	filters?: IFiltersModalProps<
		Record<string, TAnyFiltersSlice>,
		string
	>["filters"];
	filtersContext?: TAnyFiltersContext;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	fieldsRenderers?: Partial<TFieldRendererMap>;
	onFiltersChange?: (filters: TAnyFiltersSlice) => void;
	searchInputProps?: Partial<IInputSearchProps>;
};

/** A tab that can override any of the header's per-tab-scoped props (filters/search/actions/buttons) while it's the active one. */
export type TPageHeaderTab<Value extends string = string> = TTabItem<Value> &
	TPageHeaderFilters &
	Pick<IPageHeaderProps, "actions" | "buttons" | "secondaryButtons"> & {
		hidden?: boolean;
	};

/**
 * Position of the actions row (buttons/filters/search) relative to the tab
 * strip:
 * - `underTabs` (default): actions are per-tab, only apply to the active one.
 * - `aboveTabs`: actions are shared across every tab.
 *
 * No effect without `tabs`.
 */
export type TPageHeaderActionsPosition = "aboveTabs" | "underTabs";

export interface IPageHeaderProps extends TPageHeaderFilters {
	title?: React.ReactNode;
	titleAfter?: React.ReactNode;
	/** Free-form content at the head of the actions row, before `buttons`. */
	actions?: React.ReactNode[];
	buttons?: THeaderButton[];
	secondaryButtons?: THeaderButton[];
	actionsPosition?: TPageHeaderActionsPosition;
	className?: string;
	isLoading?: boolean;
	totalCount?: number;
	onBack?: () => void;
	/** aria-label and text for the back button. Defaults to "Back" (or `common.back`/`PageHeader.onBackLabel` from the nearest AmphoreProvider — see useAmphoreLabels). No effect without `onBack`. */
	onBackLabel?: TLabel;
	countMessage?: string;
	/** Subtitle shown instead of `countMessage` while `isLoading`. Defaults to "Loading..." (or `PageHeader.loadingLabel` from the nearest AmphoreProvider). No commonKey — the ellipsis makes it differ from the bare "Loading" in `common`. */
	loadingLabel?: TLabel;
	tabs?: TPageHeaderTab[];
	selectedTabId?: string;
	onSelectTab?: (value: string) => void;
	initialTabId?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TPageHeaderLabels = Pick<
	IPageHeaderProps,
	"loadingLabel" | "onBackLabel"
>;

export const PageHeader: React.FC<IPageHeaderProps> = ({
	title,
	actions,
	buttons,
	secondaryButtons,
	actionsPosition = "underTabs",
	className,
	filtersContext,
	searchValue,
	onSearchChange,
	searchInputProps,
	isLoading,
	totalCount,
	countMessage,
	loadingLabel: loadingLabelProp,
	filters,
	tabs,
	fieldsRenderers,
	onBack,
	onBackLabel: onBackLabelProp,
	onFiltersChange,
	titleAfter,
	selectedTabId,
	onSelectTab,
	initialTabId,
}) => {
	const { resolve } = useAmphoreLabels("PageHeader");
	const loadingLabel = resolve("loadingLabel", loadingLabelProp);
	const onBackLabel = resolve("onBackLabel", onBackLabelProp, "back");

	const [internalTab, setInternalTab] = useState<string | null>(
		initialTabId ?? selectedTabId ?? tabs?.[0]?.value ?? null
	);

	const activeTabValue =
		selectedTabId !== undefined ? selectedTabId : internalTab;
	const setActiveTab = onSelectTab ?? setInternalTab;

	const visibleTabs = tabs?.filter((tab) => !tab.hidden) ?? [];
	const activeTab = visibleTabs.find((tab) => tab.value === activeTabValue);

	const activeFilters = activeTab?.filters ?? filters;
	const activeFiltersContext = activeTab?.filtersContext ?? filtersContext;
	const activeSearch = {
		value: activeTab?.searchValue ?? searchValue,
		onChange: activeTab?.onSearchChange ?? onSearchChange,
		...activeTab?.searchInputProps,
		...searchInputProps,
	};
	const activeButtons = activeTab?.buttons ?? buttons;
	const activeSecondaryButtons =
		activeTab?.secondaryButtons ?? secondaryButtons;
	const activeActions = activeTab?.actions ?? actions;

	const renderActions = () => {
		if (
			!activeActions?.length &&
			!activeButtons?.length &&
			!activeSecondaryButtons?.length &&
			!activeFilters &&
			!activeSearch.onChange
		)
			return null;

		return (
			<div className={styles.actions}>
				{!!activeActions?.length && (
					<div className={styles.customActions}>
						{activeActions.map((action, index) => (
							<React.Fragment key={index}>
								{action}
							</React.Fragment>
						))}
					</div>
				)}

				{!!activeSecondaryButtons?.length && (
					<div className={styles.buttons}>
						{activeSecondaryButtons.map(
							({ hidden, key, ...button }, index) =>
								!hidden && (
									<Button key={key ?? index} {...button} />
								)
						)}
					</div>
				)}

				{!!activeFilters && (
					<FiltersModal
						filters={activeFilters}
						filtersContext={activeFiltersContext}
						key={activeFiltersContext?.filtersKey?.toString()}
						fieldsRenderers={{
							...activeFiltersContext?.fieldRenderers,
							...fieldsRenderers,
						}}
						onApply={onFiltersChange}
					/>
				)}

				{!!activeSearch.onChange && (
					<div className={styles.search}>
						<InputSearch
							key={`${activeTab?.value ?? "default"}-search`}
							name="page-header-search"
							placeholder="Search"
							{...activeSearch}
							onChange={activeSearch.onChange}
							value={activeSearch.value}
						/>
					</div>
				)}

				{!!activeButtons?.length && (
					<div className={styles.buttons}>
						{activeButtons.map(
							({ hidden, key, ...button }, index) =>
								!hidden && (
									<Button key={key ?? index} {...button} />
								)
						)}
					</div>
				)}
			</div>
		);
	};

	const areActionsUnderTabs = !!tabs && actionsPosition !== "aboveTabs";

	const tabBar = tabs ? (
		<Tabs
			items={visibleTabs}
			value={activeTab?.value ?? ""}
			onChange={setActiveTab}
		/>
	) : null;

	const resolvedFilters =
		typeof activeFilters === "function"
			? activeFilters(activeFiltersContext?.filters as never, undefined)
			: activeFilters;
	// `ActiveFilters` wants a normalized `TFiltersModalGroup[]` — `resolvedFilters`
	// may still be a flat `TField[]` at this point.
	const activeFiltersList = (
		resolvedFilters ? genGroups(resolvedFilters) : []
	) as TFiltersModalGroup[];

	return (
		<div className={cn([styles.header, className])}>
			{onBack && (
				<Button
					onClick={onBack}
					aria-label={onBackLabel}
					className={styles.backButton}
					variant="link"
					color="neutral"
					picto={{
						icon: "chevron",
						rotation: 180,
					}}
				>
					{onBackLabel}
				</Button>
			)}
			<div
				className={cn([
					styles.top,
					areActionsUnderTabs && !!visibleTabs.length
						? styles.topWithTabs
						: styles.topNoTabs,
				])}
			>
				<div className={styles.leftContent}>
					<div className={styles.titleBlock}>
						<h1 className={styles.title}>{title}</h1>
						{titleAfter && (
							<div className={styles.titleAfter}>
								{titleAfter}
							</div>
						)}
					</div>
					<p className={styles.subtitle}>
						{isLoading
							? loadingLabel
							: totalCount !== undefined
								? (countMessage ??
									`${totalCount} result${totalCount > 1 ? "s" : ""}`)
								: null}
					</p>
				</div>

				{areActionsUnderTabs && (
					<div className={styles.tabsRow}>{tabBar}</div>
				)}

				<div className={styles.actionsRow}>
					{areActionsUnderTabs ? (
						<ActiveFilters
							filtersContext={activeFiltersContext}
							filters={activeFiltersList}
							className={styles.activeFilters}
							key={activeTab?.value}
							rightContent={renderActions()}
						/>
					) : (
						renderActions()
					)}
				</div>
			</div>

			{!areActionsUnderTabs && (
				<div className={styles.bottomActiveFilters}>
					<ActiveFilters
						filtersContext={activeFiltersContext}
						filters={activeFiltersList}
					/>
				</div>
			)}

			{!!tabs && !areActionsUnderTabs && (
				<div className={styles.tabsUnderActions}>{tabBar}</div>
			)}
		</div>
	);
};
