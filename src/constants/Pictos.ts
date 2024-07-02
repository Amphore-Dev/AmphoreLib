import Add from "../assets/pictos/add.svg";
import Alert from "../assets/pictos/alert.svg";
import Calendar from "../assets/pictos/calendar.svg";
import Eye from "../assets/pictos/eye.svg";
import EyeOff from "../assets/pictos/eyeOff.svg";
import Info from "../assets/pictos/info.svg";
import Logo from "../assets/pictos/logo.svg";
import Success from "../assets/pictos/success.svg";

export type TPictoName = keyof typeof Pictos;

export type TPictos = {
	[key in TPictoName]: string;
};

export const Pictos = {
	logo: Logo,
	add: Add,
	alert: Alert,
	calendar: Calendar,
	info: Info,
	eye: Eye,
	eyeOff: EyeOff,
	success: Success,
};
