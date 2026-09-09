import React, { FormEvent, forwardRef, useMemo, useState } from "react";

import {
	maskitoNumberOptionsGenerator,
	maskitoParseNumber,
	maskitoStringifyNumber,
	MaskitoNumberParams,
} from "@maskito/kit";

import { ITextFieldProps, TextField } from "../TextField/TextField";

export interface INumberInputProps
	extends
		Omit<
			ITextFieldProps,
			| "type"
			| "pattern"
			| "value"
			| "onChange"
			| "allowedCharacters"
			| "min"
			| "max"
		>,
		MaskitoNumberParams {
	value?: number | null;
	onChange?: (
		value: number | null,
		e?: React.ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement>
	) => void;
}

export const NumberInput = forwardRef<HTMLInputElement, INumberInputProps>(
	(
		{
			value,
			onChange,
			min,
			max,
			precision,
			maximumFractionDigits = 2,
			minimumFractionDigits,
			decimalSeparator,
			decimalPseudoSeparators,
			decimalZeroPadding,
			thousandSeparator,
			prefix,
			postfix,
			minusSign,
			minusPseudoSigns,
			negativePattern,
			...props
		},
		ref
	) => {
		const numberParams: MaskitoNumberParams = {
			min,
			max,
			precision,
			maximumFractionDigits,
			minimumFractionDigits,
			decimalSeparator,
			decimalPseudoSeparators,
			decimalZeroPadding,
			thousandSeparator,
			prefix,
			postfix,
			minusSign,
			minusPseudoSigns,
			negativePattern,
		};

		const mask = useMemo(
			() => maskitoNumberOptionsGenerator(numberParams),
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[
				min,
				max,
				precision,
				maximumFractionDigits,
				minimumFractionDigits,
				decimalSeparator,
				thousandSeparator,
				prefix,
				postfix,
				minusSign,
				negativePattern,
			]
		);

		const stringify = (num: number) =>
			maskitoStringifyNumber(num, numberParams);

		const [raw, setRaw] = useState(() =>
			value === null || value === undefined ? "" : stringify(value)
		);

		// Only resync from the external value when it no longer matches what's
		// currently typed (e.g. external reset), so we don't clobber a decimal
		// separator the user is still typing (see: comma not sticking, #NumberInput).
		const parsedRaw =
			raw === "" ? null : maskitoParseNumber(raw, numberParams);
		const normalizedValue = value ?? null;
		if (normalizedValue !== parsedRaw) {
			const nextRaw =
				normalizedValue === null ? "" : stringify(normalizedValue);
			if (nextRaw !== raw) setRaw(nextRaw);
		}

		return (
			<TextField
				{...props}
				ref={ref}
				type="text"
				inputMode="decimal"
				pattern={mask}
				value={raw}
				onChange={(val, e) => {
					setRaw(val ?? "");
					if (!val) {
						onChange?.(null, e);
						return;
					}
					onChange?.(maskitoParseNumber(val, numberParams), e);
				}}
			/>
		);
	}
);

NumberInput.displayName = "NumberInput";
