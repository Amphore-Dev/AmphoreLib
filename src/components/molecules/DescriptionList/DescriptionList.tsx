import React from "react";

import { TFieldDisplayProps } from "@interfaces/TFields";

import { Button, Link, Picto, TruncatedTooltipText } from "@components/atoms";

import { cn } from "@utils/cn";

import "./DescriptionList.scss";

export interface IDescriptionListProps extends TFieldDisplayProps {
	label: string;
	required?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

export const DescriptionList: React.FC<IDescriptionListProps> = ({
	label,
	required,
	info,
	action,
	className,
	style,
}) => {
	const onClick = info?.onClick || action?.onClick;

	const wrapperClassNames = cn([
		"al__description-list",
		onClick && "al__description-list--clickable",
		className,
	]);

	const pictoClassNames = cn([
		"al__description-list__picto",
		info?.onClick && "al__description-list__picto--clickable",
		info?.pictoClassName,
	]);

	const linkClassNames = cn([
		"al__description-list__link",
		info?.isUnderlined && "al__description-list__link--underlined",
		info?.textClassName,
		info?.href && !info.onClick && "al__description-list__link--with-href",
	]);

	return (
		<div
			className={wrapperClassNames}
			onClick={onClick}
			role={onClick ? "button" : undefined}
			onKeyDown={(e) => {
				if (["Enter", " "].includes(e.key) && onClick) {
					onClick();
				}
			}}
			style={style}
		>
			<p className="al__description-list__label">
				{label}
				{!!label && required && (
					<span className="al__description-list__required-text">
						*
					</span>
				)}
			</p>
			{info && (
				<div className="al__description-list__info-wrapper">
					{info.onClick || info.href ? (
						<Link
							label={info.text}
							picto={info.picto}
							className={linkClassNames}
							pictoClassName={pictoClassNames}
							pictoProps={info.pictoProps}
							href={info.href}
						/>
					) : (
						<>
							{info.picto && (
								<Picto
									icon={info.picto}
									className={pictoClassNames}
									{...info.pictoProps}
								/>
							)}
							{info.maxLines ? (
								<TruncatedTooltipText
									maxLines={info.maxLines}
									className={cn([
										"al__description-list__text",
										info.textClassName,
									])}
									tooltipProps={{
										portal: true,
										floatingProps: {
											placement: "top",
										},
									}}
								>
									{info.text}
								</TruncatedTooltipText>
							) : (
								<p
									className={cn([
										"al__description-list__text",
										info.textClassName,
									])}
								>
									{info.text}
								</p>
							)}
						</>
					)}
				</div>
			)}
			{action && (
				<Button
					color="transparent"
					picto={
						action.picto
							? {
									icon: action.picto,
									className: action.pictoClassName,
									...action.pictoProps,
								}
							: undefined
					}
					{...action.buttonProps}
					className={cn([
						"al__description-list__button",
						action.buttonProps?.className,
					])}
				>
					{action.label}
				</Button>
			)}
		</div>
	);
};
