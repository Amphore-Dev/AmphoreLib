import React from "react";
// @ts-ignore
import Logo from "@assets/logo.svg";
// @ts-ignore
import profilePicture from "./assets/profile.png";
import { LoremIpsum } from "@components/atoms/LoremIpsum/LoremIpsum";

import "./DashboardLayout.scss";
import cn from "utils/cn";
const menuItemClassNames =
    "menu-item p-4 text-center hover:bg-neutral-100 bg-white border-x-8 border-transparent !border-r-transparent duration-300 cursor-pointer w-full";

const activeMenuItemClassNames = "!border-black !bg-neutral-100 text-black";

export const DashboardLayout: React.FC = () => {
    const [IsMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
    const [ActiveRoute, setActiveRoute] = React.useState<string>("1");

    return (
        <div className="Dashboard rounded-3xl max-w-[90vw] aspect-[16/9] min-h-[50vh] max-h-full grid-cols-12 grid grid-rows-6 overflow-hidden shadow-2xl relative">
            {/* MENU */}
            <div
                className={cn([
                    "dashboard-menu rounded-l-3xl",
                    "col-span-2 bg-white absolute row-span-full xl:grid grid-rows-6 z-10 xl:relative left-[-100%] xl:left-0 xl:translate-x-[0%] duration-1000",
                    !IsMenuOpen && "max-xl:hidden",
                    IsMenuOpen &&
                        "z-30  h-full w-full grid !left-[0%] duration-300",
                ])}
            >
                <div
                    className="absolute xl:hidden top-6 left-8 flex flex-col w-[30px] aspect-square gap-2 justify-center cursor-pointer group [&>*]:duration-500 "
                    onClick={() => setIsMenuOpen(false)}
                >
                    <hr className="border-neutral-300 border-2 group-hover:border-black" />
                    <hr className="border-neutral-300 border-2 group-hover:border-black" />
                    <hr className="border-neutral-300 border-2 group-hover:border-black" />
                </div>
                <div className="menu-item flex items-center flex-col 2xl:flex-row py-6 2xl:py-10 gap-y-2 gap-6 justify-center w-full overflow-hidden bg-white rounded-3xl">
                    <Logo id="Logo" className="h-full min-h-[60px]" />
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

                <div className="menu-footer row-start-7 p-3 space-y-2">
                    <div className="text-neutral-500 hover:text-black cursor-pointer">
                        Disconnect
                    </div>
                    <div className="text-neutral-400">© 2024 Amphore</div>
                </div>
            </div>

            {/* Content */}
            <div className=" row-span-full col-span-12 xl:col-span-10 grid-rows-6 z-20 relative rounded-r-3xl">
                <div className="h-full w-full flex flex-col relative">
                    {/* Headbar */}
                    <div className="dashboard-header bg-white duration-[1s] left-0 z-40 px-4 py-2 min-h-[70px] flex w-full text-md">
                        <div className="xl:hidden flex items-center px-4 py-2 gap-y-2 gap-6 justify-center">
                            <div
                                className="flex flex-col w-[30px] aspect-square gap-2 justify-center cursor-pointer group [&>*]:duration-500 "
                                onClick={() => setIsMenuOpen(true)}
                            >
                                <hr className="border-neutral-300 border-2 group-hover:border-black" />
                                <hr className="border-neutral-300 border-2 group-hover:border-black" />
                                <hr className="border-neutral-300 border-2 group-hover:border-black" />
                            </div>
                            <Logo id="Logo" className="h-[50px]" />
                            <div className="flex-col items-center gap-0 hidden md:flex">
                                <span className="text-lg smdtext-[1.5vw]">
                                    AMPHORE
                                </span>
                                <span className="text-xs md:text-md text-md leading-3">
                                    Development
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end gap-10 items-center w-full">
                            <div className="flex items-center gap-10 text-neutral-400 [&>*:hover]:text-black">
                                <div className="cursor-pointer">Contact</div>
                                <div className="cursor-pointer">Settings</div>
                            </div>
                            <div className="flex pr-2 items-center gap-2 cursor-pointer text-neutral-400 hover:text-black">
                                <div>
                                    <span className="">Siméon</span>
                                </div>
                                <div
                                    className="rounded-full aspect-square w-[40px] bg-cover bg-neutral-200 bg-center"
                                    style={{
                                        backgroundImage: `url(${profilePicture})`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="dashboard-content p-10 shadow-[0px_0px_8px_3px_rgba(0,0,0,0.1)] z-50 overflow-x-visible overflow-y-auto h-full xl:rounded-tl-[3rem] duration-1000 bg-white">
                        <div className="" key={ActiveRoute}>
                            <div className="row gap-4 mb-10">
                                <h1 className="text-[3rem] leading-10 font-bold capitalize">
                                    <LoremIpsum sentenceUpperBound={3} />
                                </h1>
                                <span className="text-neutral-400">
                                    <LoremIpsum />
                                </span>
                            </div>
                            <div className="grid gap-10 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 auto-cols-auto h-full">
                                <div className="bg-neutral-100 p-8 rounded-xl xl:col-span-2">
                                    <h2 className="text-xl font-bold mb-4 capitalize">
                                        <LoremIpsum units="words" count={3} />
                                    </h2>
                                    <LoremIpsum
                                        count={4}
                                        paragraphLowerBound={5}
                                        units="paragraphs"
                                    />
                                </div>
                                <div className="bg-neutral-100 p-8 rounded-xl xl:row-span-2">
                                    <h2 className="text-xl font-bold mb-4 capitalize">
                                        <LoremIpsum units="words" count={3} />
                                    </h2>
                                    <LoremIpsum
                                        count={2}
                                        paragraphLowerBound={5}
                                        units="paragraphs"
                                    />
                                </div>
                                <div className="bg-neutral-100 p-8 rounded-xl">
                                    <h2 className="text-xl font-bold mb-4 capitalize">
                                        <LoremIpsum units="words" count={3} />
                                    </h2>
                                    <LoremIpsum
                                        count={2}
                                        paragraphLowerBound={3}
                                        units="paragraphs"
                                    />
                                </div>

                                <div className="bg-neutral-100 p-8 rounded-xl">
                                    <h2 className="text-xl font-bold mb-4 capitalize">
                                        <LoremIpsum units="words" count={3} />
                                    </h2>
                                    <LoremIpsum />
                                </div>
                                <div className="bg-neutral-100 p-8 rounded-xl">
                                    <h2 className="text-xl font-bold mb-4 capitalize">
                                        <LoremIpsum units="words" count={3} />
                                    </h2>
                                    <LoremIpsum />
                                </div>
                                <div className="bg-neutral-100 p-8 rounded-xl xl:col-span-2 xl:row-span-6">
                                    <h2 className="text-xl font-bold mb-4 capitalize">
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
