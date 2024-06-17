import React from "react";

import { useTranslation } from "react-i18next";

import FR from "./assets/flags/FR.svg";
// Flags icon
// flags can be found here: https://purecatamphetamine.github.io/country-flag-icons/3x2/index.html
import US from "./assets/flags/US.svg";

interface ILanguage {
	code: string; // language code ex: en-EN, fr-FR, fr-CA
	title: string; // displayed text
	icon: string; // svg icon
}

export interface ILanguageSwitcher {
	handleChange?: (code: string) => void; // callback function, reload page if not specified
}

const Trads: ILanguage[] = [
	{
		code: "en-EN",
		title: "English",
		icon: US,
	},
	{
		code: "fr-FR",
		title: "Français",
		icon: FR,
	},
];

export const LanguageSwitcher: React.FC<ILanguageSwitcher> = ({
	handleChange,
}) => {
	function handleClick(code: string) {
		if (handleChange) handleChange(code);
		else window.location.reload();
	}

	return (
		<div className="flex flex-wrap gap-4">
			{Trads.map((lang) => {
				console.log(lang);
				return (
					<div className="text-black dark:text-white" key={lang.code}>
						<button
							className="flex items-center"
							onClick={() => handleClick(lang.code)}
						>
							<img
								className={"flag-icon mr-2 w-5 h-5"}
								src={lang.icon}
							/>
							<span>{lang.title}</span>
						</button>
					</div>
				);
			})}
		</div>
	);
};
