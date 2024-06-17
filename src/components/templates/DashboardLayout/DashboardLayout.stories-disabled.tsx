import type { Meta, StoryObj } from "@storybook/react";

import { DashboardLayout } from "./DashboardLayout";

const meta = {
	component: DashboardLayout,
	title: "Components/Templates/DashboardLayout",
} satisfies Meta<typeof DashboardLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
