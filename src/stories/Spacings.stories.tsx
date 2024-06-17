import React from "react";
import { Meta } from "@storybook/addon-docs";

export default {
	title: "Style Guide/Spacings",
	parameters: {
		docs: {
			page: () => (
				<>
					<Meta title="Style Guide/Spacings" />
					<h1>Spacings</h1>
					<p>List of spacings using increments of 4s, 8s, and 16s.</p>
					<p>
						Everything's measured in <code>rems</code> where{" "}
						<code>1rem = 10px</code>. In Tailwind CSS, you can use
						the following classes in different development
						scenarios:
					</p>
					<p>
						<code>p-[n], px-[n], py-[n]</code> = padding
					</p>
					<p>
						<code>m-[n], mx-[n], my=[n]</code> = margin
					</p>
					<p>
						<code>space-y-[n]</code> or <code>space-x-[n]</code> =
						margin between elements
					</p>
					<p>
						<code>w-[n]</code> or <code>h-[n]</code> = width or
						height
					</p>
					<br />
					<p>
						<code>x</code> in the classes above means horizontal
						spacings (a.k.a left and right)
					</p>
					<p>
						<code>y</code> means vertical (a.k.a top and bottom)
					</p>
					<br />
					<div
						className="flex w-full"
						style={{ gap: "10%", flexWrap: "wrap" }}
					>
						<div className="pl-32">
							<h1>Padding</h1>
							<table style={{ width: "200px" }}>
								<thead>
									<tr>
										<th>n</th>
										<th>Value</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>xs</td>
										<td>0.25rem</td>
									</tr>
									<tr>
										<td>s</td>
										<td>0.5rem</td>
									</tr>
									<tr>
										<td>m</td>
										<td>1rem</td>
									</tr>
									<tr>
										<td>l</td>
										<td>1.5rem</td>
									</tr>
									<tr>
										<td>xl</td>
										<td>2rem</td>
									</tr>
									<tr>
										<td>xxl</td>
										<td>2.5rem</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div>
							<h1>Margin</h1>
							<table style={{ width: "200px" }}>
								<thead>
									<tr>
										<th>n</th>
										<th>Value</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>xs</td>
										<td>0.25rem</td>
									</tr>
									<tr>
										<td>s</td>
										<td>0.5rem</td>
									</tr>
									<tr>
										<td>m</td>
										<td>1rem</td>
									</tr>
									<tr>
										<td>l</td>
										<td>1.5rem</td>
									</tr>
									<tr>
										<td>xl</td>
										<td>2rem</td>
									</tr>
									<tr>
										<td>xxl</td>
										<td>2.5rem</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</>
			),
		},
	},
};

export const Spacings = () => (
	<>
		<h1>Spacings</h1>
		<p>List of spacings using increments of 4s, 8s, and 16s.</p>
		<p>
			Everything's measured in <code>rems</code> where{" "}
			<code>1rem = 10px</code>. In Tailwind CSS, you can use the following
			classes in different development scenarios:
		</p>
		<p>
			<code>p-[n], px-[n], py-[n]</code> = padding
		</p>
		<p>
			<code>m-[n], mx-[n], my=[n]</code> = margin
		</p>
		<p>
			<code>space-y-[n]</code> or <code>space-x-[n]</code> = margin
			between elements
		</p>
		<p>
			<code>w-[n]</code> or <code>h-[n]</code> = width or height
		</p>
		<br />
		<p>
			<code>x</code> in the classes above means horizontal spacings (a.k.a
			left and right)
		</p>
		<p>
			<code>y</code> means vertical (a.k.a top and bottom)
		</p>
		<br />
		<div className="flex w-full" style={{ gap: "10%", flexWrap: "wrap" }}>
			<div className="pl-32">
				<h1>Padding</h1>
				<table style={{ width: "200px" }}>
					<thead>
						<tr>
							<th>n</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>xs</td>
							<td>0.25rem</td>
						</tr>
						<tr>
							<td>s</td>
							<td>0.5rem</td>
						</tr>
						<tr>
							<td>m</td>
							<td>1rem</td>
						</tr>
						<tr>
							<td>l</td>
							<td>1.5rem</td>
						</tr>
						<tr>
							<td>xl</td>
							<td>2rem</td>
						</tr>
						<tr>
							<td>xxl</td>
							<td>2.5rem</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div>
				<h1>Margin</h1>
				<table style={{ width: "200px" }}>
					<thead>
						<tr>
							<th>n</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>xs</td>
							<td>0.25rem</td>
						</tr>
						<tr>
							<td>s</td>
							<td>0.5rem</td>
						</tr>
						<tr>
							<td>m</td>
							<td>1rem</td>
						</tr>
						<tr>
							<td>l</td>
							<td>1.5rem</td>
						</tr>
						<tr>
							<td>xl</td>
							<td>2rem</td>
						</tr>
						<tr>
							<td>xxl</td>
							<td>2.5rem</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</>
);
