import path from "node:path";
import { compileString } from "sass";
import { describe, expect, it } from "vitest";

const compile = (body: string) =>
	compileString(`@use "mixins" as *;\n.x { ${body} }`, {
		loadPaths: [path.resolve(__dirname)],
		style: "compressed",
	}).css;

describe("space()", () => {
	it("multiplies the spacing base, half units and negatives included", () => {
		expect(compile("gap: space(2);")).toContain(
			"gap:calc(var(--amp-spacing)*2)"
		);
		expect(compile("gap: space(1.5);")).toContain(
			"calc(var(--amp-spacing)*1.5)"
		);
		expect(compile("margin: space(-0.5);")).toContain(
			"calc(var(--amp-spacing)*-0.5)"
		);
		expect(compile("gap: space(0);")).toContain("gap:0");
	});

	it("composes in a calc() and in a custom property", () => {
		expect(compile("padding: calc(#{space(2)} - 1px);")).toContain(
			"calc(calc(var(--amp-spacing) * 2) - 1px)"
		);
		expect(compile("--_gap: #{space(2)};")).toContain(
			"--_gap: calc(var(--amp-spacing) * 2)"
		);
	});

	it("fails compilation off scale", () => {
		expect(() => compile("gap: space(1.25);")).toThrow(/off scale/);
		expect(() => compile("gap: space(4px);")).toThrow(/unitless/);
		expect(() => compile('gap: space("2");')).toThrow(/unitless/);
	});
});

describe("text()", () => {
	it("sets size and line height, the weight on demand", () => {
		const css = compile("@include text(base, medium);");
		expect(css).toContain("font-size:var(--amp-text-base)");
		expect(css).toContain("line-height:var(--amp-leading-base)");
		expect(css).toContain("font-weight:var(--amp-weight-medium)");
		expect(compile("@include text(sm);")).not.toContain("font-weight");
	});

	it("takes the numbered steps", () => {
		expect(compile("@include text(2xl);")).toContain(
			"font-size:var(--amp-text-2xl)"
		);
	});

	it("fails compilation off scale", () => {
		expect(() => compile("@include text(md);")).toThrow(/off scale/);
		expect(() => compile("@include text(5xl);")).toThrow(/off scale/);
		expect(() => compile("@include text(md, heavy);")).toThrow(/off scale/);
	});
});

describe("weight()", () => {
	it("reads the weight token", () => {
		expect(compile("font-weight: weight(semibold);")).toContain(
			"font-weight:var(--amp-weight-semibold)"
		);
	});

	it("fails compilation off scale", () => {
		expect(() => compile("font-weight: weight(heavy);")).toThrow(
			/off scale/
		);
		expect(() => compile("font-weight: weight(600);")).toThrow(/off scale/);
	});
});

describe("focus-ring", () => {
	it("draws the outline from the focus tokens", () => {
		const css = compile("@include focus-ring;");
		expect(css).toContain(
			"outline:var(--amp-focus-width) solid var(--amp-focus-color)"
		);
		expect(css).toContain("outline-offset:var(--amp-focus-offset)");
	});

	it("takes a color, and goes inside the element when inset", () => {
		const css = compile("@include focus-ring(currentColor, $inset: true);");
		expect(css).toContain("solid currentColor");
		expect(css).toContain("calc(var(--amp-focus-offset)*-1)");
	});
});

describe("truncate", () => {
	it("cuts one line with an ellipsis", () => {
		const css = compile("@include truncate;");
		expect(css).toContain("overflow:hidden");
		expect(css).toContain("text-overflow:ellipsis");
		expect(css).toContain("white-space:nowrap");
	});
});

describe("field-box", () => {
	it("holds a field at its height whatever it contains", () => {
		const css = compileString(
			'@use "field"; .x { @include field.field-box; }',
			{ loadPaths: [path.resolve(__dirname)], style: "compressed" }
		).css;
		for (const [size, units] of [
			["sm", 8.5],
			["md", 10.5],
			["lg", 14.5],
		]) {
			expect(css).toMatch(
				new RegExp(
					`\\[data-size=['"]?${size}['"]?\\]\\{[^}]*min-height:calc\\(var\\(--amp-spacing\\)\\*${units}\\)`
				)
			);
		}
	});
});
