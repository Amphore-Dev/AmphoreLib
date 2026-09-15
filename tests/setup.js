import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
});

// jsdom has no ResizeObserver — @floating-ui/react's autoUpdate (used by
// Select and anything else built on useFloating) subscribes to one to
// reposition on element resize. Without this stub, mounting a floating
// component in a test throws "ResizeObserver is not defined".
if (typeof globalThis.ResizeObserver === "undefined") {
	globalThis.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
}

// jsdom doesn't implement the Pointer Events spec at all — `PointerEvent` is
// undefined globally. Without this, @testing-library's fireEvent.pointerDown
// (and any component driving drag interactions via onPointerDown, like
// TextArea's custom resize handle) silently loses coordinate data
// (clientX/clientY come back `undefined`) instead of throwing, which reads
// as a component bug rather than a missing test-environment API.
if (typeof globalThis.PointerEvent === "undefined") {
	globalThis.PointerEvent = class PointerEvent extends MouseEvent {
		constructor(type, params = {}) {
			super(type, params);
			this.pointerId = params.pointerId ?? 0;
			this.pointerType = params.pointerType ?? "mouse";
			this.isPrimary = params.isPrimary ?? true;
			this.width = params.width ?? 1;
			this.height = params.height ?? 1;
			this.pressure = params.pressure ?? 0.5;
		}
	};
}

// jsdom has no object URL support at all — DocumentPreview (InputFile's
// image thumbnail) calls URL.createObjectURL/revokeObjectURL on every File
// it's given. Stubbed rather than asserted on: tests only care that some
// URL string was set as the <img> src, not what it actually resolves to.
if (typeof globalThis.URL.createObjectURL === "undefined") {
	globalThis.URL.createObjectURL = () => "blob:mock-url";
}
if (typeof globalThis.URL.revokeObjectURL === "undefined") {
	globalThis.URL.revokeObjectURL = () => {};
}

// jsdom never lays anything out — every element's offsetWidth/offsetHeight
// is 0. Table's virtualizer (@tanstack/react-virtual) measures its scroll
// container via exactly those two properties (see virtual-core's getRect)
// to decide which rows are "visible"; at 0 it always computes an empty
// visible range, so no row ever renders in a test, no matter how many
// items are passed. Stubbed to a plausible viewport size so virtualized
// content actually mounts and becomes assertable.
Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
	configurable: true,
	value: 500,
});
Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
	configurable: true,
	value: 500,
});
