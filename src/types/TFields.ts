export type TFieldType =
	| "select"
	| "date"
	| "period"
	| "time"
	| "input"
	| "number"
	| "textarea"
	| "quantity"
	| "checkbox"
	| "radio"
	| "toggle"
	| "file";

export type TFieldRendererMap = {
	[K in TFieldType]: (props: object) => JSX.Element;
};

export type TLooseFieldRendererMap = Partial<
	Record<string, (props: object) => JSX.Element>
>;
