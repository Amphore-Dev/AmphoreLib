// Keeps every design value on a theme token (var(--amp-*)) or a scale function
// from src/styles/_mixins.scss. Values only: formatting stays with Prettier.

const TEXT_STEPS = "2xs|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl";

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

/** Relative to the element or its text, so already on no absolute scale. */
const RELATIVE_VALUES = [
	"/^-?[\\d.]+(%|em|ex|ch|vw|vh|dvh|svh|fr)$/",
	"/^(min|max|fit)-content$/",
	"/^(calc|min|max|clamp)\\(.*(%|vw|vh|dvh|em)\\b/",
	"stretch",
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

/** 1px is a hairline, not a step of the spacing scale. */
const LENGTH_VALUES = [
	...KEYWORDS,
	...TOKEN_VALUES,
	...RELATIVE_VALUES,
	"/^-?1px$/",
];

const LENGTH_PROPERTIES = [
	"/^(margin|padding)(-|$)/",
	"/^(row-|column-)?gap$/",
	"/^(min-|max-)?(width|height)$/",
	"/^(top|right|bottom|left|inset)$/",
];

const LINE_PROPERTIES = [
	"/^outline(-width|-offset)?$/",
	"/^border(-(top|right|bottom|left))?(-width)?$/",
];

export default {
	customSyntax: "postcss-scss",
	plugins: ["stylelint-declaration-strict-value"],
	defaultSeverity: "warning",
	reportNeedlessDisables: true,
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
				...LENGTH_PROPERTIES,
				...LINE_PROPERTIES,
			],
			{
				ignoreFunctions: false,
				ignoreValues: {
					"": [...KEYWORDS, ...TOKEN_VALUES],
					"font-size": [
						"inherit",
						"/%$/",
						"/em$/",
						`/^var\\(--amp-text-(${TEXT_STEPS})\\)$/`,
						`/^max\\(var\\(--amp-text-(${TEXT_STEPS})\\), 1em\\)$/`,
					],
					"line-height": [
						"inherit",
						"normal",
						`/^var\\(--amp-leading-(${TEXT_STEPS}|none|tight|snug|normal)\\)$/`,
					],
					"font-weight": ["inherit", "/\\bweight\\(/"],
					"z-index": [
						...KEYWORDS,
						"/var\\(--amp-z-/",
						// Stacking inside one component, not a global layer.
						"/^-?[0-3]$/",
					],
					[LENGTH_PROPERTIES[0]]: LENGTH_VALUES,
					[LENGTH_PROPERTIES[1]]: LENGTH_VALUES,
					[LENGTH_PROPERTIES[2]]: LENGTH_VALUES,
					[LENGTH_PROPERTIES[3]]: LENGTH_VALUES,
					[LINE_PROPERTIES[0]]: LINE_VALUES,
					[LINE_PROPERTIES[1]]: LINE_VALUES,
				},
				disableFix: true,
				message:
					'"${value}" for "${property}": use a theme token (var(--amp-*)), space(), text() or weight().',
			},
		],
		// strict-value accepts a shorthand as soon as one part is a var(), so
		// `padding: 0.25rem var(--amp-space-2)` would pass it. This looks at
		// each part. 1px stays legal for the explicit border compensations:
		// `calc(#{space(2)} - 1px)`.
		"declaration-property-value-disallowed-list": [
			{
				"/^(?!--)/": [
					"/(?<![\\w.#$-])-?(?!1px\\b)(?!0(px|rem)\\b)\\d*\\.?\\d+(px|rem)\\b/",
				],
				"/^--_/": [
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
