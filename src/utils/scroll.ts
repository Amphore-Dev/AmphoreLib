export const scrollToAnchor = (anchorName: string) => {
	if (!anchorName) return false;
	const anchorElement = document.querySelector(anchorName);
	if (!anchorElement) return false;
	anchorElement.scrollIntoView({
		behavior: "smooth",
		block: "start",
	});
};

export const scrollToTop = (anchorName: string) => {
	if (!anchorName) return false;
	const anchorElement = document.querySelector(anchorName);
	if (!anchorElement) return false;

	anchorElement.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};
