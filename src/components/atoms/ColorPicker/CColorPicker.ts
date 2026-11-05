import type { IPropsMain } from "react-gcolor-picker/dist/components/Colorpicker/types";

/**
 * The props that configure the picker itself, as opposed to the native props
 * of the element they sit next to: how ColorPicker and ColorPickerField tell
 * the two apart in one flat props object. Internal, not exported from the
 * package.
 */
export const COLOR_PICKER_OPTION_KEYS = [
	"value",
	"onChange",
	"format",
	"defaultColors",
	"debounceMS",
	"debounce",
	"showAlpha",
	"showInputs",
	"showGradientResult",
	"showGradientStops",
	"showGradientMode",
	"showGradientAngle",
	"showGradientPosition",
	"allowAddGradientStops",
	"colorBoardHeight",
	"defaultActiveTab",
	"onChangeTabs",
	"onDefaultColorSelect",
	"labels",
	"gradient",
	"solid",
	"popupWidth",
] as const satisfies readonly (keyof IPropsMain)[];
