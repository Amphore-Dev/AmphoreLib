/** The picto drawn for an icon name, or null: Picto has no testid of its own. */
export const queryPicto = (icon: string) =>
	document.querySelector<HTMLElement>(`[data-picto="${icon}"]`);
