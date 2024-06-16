import { twMerge } from "tailwind-merge";

export const cn = (classes: any) => {
    return twMerge(classes.filter(Boolean));
};
