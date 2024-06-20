import React from "react";

import { LoremIpsum } from "@components/LoremIpsum";

import { cn } from "@utils/cn";

const menuItemClassNames =
	"menu-item p-4 text-center hover:bg-neutral-100 bg-white border-x-8 border-transparent !border-r-transparent duration-300 cursor-pointer w-full";

const activeMenuItemClassNames = "!border-black !bg-neutral-100 text-black";

export const DashboardLayout: React.FC = () => {
	const [IsMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
	const [ActiveRoute, setActiveRoute] = React.useState<string>("1");

	return (
		<div className="Dashboard relative grid aspect-[16/9] max-h-full min-h-[50vh] max-w-[90vw] grid-cols-12 grid-rows-6 overflow-hidden rounded-3xl shadow-2xl">
			{/* MENU */}
			<div
				className={cn([
					"dashboard-menu rounded-l-3xl",
					"absolute left-[-100%] z-10 col-span-2 row-span-full grid-rows-6 bg-white duration-1000 xl:relative xl:left-0 xl:grid xl:translate-x-[0%]",
					!IsMenuOpen && "max-xl:hidden",
					IsMenuOpen &&
						"!left-[0%] z-30 grid h-full w-full duration-300",
				])}
			>
				<div
					className="group absolute left-8 top-6 flex aspect-square w-[30px] cursor-pointer flex-col justify-center gap-2 xl:hidden [&>*]:duration-500"
					onClick={() => setIsMenuOpen(false)}
				>
					<hr className="border-2 border-neutral-300 group-hover:border-black" />
					<hr className="border-2 border-neutral-300 group-hover:border-black" />
					<hr className="border-2 border-neutral-300 group-hover:border-black" />
				</div>
				<div className="menu-item flex w-full flex-col items-center justify-center gap-6 gap-y-2 overflow-hidden rounded-3xl bg-white py-6 2xl:flex-row 2xl:py-10">
					{/* <Logo id="Logo" className="h-full min-h-[60px]" /> */}
					<div className="flex flex-col items-center gap-0">
						<span className="text-[1.5vw]">AMPHORE</span>
						<span className="text-[.75vw] leading-3">
							Development
						</span>
					</div>
				</div>
				<div className="w-full capitalize">
					<div
						className={cn([
							menuItemClassNames,
							ActiveRoute === "1" && activeMenuItemClassNames,
						])}
						onClick={() => setActiveRoute("1")}
					>
						<LoremIpsum units="words" count={2} />
					</div>
					<div
						className={cn([
							menuItemClassNames,
							ActiveRoute === "2" && activeMenuItemClassNames,
						])}
						onClick={() => setActiveRoute("2")}
					>
						<LoremIpsum units="words" count={2} />
					</div>
					<div
						className={cn([
							menuItemClassNames,
							ActiveRoute === "3" && activeMenuItemClassNames,
						])}
						onClick={() => setActiveRoute("3")}
					>
						<LoremIpsum units="words" count={2} />
					</div>
				</div>

				<div className="menu-footer row-start-7 space-y-2 p-3">
					<div className="cursor-pointer text-neutral-500 hover:text-black">
						Disconnect
					</div>
					<div className="text-neutral-400">© 2024 Amphore</div>
				</div>
			</div>

			{/* Content */}
			<div className="relative z-20 col-span-12 row-span-full grid-rows-6 rounded-r-3xl xl:col-span-10">
				<div className="relative flex h-full w-full flex-col">
					{/* Headbar */}
					<div className="dashboard-header text-md left-0 z-40 flex min-h-[70px] w-full bg-white px-4 py-2 duration-[1s]">
						<div className="flex items-center justify-center gap-6 gap-y-2 px-4 py-2 xl:hidden">
							<div
								className="group flex aspect-square w-[30px] cursor-pointer flex-col justify-center gap-2 [&>*]:duration-500"
								onClick={() => setIsMenuOpen(true)}
							>
								<hr className="border-2 border-neutral-300 group-hover:border-black" />
								<hr className="border-2 border-neutral-300 group-hover:border-black" />
								<hr className="border-2 border-neutral-300 group-hover:border-black" />
							</div>
							{/* <Logo id="Logo" className="h-[50px]" /> */}
							<div className="hidden flex-col items-center gap-0 md:flex">
								<span className="smdtext-[1.5vw] text-lg">
									AMPHORE
								</span>
								<span className="md:text-md text-md text-xs leading-3">
									Development
								</span>
							</div>
						</div>
						<div className="flex w-full items-center justify-end gap-10">
							<div className="flex items-center gap-10 text-neutral-400 [&>*:hover]:text-black">
								<div className="cursor-pointer">Contact</div>
								<div className="cursor-pointer">Settings</div>
							</div>
							<div className="flex cursor-pointer items-center gap-2 pr-2 text-neutral-400 hover:text-black">
								<div>
									<span className="">Siméon</span>
								</div>
								<div
									className="aspect-square w-[40px] rounded-full bg-neutral-200 bg-cover bg-center"
									style={{
										backgroundImage: `url('')`,
									}}
								></div>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="dashboard-content z-50 h-full overflow-y-auto overflow-x-visible bg-white p-10 shadow-[0px_0px_8px_3px_rgba(0,0,0,0.1)] duration-1000 xl:rounded-tl-[3rem]">
						<div className="" key={ActiveRoute}>
							<div className="row mb-10 gap-4">
								<h1 className="text-[3rem] font-bold capitalize leading-10">
									<LoremIpsum sentenceUpperBound={3} />
								</h1>
								<span className="text-neutral-400">
									<LoremIpsum />
								</span>
							</div>
							<div className="grid h-full auto-cols-auto grid-cols-1 gap-10 xl:grid-cols-2 2xl:grid-cols-3">
								<div className="rounded-xl bg-neutral-100 p-8 xl:col-span-2">
									<h2 className="mb-4 text-xl font-bold capitalize">
										<LoremIpsum units="words" count={3} />
									</h2>
									<LoremIpsum
										count={4}
										paragraphLowerBound={5}
										units="paragraphs"
									/>
								</div>
								<div className="rounded-xl bg-neutral-100 p-8 xl:row-span-2">
									<h2 className="mb-4 text-xl font-bold capitalize">
										<LoremIpsum units="words" count={3} />
									</h2>
									<LoremIpsum
										count={2}
										paragraphLowerBound={5}
										units="paragraphs"
									/>
								</div>
								<div className="rounded-xl bg-neutral-100 p-8">
									<h2 className="mb-4 text-xl font-bold capitalize">
										<LoremIpsum units="words" count={3} />
									</h2>
									<LoremIpsum
										count={2}
										paragraphLowerBound={3}
										units="paragraphs"
									/>
								</div>

								<div className="rounded-xl bg-neutral-100 p-8">
									<h2 className="mb-4 text-xl font-bold capitalize">
										<LoremIpsum units="words" count={3} />
									</h2>
									<LoremIpsum />
								</div>
								<div className="rounded-xl bg-neutral-100 p-8">
									<h2 className="mb-4 text-xl font-bold capitalize">
										<LoremIpsum units="words" count={3} />
									</h2>
									<LoremIpsum />
								</div>
								<div className="rounded-xl bg-neutral-100 p-8 xl:col-span-2 xl:row-span-6">
									<h2 className="mb-4 text-xl font-bold capitalize">
										<LoremIpsum units="words" count={3} />
									</h2>
									<LoremIpsum units="paragraph" count={6} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
