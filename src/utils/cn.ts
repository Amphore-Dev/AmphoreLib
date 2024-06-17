import { twMerge } from "tailwind-merge";

export const cn = (classes: (string | undefined | false)[]) => {
	return twMerge(classes.filter(Boolean));
};
