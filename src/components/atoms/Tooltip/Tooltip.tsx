import React, { PropsWithChildren, ReactElement } from "react";

import {
	FloatingPortal,
	safePolygon,
	useClick,
	UseClickProps,
	useFloating,
	useHover,
	UseHoverProps,
	useInteractions,
	arrow,
	FloatingArrow,
	flip,
	shift,
	offset,
	UseFloatingOptions,
} from "@floating-ui/react";

export interface ITooltipProps extends PropsWithChildren {
	content: ReactElement;
	trigger: "click" | "hover";
	closeOnLeave: boolean;
	className?: string;
	floatingProps?: UseFloatingOptions;
	hoverHookProps?: UseHoverProps;
	clickHookProps?: UseClickProps;
	isOpen?: boolean;
	setIsOpen?: (isOpen: boolean) => void;
	portal?: boolean;
}

export const Tooltip: React.FC<ITooltipProps> = ({
	children,
	content = <div>Tooltip</div>,
	trigger = "click",
	closeOnLeave = true,
	className,
	floatingProps = {} as UseFloatingOptions,
	hoverHookProps = {},
	clickHookProps = {},
	isOpen,
	setIsOpen,
	portal,
}) => {
	const isHover = trigger === "hover";
	const [IsOpen, SetIsOpen] = React.useState(false);

	const isOpenValue = isOpen ?? IsOpen;
	const setIsOpenValue = setIsOpen ?? SetIsOpen;

	const arrowRef = React.useRef<SVGSVGElement>(null);

	const { middleware, ...floatingOptions } = floatingProps;
	const { refs, context, floatingStyles } = useFloating({
		open: isOpenValue,
		onOpenChange: setIsOpenValue,
		middleware: [
			arrow({
				element: arrowRef,
			}),
			flip(),
			shift(),
			offset(3),
			...(middleware ?? []),
		],
		...floatingOptions,
	});

	const hook = isHover
		? useHover(context, {
				handleClose: !closeOnLeave
					? safePolygon({
							buffer: -Infinity,
						})
					: undefined,
				...hoverHookProps,
			})
		: useClick(context, clickHookProps);

	const { getReferenceProps, getFloatingProps } = useInteractions([hook]);

	const Wrapper = portal ? FloatingPortal : React.Fragment;

	return (
		<>
			<div
				ref={refs.setReference}
				{...getReferenceProps()}
				onClick={() => {
					if (!isHover) {
						setIsOpenValue(!isOpenValue);
					}
				}}
				role="button"
				tabIndex={0}
				onKeyDown={() => {
					if (!isHover) {
						setIsOpenValue(!isOpenValue);
					}
				}}
				className="w-fit"
			>
				{content}
			</div>
			{isOpenValue && (
				<Wrapper>
					<div
						ref={refs.setFloating}
						{...getFloatingProps()}
						style={floatingStyles}
						className={className}
					>
						<FloatingArrow
							ref={arrowRef}
							context={context}
							fill="white"
						/>
						{children}
					</div>
				</Wrapper>
			)}
		</>
	);
};
