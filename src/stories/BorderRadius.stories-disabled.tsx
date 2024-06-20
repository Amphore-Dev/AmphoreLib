import React from "react";

import { Meta } from "@storybook/addon-docs";

export default {
	title: "Style Guide/Border Radius",
	parameters: {
		docs: {
			page: () => (
				<>
					<Meta title="Style Guide/Border Radius" />
					<h1>Border Radius</h1>
					<p>
						A list of...well...border radii (yes that's plural for
						radius).
					</p>
					<p>
						<code>1rem = 10px</code>
					</p>
					<br />
					<table>
						<thead>
							<tr>
								<th>Class</th>
								<th>Value</th>
								<th>Example</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>rounded-12</td>
								<td align="center">1.2rem (12px)</td>
								<td align="center">
									<div className="border-black-500 rounded-12 border-2 bg-yellow-200 p-48"></div>
								</td>
							</tr>
							<tr>
								<td>rounded-24</td>
								<td align="center">2.4rem (24px)</td>
								<td align="center">
									<div className="border-black-500 rounded-24 border-2 bg-yellow-200 p-48"></div>
								</td>
							</tr>
							<tr>
								<td>rounded-full</td>
								<td align="center">9999rem (99,990px)</td>
								<td align="center">
									<div className="border-black-500 rounded-full border-2 bg-yellow-200 p-48"></div>
								</td>
							</tr>
						</tbody>
					</table>
				</>
			),
		},
	},
};

export const BorderRadius = () => (
	<>
		<h1>Border Radius</h1>
		<p>A list of...well...border radii (yes that's plural for radius).</p>
		<p>
			<code>1rem = 10px</code>
		</p>
		<br />
		<table>
			<thead>
				<tr>
					<th>Class</th>
					<th>Value</th>
					<th>Example</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>rounded-12</td>
					<td align="center">1.2rem (12px)</td>
					<td align="center">
						<div className="border-black-500 rounded-12 border-2 bg-yellow-200 p-48"></div>
					</td>
				</tr>
				<tr>
					<td>rounded-24</td>
					<td align="center">2.4rem (24px)</td>
					<td align="center">
						<div className="border-black-500 rounded-24 border-2 bg-yellow-200 p-48"></div>
					</td>
				</tr>
				<tr>
					<td>rounded-full</td>
					<td align="center">9999rem (99,990px)</td>
					<td align="center">
						<div className="border-black-500 rounded-full border-2 bg-yellow-200 p-48"></div>
					</td>
				</tr>
			</tbody>
		</table>
	</>
);
