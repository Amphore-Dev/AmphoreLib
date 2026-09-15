import React from "react";
import { addons, types } from "storybook/manager-api";

import { ThemeConfigPanel } from "./ThemeConfigPanel";

addons.register("amphore/theme-config", () => {
	addons.add("amphore/theme-config/panel", {
		type: types.PANEL,
		title: "Amphore Theme",
		render: ({ active }) => (active ? <ThemeConfigPanel /> : null),
	});
});
