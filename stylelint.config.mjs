// Keeps every design value on a theme token (var(--amp-*)) or a scale function
// from src/styles/_mixins.scss. Values only: formatting stays with Prettier.

const TEXT_STEPS = "xs|sm|base|lg|xl|2xl|3xl|4xl";

/** Neutral values, with no scale to respect. */
const KEYWORDS = [
	"0",
	"auto",
	"none",
	"normal",
	"inherit",
	"initial",
	"unset",
	"revert",
	"currentColor",
	"currentcolor",
	"transparent",
];

/** A value that reads a variable or calls a scale function is accepted. */
const TOKEN_VALUES = [
	"/var\\(--/",
	"/\\bspace\\(/",
	"/\\bweight\\(/",
	// Local SCSS variables, and the parameters of a mixin.
	"/\\$[\\w-]+/",
	"/^url\\(/",
];

/** Line thicknesses: a token for the width, any style. */
const LINE_VALUES = [
	...KEYWORDS,
	...TOKEN_VALUES,
	"solid",
	"dashed",
	"dotted",
	"double",
];

const LINE_PROPERTIES = [
	"/^outline(-width|-offset)?$/",
	"/^border(-(top|right|bottom|left))?(-width)?$/",
];

export default {
	customSyntax: "postcss-scss",
	plugins: ["stylelint-declaration-strict-value"],
	// Defines the scale: it builds the var() names the rules below check.
	ignoreFiles: ["src/styles/_mixins.scss"],
	defaultSeverity: "error",
	reportNeedlessDisables: true,
	reportDescriptionlessDisables: true,
	rules: {
		"scale-unlimited/declaration-strict-value": [
			[
				"/color$/",
				"background",
				"fill",
				"stroke",
				"font-size",
				"line-height",
				"font-weight",
				"/radius$/",
				"box-shadow",
				"z-index",
				"transition-duration",
				"transition-timing-function",
				...LINE_PROPERTIES,
			],
			{
				ignoreFunctions: false,
				// Otherwise any var() passes, and a typo in a step name with it.
				ignoreVariables: false,
				ignoreValues: {
					"": [...KEYWORDS, ...TOKEN_VALUES],
					"font-size": [
						"inherit",
						"/%$/",
						"/^[\\d.]+em$/",
						`/^var\\(--amp-text-(${TEXT_STEPS})\\)$/`,
						`/^max\\(var\\(--amp-text-(${TEXT_STEPS})\\), 1em\\)$/`,
					],
					"line-height": [
						"inherit",
						"normal",
						`/^var\\(--amp-leading-(${TEXT_STEPS}|none|tight|snug|normal)\\)$/`,
						// A control holding its height with another step's size.
						"/^space\\([\\d.]+\\)$/",
					],
					"font-weight": ["inherit", "/\\bweight\\(/"],
					"/radius$/": [...KEYWORDS, ...TOKEN_VALUES, "/^\\d+%$/"],
					"z-index": [
						...KEYWORDS,
						"/var\\(--amp-z-/",
						// Stacking inside one component, not a global layer.
						"/^-?[0-3]$/",
					],
					[LINE_PROPERTIES[0]]: LINE_VALUES,
					[LINE_PROPERTIES[1]]: LINE_VALUES,
				},
				disableFix: true,
				message:
					'"${value}" for "${property}": use a theme token (var(--amp-*)), space(), text() or weight().',
			},
		],
		// Lengths, in any other property, wherever they sit in the value: a rem
		// or a px inside a calc() or a shorthand is as raw as one on its own.
		// 0 is not a length here, and 1px is a hairline, not a step of the
		// spacing scale: it stays legal for `calc(#{space(2)} - 1px)`.
		"declaration-property-value-disallowed-list": [
			{
				"/^(?!font-size$|line-height$|outline|border|box-shadow$)/": [
					"/(?<![\\w.#$-])-?(?!1px\\b)(?!0(px|rem)\\b)\\d*\\.?\\d+(px|rem)\\b/",
				],
				"/^(transition|animation)(-duration|-delay)?$/": [
					"/(^|[\\s,])[\\d.]+m?s\\b/",
				],
				"/^(transition|animation)(-timing-function)?$/": [
					"/cubic-bezier/",
				],
				transition: ["/(^|[\\s,])ease(\\s|,|$)/"],
			},
			{
				message: (property, value) =>
					`"${value}" for "${property}": raw length or timing, use space(), a theme token, or var(--amp-duration-*) / var(--amp-ease).`,
			},
		],
		"color-no-hex": true,
		"function-disallowed-list": [
			["rgb", "rgba", "hsl", "hsla", "hwb"],
			{ message: "Raw color: use a theme token (var(--amp-color-*))." },
		],
	},
};
