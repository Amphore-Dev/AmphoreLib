import React from "react";

import { Meta } from "@storybook/addon-docs";

export default {
	title: "Style Guide/Shadows",
	parameters: {
		docs: {
			page: () => (
				<>
					<Meta title="Style Guide/Shadows" />
					<h1>Shadows</h1>
					<p>
						A list of shadows which help in adding depth and realism
						to our designs.
					</p>
					<p>
						The below shadows are default utility classes from
						Tailwind CSS.
					</p>
					<section className="mt-48 flex flex-col space-y-32 lg:flex-row lg:space-x-8 lg:space-y-0">
						<div className="rounded-12 border-black-500 border-2 bg-white p-32 shadow-sm">
							shadow-sm
						</div>
						<div className="rounded-12 border-black-500 border-2 bg-white p-32 shadow">
							shadow
						</div>
						<div className="rounded-12 border-black-500 border-2 bg-white p-32 shadow-md">
							shadow-md
						</div>
						<div className="rounded-12 border-black-500 border-2 bg-white p-32 shadow-lg">
							shadow-lg
						</div>
						<div className="rounded-12 border-black-500 border-2 bg-white p-32 shadow-xl">
							shadow-xl
						</div>
						<div className="rounded-12 border-black-500 border-2 bg-white p-32 shadow-2xl">
							shadow-2xl
						</div>
					</section>
				</>
			),
		},
	},
};

export const Shadows = () => (
	<>
		<h1>Shadows</h1>
		<p>
			A list of shadows which help in adding depth and realism to our
			designs.
		</p>
		<p>The below shadows are default utility classes from Tailwind CSS.</p>
		<section className="mt-48 flex flex-col space-y-32 lg:flex-row lg:space-x-8 lg:space-y-0">
			<div className="rounded-12 border-black-500 border-2 bg-white p-32 shadow-sm">
				shadow-sm
			</div>
			<div className="rounded-12 border-black-500 border-2 bg-white p-32 shadow">
				shadow
			</div>
			<div className="rounded-12 border-black-500 border-2 bg-white p-32 shadow-md">
				shadow-md
			</div>
			<div className="rounded-12 border-black-500 border-2 bg-white p-32 shadow-lg">
				shadow-lg
			</div>
			<div className="rounded-12 border-black-500 border-2 bg-white p-32 shadow-xl">
				shadow-xl
			</div>
			<div className="rounded-12 border-black-500 border-2 bg-white p-32 shadow-2xl">
				shadow-2xl
			</div>
		</section>
	</>
);
