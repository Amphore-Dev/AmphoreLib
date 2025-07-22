import { useEffect } from "react";

export const useOutsideAlerter = (
	ref: React.RefObject<HTMLElement>,
	callback: (event: MouseEvent) => void
) => {
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				callback(event);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref, callback]);
};

export default useOutsideAlerter;
