import type { TPictoName } from "@constants/index";

import type { IPictoProps } from "../components/atoms/Picto/Picto";

export const getPicto = (picto: TPictoName | IPictoProps) => {
	return typeof picto === "string" ? { icon: picto } : picto;
};
