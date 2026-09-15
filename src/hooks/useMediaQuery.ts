import { useEffect, useState } from "react";

const getMatches = (query: string): boolean =>
	typeof window !== "undefined" ? window.matchMedia(query).matches : false;

/**
 * Tracks whether a media query currently matches — the one case CSS alone
 * can't cover: switching between two structurally different render trees
 * (not just different styles on the same one) based on viewport, e.g.
 * SidePanel's desktop-panel vs BottomPanel-as-mobile-fallback. Every other
 * responsive/theme need in this lib stays CSS-only (see
 * memory/amphorelib-v2-conventions.md's dark-theme note) — reach for this
 * only when the actual DOM/behavior differs, not just its appearance.
 *
 * Initial value is read synchronously (not `false` then corrected in an
 * effect) to avoid a one-frame flash of the wrong tree on first render.
 */
export const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(() => getMatches(query));

	useEffect(() => {
		const mql = window.matchMedia(query);
		setMatches(mql.matches);

		const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, [query]);

	return matches;
};
