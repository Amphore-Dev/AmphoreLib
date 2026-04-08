import React from "react";

import FR from "./assets/flags/FR.svg";
// Flags icon
// flags can be found here: https://purecatamphetamine.github.io/country-flag-icons/3x2/index.html
import US from "./assets/flags/US.svg";
import { Picto } from "@components/atoms";

import "./LanguageSwitcher.scss";

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
		<div className="al__language-switcher">
			{Trads.map((lang) => {
				return (
					<div
						className="al__language-switcher__item"
						key={lang.code}
					>
						<button
							className="al__language-switcher__button"
							onClick={() => handleClick(lang.code)}
						>
							<Picto
								className={
									"flag-icon al__language-switcher__flag"
								}
								src={lang.icon}
								currentColor={false}
							/>
							<span>{lang.title}</span>
						</button>
					</div>
				);
			})}
		</div>
	);
};
