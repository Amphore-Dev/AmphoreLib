import React, { useState } from "react";

import { Meta } from "@storybook/addon-docs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UnusedPictos } from "./icons/unusedPictos";
import { Picto, Title } from "@components/atoms";
import { ColorPickerField } from "@components/molecules";
import { Pictos, TPictoName } from "@constants/index";

export default {
	title: "Style Guide/Icons",
	parameters: {
		docs: {
			page: () => {
				const [color, setColor] = useState("#0f9be8");
				return (
					<>
						<ToastContainer
							hideProgressBar
							pauseOnHover={false}
							closeOnClick
							limit={5}
							autoClose={1000}
						/>
						<Meta title="Style Guide/Icons" />
						<h1>Icons</h1>

						<p>
							Here are all the icons available in the application.
							<br />
							<b>
								You can click on the icon to copy its name to
								the clipboard.
							</b>
						</p>
						<div>
							<label className="items-center gap-2 mb-8 flex flex-row">
								<ColorPickerField
									value={color}
									onChange={setColor}
								/>

								<h3 className="!my-0 leading-none">Color</h3>
							</label>
						</div>
						<div className="grid items-center justify-center grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 text-neutral-500">
							{Object.keys(Pictos).map((icon) => (
								<div
									key={icon}
									className="flex flex-col items-center h-[150px]"
								>
									<div
										className="flex flex-col items-center gap-2 p-4 overflow-visible bg-white rounded-md"
										key={icon}
									>
										<Picto
											icon={icon as TPictoName}
											className="w-16 h-16 p-2 rounded-md shadow-md"
											onClick={() => {
												// set name of icon in clipboard
												navigator.clipboard.writeText(
													icon
												);
												toast.success(
													`Icon "${icon}" copied to clipboard`
												);
											}}
											color={color}
										/>
									</div>

									<div className="text-xs">{icon}</div>
								</div>
							))}
						</div>
						<Title tag="h3">Unused Icons</Title>
						<p>These icons are not exported by the library:</p>
						<div className="grid items-center justify-center grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 text-neutral-500">
							{Object.keys(UnusedPictos).map((icon) => (
								<div
									key={icon}
									className="flex flex-col items-center h-[150px]"
								>
									<div
										className="flex flex-col items-center gap-2 p-4 overflow-visible bg-white rounded-md"
										key={icon}
									>
										<Picto
											icon={
												UnusedPictos[icon] as TPictoName
											}
											className="w-16 h-16 p-2 rounded-md shadow-md"
											onClick={() => {
												// set name of icon in clipboard
												navigator.clipboard.writeText(
													icon
												);
												toast.success(
													`Icon "${icon}" copied to clipboard`
												);
											}}
											color={color}
										/>
									</div>

									<div className="text-xs">{icon}</div>
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
