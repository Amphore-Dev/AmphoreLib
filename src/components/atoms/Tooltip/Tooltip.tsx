import React, {
	forwardRef,
	Fragment,
	PropsWithChildren,
	ReactElement,
	ReactNode,
	useRef,
	useState,
} from "react";

import {
	flip,
	FloatingArrow,
	FloatingPortal,
	arrow as genArrow,
	offset,
	safePolygon,
	shift,
	useClick,
	UseClickProps,
	useDismiss,
	useFloating,
	UseFloatingOptions,
	useHover,
	UseHoverProps,
	useInteractions,
} from "@floating-ui/react";

import { cn } from "@utils/cn";

import "./Tooltip.scss";

export interface ITooltipProps extends PropsWithChildren {
	content: ReactElement;
	trigger?: "click" | "hover";
	closeOnLeave?: boolean;
	closeOnClick?: boolean;
	closeOnClickOutside?: boolean;
	closeOnBlur?: boolean;
	className?: string;
	floatingProps?: UseFloatingOptions;
	hoverHookProps?: UseHoverProps;
	clickHookProps?: UseClickProps;
	isOpen?: boolean;
	setIsOpen?: (isOpen: boolean) => void;
	portal?: boolean;
	container?: ReactNode | boolean;
	arrow?: boolean;
	ref?: React.Ref<HTMLDivElement>;
	tabIndex?: number;
	buttonClassName?: string;
}

export const Tooltip = forwardRef<HTMLDivElement, ITooltipProps>(
	(
		{
			children,
			content = <div>Tooltip</div>,
			trigger = "hover",
			closeOnLeave = true,
			closeOnClick = false,
			closeOnClickOutside = true,
			className,
			buttonClassName,
			floatingProps = {} as UseFloatingOptions,
			hoverHookProps = {},
			clickHookProps = {},
			container = true,
			arrow = false,
			isOpen,
			setIsOpen,
			portal,
			tabIndex = 0,
		},
		ref // 👈 ici maintenant
	) => {
		const isHover = trigger === "hover";
		const [IsOpen, SetIsOpen] = useState(false);

		const isOpenValue = isOpen ?? IsOpen;
		const setIsOpenValue = setIsOpen ?? SetIsOpen;

		const arrowRef = useRef<SVGSVGElement>(null);

		const { middleware, ...floatingOptions } = floatingProps;
		const { refs, context, floatingStyles } = useFloating({
			open: isOpenValue,
			onOpenChange: setIsOpenValue,
			middleware: [
				genArrow({
					element: arrowRef,
				}),
				flip(),
				shift(),
				offset(3),
				...(middleware ?? []),
			],
			...floatingOptions,
		});
		const dismiss = useDismiss(context);

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

		const { getReferenceProps, getFloatingProps } = useInteractions([
			hook,
			closeOnClickOutside ? dismiss : undefined,
		]);

		const Wrapper = portal ? FloatingPortal : Fragment;

		const Container = (
			container && typeof container !== "boolean" ? container : "div"
		) as React.ElementType;

		return (
			<>
				<div
					ref={(node) => {
						refs.setReference(node);
						if (typeof ref === "function") {
							ref(node);
						} else if (ref && typeof ref === "object") {
							(
								ref as React.MutableRefObject<HTMLElement | null>
							).current = node;
						}
					}}
					{...getReferenceProps()}
					onClick={(e) => {
						e.stopPropagation();
						if (!isHover) {
							setIsOpenValue(!isOpenValue);
						}
					}}
					role="button"
					tabIndex={tabIndex}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							e.stopPropagation();
							setTimeout(() => {
								// wait for the tooltip to open
								// and focus first element in the tooltip
								(
									refs.floating?.current?.querySelector(
										"div:first-child"
									) as HTMLElement
								)?.focus();
							}, 100);
							if (!isHover) {
								setIsOpenValue(!isOpenValue);
							}
						}
					}}
					className={cn(["amphorelib__tooltip", buttonClassName])}
				>
					{content}
				</div>
				{isOpenValue && (
					<Wrapper>
						<Container
							ref={refs.setFloating}
							{...getFloatingProps()}
							style={floatingStyles}
							className={cn([
								container === true &&
									"amphorelib__tooltip__container",
								className,
							])}
							onClick={() => {
								if (closeOnClick) {
									setIsOpenValue(false);
								}
							}}
							onBlur={(e: React.FocusEvent<HTMLElement>) => {
								// close the tooltip if no child is focused
								if (
									!refs.floating?.current?.contains(
										e.relatedTarget as Node
									)
								) {
									setIsOpenValue(false);
									// focus the reference element
									if (tabIndex !== -1) {
										setTimeout(() => {
											(
												refs.reference
													?.current as HTMLElement
											)?.focus();
										}, 10);
									}
								}
							}}
						>
							{container === true && !!arrow && (
								<FloatingArrow
									ref={arrowRef}
									context={context}
									fill="bg-black"
									className={cn([
										container === true &&
											"amphorelib__tooltip__arrow",
									])}
								/>
							)}
							{children}
						</Container>
					</Wrapper>
				)}
			</>
		);
	}
);

Tooltip.displayName = "Tooltip";
