import React from "react";

import { Meta } from "@storybook/addon-docs";

import { Picto } from "@components/atoms";
import { Pictos, TPictoName } from "@constants/index";

export default {
	title: "Style Guide/Icons",
	parameters: {
		docs: {
			page: () => {
				return (
					<>
						<Meta title="Style Guide/Icons" />
						<h1>Icons</h1>
						<p>
							A collection of Font Awesome icons. Namely a few
							(some of which I don't even use lol).
						</p>
						<h2>Solid icons</h2>
						<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 justify-center items-center text-primary-800">
							{Object.keys(Pictos).map((icon) => (
								<div
									className="flex flex-col items-center gap-2 p-4 rounded-md bg-white"
									key={icon}
								>
									<Picto
										icon={icon as TPictoName}
										className="w-16 h-16 p-2 border border-neutral-200 rounded-xl"
									/>
									<span>{icon}</span>
								</div>
							))}
						</div>
					</>
				);
			},
		},
	},
};

export const All = () => <></>;
