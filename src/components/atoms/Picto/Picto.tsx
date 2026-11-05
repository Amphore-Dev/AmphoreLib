import React, { forwardRef } from "react";

import { Pictos, TPictoName } from "@constants/index";

// A global stylesheet, not a CSS module: its rules are attribute
// selectors meant for every picto, and a `.module.scss` imported only for
// its side effect was tree-shaken out of the published lib/style.css.
import "./Picto.scss";

export interface IPictoProps extends Omit<
	React.ComponentPropsWithoutRef<"div">,
	"color" | "onClick" | "children"
> {
	icon?: TPictoName;
	src?: string;
	className?: string;
	wrapperClassName?: string;
	style?: React.CSSProperties;
	currentColor?: boolean;
	onClick?: (
		event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
	) => void;
	rotation?: number;
	color?: string;
	disabled?: boolean;
	/** Names a clickable picto (an icon-only button has no other name), or an image one that means something. Without it an icon is decorative. */
	"aria-label"?: string;
}

const PictoBase: React.ForwardRefRenderFunction<HTMLElement, IPictoProps> = (
	{
		icon,
		className = "",
		color,
		rotation = 0,
		style,
		src,
		currentColor = true,
		onClick,
		wrapperClassName,
		disabled = false,
		...props
	},
	ref
) => {
	const Wrapper = (onClick ? "button" : "div") as React.ElementType;
	const ariaLabel = props["aria-label"];
	const wrapperProps = onClick
		? {
				disabled,
				onClick,
				tabIndex: 0,
				type: "button" as HTMLButtonElement["type"],
			}
		: undefined;

	if (!icon && !src) {
		return null;
	}

	const SvgIcon =
		icon && Pictos[icon]
			? (Pictos[icon] as React.FC<React.SVGProps<SVGSVGElement>>)
			: typeof icon !== "string"
				? icon
				: null;

	if (!SvgIcon && !src) {
		console.warn(
			`Picto: No icon found for "${icon}". Please check the icon name or provide a valid src.`
		);
		return null;
	}

	return (
		<Wrapper
			{...props}
			{...wrapperProps}
			ref={ref}
			className={wrapperClassName}
			data-amphore-svg-wrapper
			data-picto={icon}
		>
			{!!SvgIcon && (
				<SvgIcon
					className={className}
					aria-hidden
					style={{
						// Only set inline color when explicitly passed as a prop — an inline style
						// always wins over any CSS class/module color rule (e.g. Checkbox's ".check"
						// class), so defaulting this to the literal "currentColor" string silently
						// defeated every consumer styling the icon through className instead of `color`.
						...(color ? { color } : {}),
						opacity: disabled ? 0.25 : 1,
						transform: rotation
							? `rotate(${rotation}deg)`
							: undefined,
						...style,
					}}
					data-amphore-svg={currentColor ? "current" : ""}
				/>
			)}
			{src && (
				<img
					src={src}
					alt={onClick ? "" : (ariaLabel ?? "")}
					className={className}
					style={{
						...style,
						color: currentColor ? "currentColor" : undefined,
					}}
					data-amphore-svg
				/>
			)}
		</Wrapper>
	);
};

/**
 * Native props and `ref` go to the root wrapper (a `<button>` with `onClick`,
 * a `<div>` otherwise), with `wrapperClassName`; `className` and `style` to
 * the icon itself. `data-picto` names the icon drawn.
 */
export const Picto = forwardRef(PictoBase);
Picto.displayName = "Picto";
