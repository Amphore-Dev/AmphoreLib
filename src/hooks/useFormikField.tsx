import { useContext } from "react";
import React, {
	forwardRef,
	ForwardRefExoticComponent,
	PropsWithoutRef,
	RefAttributes,
} from "react";

import { FormikContext, useField } from "formik";
import { ErrorMessage } from "formik";

import {
	IInputErrorMessageProps,
	InputErrorMessage,
} from "@components/atoms/InputErrorMessage/InputErrorMessage";

import { cn } from "@utils/cn";

export const useFormikField = (name?: string) => {
	const isInForm = !!useContext(FormikContext);
	const [field, meta, helpers] =
		name && isInForm ? useField(name) : [undefined, undefined, undefined];
	return { field, meta, helpers, isInForm };
};

export interface IWithFormikWrapperProps<
	Value = unknown,
	Element extends HTMLElement = HTMLElement,
> {
	hideError?: boolean;
	name?: string;
	enableFormik?: boolean;
	updateFormikValue?: boolean;
	error?: React.ReactNode;
	onChange?: (value: Value, e?: React.ChangeEvent<Element>) => void;
	allowedCharacters?: RegExp;
	formWrapperClassName?: string;
	maxLength?: number;
	errorInputProps?: Partial<IInputErrorMessageProps>;
}

export const withFormikWrapper = <
	P extends Omit<
		React.InputHTMLAttributes<T>,
		"onChange" | "pattern" | "value"
	> &
		IWithFormikWrapperProps<Value | null, T>,
	T extends HTMLElement = HTMLInputElement,
	Value = P extends { value?: infer V } ? V : unknown,
>(
	BaseComponent: React.ComponentType<P>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> => {
	const WrappedComponent = forwardRef<T, P>(
		(
			{
				enableFormik = true,
				formWrapperClassName,
				hideError = false,
				updateFormikValue = true,
				allowedCharacters,
				...props
			},
			ref
		) => {
			const { field, meta, helpers, isInForm } = useFormikField(
				props.name
			);

			// Function to filter out unauthorized characters
			const handleKeyPress = (e: React.KeyboardEvent<T>) => {
				props.onKeyDown?.(e); // Appelle la fonction onKeyDown si fournie
				if (!allowedCharacters) return; // Si aucune regex n'est fournie, on ne fait rien
				const input = (
					e.currentTarget as unknown as
						| HTMLInputElement
						| HTMLTextAreaElement
				).value; // Valeur actuelle de l'input
				const key = e.key; // Touche pressée
				if (
					[
						"Backspace",
						"Delete",
						"ArrowLeft",
						"ArrowRight",
						"Tab",
						"Enter",
						"Escape",
					].includes(key)
				) {
					return; // Permet la suppression et la navigation
				}
				// Combine la valeur actuelle et la nouvelle touche pressée
				const potentialValue = input + key;

				// Teste si la valeur potentielle respecte la regex
				if (!allowedCharacters?.test(potentialValue)) {
					return e.preventDefault(); // Empêche l'entrée si non valide
				}
			};

			const handleChange = (
				value: Value | null,
				e: React.ChangeEvent<T>
			) => {
				const stringValue = String(value ?? "");
				let truncatedValue = value;

				if (props.maxLength && stringValue.length > props.maxLength) {
					//Permet de copier coller sans dépasser la longueur max
					truncatedValue = stringValue.slice(
						0,
						props.maxLength
					) as Value;
				}

				if (props.onChange) props.onChange(truncatedValue, e);
				if (isInForm && helpers) {
					if (updateFormikValue) {
						return helpers
							.setValue(truncatedValue)
							.then(() => helpers.setTouched(true));
					}
					return helpers.setTouched(true);
				}
			};

			if (isInForm && props.name && enableFormik) {
				const formikProps = {
					...(props as object),
					value: field?.value,
					onChange: handleChange,
					error:
						(meta?.touched ? meta.error : undefined) || props.error,
					onKeyDown: handleKeyPress,
					onInput: (e: React.ChangeEvent<T>) => {
						const target = e.currentTarget as unknown as
							| HTMLInputElement
							| HTMLTextAreaElement;
						handleChange(target.value as Value, e);
					},
					ref,
				} as unknown as P;

				return (
					<div
						className={cn([
							"flex flex-col gap-1",
							formWrapperClassName,
						])}
					>
						<BaseComponent {...formikProps} />
						{!hideError && (
							<>
								<ErrorMessage name={props.name || ""}>
									{(msg) => {
										return Array.isArray(msg) ? (
											msg.map((m) => (
												<div
													className="flex flex-col gap-1"
													key={m}
												>
													{
														<InputErrorMessage
															{...props.errorInputProps}
														>
															{m}
														</InputErrorMessage>
													}
												</div>
											))
										) : (
											<InputErrorMessage
												{...props.errorInputProps}
											>
												{msg}
											</InputErrorMessage>
										);
									}}
								</ErrorMessage>
								{!meta?.error && props.error && (
									<InputErrorMessage
										{...props.errorInputProps}
									>
										{props.error}
									</InputErrorMessage>
								)}
							</>
						)}
					</div>
				);
			}

			const simpleProps = {
				...(props as object),
				onKeyDown: handleKeyPress,
				onInput: (e: React.ChangeEvent<T>) => {
					const target = e.currentTarget as unknown as
						| HTMLInputElement
						| HTMLTextAreaElement;
					handleChange(target.value as Value, e);
				},
				ref,
			} as unknown as P;

			return (
				<div
					className={cn([
						"flex flex-col gap-1",
						formWrapperClassName,
					])}
				>
					<BaseComponent {...simpleProps} />
					{!hideError && (
						<InputErrorMessage {...props.errorInputProps}>
							{props.error}
						</InputErrorMessage>
					)}
				</div>
			);
		}
	);

	WrappedComponent.displayName = `withFormikWrapper(${BaseComponent.displayName || BaseComponent.name || "Component"})`;

	return WrappedComponent;
};
