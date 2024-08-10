import AlertCircle from "../assets/pictos/alert-circle.svg";
import AlertTriangle from "../assets/pictos/alert-triangle.svg";
import Archive from "../assets/pictos/archive.svg";
import ArrowCircle from "../assets/pictos/arrow-right-circle.svg";
import Arrow from "../assets/pictos/arrow-right.svg";
import ArrowUR from "../assets/pictos/arrow-up-right.svg";
import BarChart from "../assets/pictos/bar-chart.svg";
import Calendar from "../assets/pictos/calendar.svg";
import CheckCircle from "../assets/pictos/check-circle.svg";
import Check from "../assets/pictos/check.svg";
import Chevron from "../assets/pictos/chevron-right.svg";
import Chevrons from "../assets/pictos/chevrons-right.svg";
import Clock from "../assets/pictos/clock.svg";
import Copy from "../assets/pictos/copy.svg";
import Delete from "../assets/pictos/delete.svg";
import Download from "../assets/pictos/download.svg";
import Pen from "../assets/pictos/edit-2.svg";
import Edit from "../assets/pictos/edit-3.svg";
import EditSquare from "../assets/pictos/edit.svg";
import ExternalLink from "../assets/pictos/external-link.svg";
import EyeOff from "../assets/pictos/eye-off.svg";
import Eye from "../assets/pictos/eye.svg";
import FileMinus from "../assets/pictos/file-minus.svg";
import FilePlus from "../assets/pictos/file-plus.svg";
import File from "../assets/pictos/file.svg";
import Filter from "../assets/pictos/filter.svg";
import FolderMinus from "../assets/pictos/folder-minus.svg";
import FolderPlus from "../assets/pictos/folder-plus.svg";
import Folder from "../assets/pictos/folder.svg";
import HeartFill from "../assets/pictos/heart-fill.svg";
import Heart from "../assets/pictos/heart.svg";
import HelpCircle from "../assets/pictos/help-circle.svg";
import Home from "../assets/pictos/home.svg";
import InfoCircle from "../assets/pictos/info-circle.svg";
import LinkH from "../assets/pictos/link-2.svg";
import Link from "../assets/pictos/link.svg";
import List from "../assets/pictos/list.svg";
import Lock from "../assets/pictos/lock.svg";
import LogIn from "../assets/pictos/log-in.svg";
import LogOut from "../assets/pictos/log-out.svg";
import Logo from "../assets/pictos/logo.svg";
import Mail from "../assets/pictos/mail.svg";
import Maximize from "../assets/pictos/maximize-2.svg";
import Menu from "../assets/pictos/menu.svg";
import MessageSquare from "../assets/pictos/message-square.svg";
import Minimize from "../assets/pictos/minimize-2.svg";
import MinusCircle from "../assets/pictos/minus-circle.svg";
import Minus from "../assets/pictos/minus.svg";
import Moon from "../assets/pictos/moon.svg";
import MoreHorizontal from "../assets/pictos/more-horizontal.svg";
import PieChart from "../assets/pictos/pie-chart.svg";
import AddCircle from "../assets/pictos/plus-circle.svg";
import Add from "../assets/pictos/plus.svg";
import Power from "../assets/pictos/power.svg";
import Search from "../assets/pictos/search.svg";
import Send from "../assets/pictos/send.svg";
import Settings from "../assets/pictos/settings.svg";
import Share from "../assets/pictos/share-2.svg";
import Slash from "../assets/pictos/slash.svg";
import SortAsc from "../assets/pictos/sort-asc.svg";
import SortDesc from "../assets/pictos/sort-desc.svg";
import StarFill from "../assets/pictos/star-fill.svg";
import Star from "../assets/pictos/star.svg";
import Sun from "../assets/pictos/sun.svg";
import Tag from "../assets/pictos/tag.svg";
import Terminal from "../assets/pictos/terminal.svg";
import Trash from "../assets/pictos/trash-2.svg";
import Unlock from "../assets/pictos/unlock.svg";
import Upload from "../assets/pictos/upload.svg";
import User from "../assets/pictos/user.svg";
import CrossCircle from "../assets/pictos/x-circle.svg";
import Cross from "../assets/pictos/x.svg";

export type TPictoName = keyof typeof Pictos;

export type TPictos = {
	[key in TPictoName]: string;
};

export const Pictos = {
	logo: Logo,
	add: Add,
	addCircle: AddCircle,
	alert: AlertCircle,
	alertTriangle: AlertTriangle,
	archive: Archive,
	arrow: Arrow,
	arrowCircle: ArrowCircle,
	arrowUpRight: ArrowUR,
	barChart: BarChart,
	calendar: Calendar,
	check: Check,
	checkCircle: CheckCircle,
	chevron: Chevron,
	chevrons: Chevrons,
	clock: Clock,
	copy: Copy,
	cross: Cross,
	crossCircle: CrossCircle,
	delete: Delete,
	download: Download,
	edit: Edit,
	editSquare: EditSquare,
	externalLink: ExternalLink,
	eye: Eye,
	eyeOff: EyeOff,
	file: File,
	fileMinus: FileMinus,
	filePlus: FilePlus,
	filter: Filter,
	folder: Folder,
	folderMinus: FolderMinus,
	folderPlus: FolderPlus,
	heart: Heart,
	heartFill: HeartFill,
	help: HelpCircle,
	home: Home,
	info: InfoCircle,
	link: Link,
	linkH: LinkH,
	list: List,
	lock: Lock,
	login: LogIn,
	logout: LogOut,
	mail: Mail,
	maximize: Maximize,
	menu: Menu,
	messageSquare: MessageSquare,
	minimize: Minimize,
	minus: Minus,
	minusCircle: MinusCircle,
	moon: Moon,
	more: MoreHorizontal,
	pen: Pen,
	pieChart: PieChart,
	power: Power,
	search: Search,
	send: Send,
	settings: Settings,
	share: Share,
	slash: Slash,
	sortAsc: SortAsc,
	sortDesc: SortDesc,
	star: Star,
	starFill: StarFill,
	sun: Sun,
	tag: Tag,
	terminal: Terminal,
	trash: Trash,
	unlock: Unlock,
	upload: Upload,
	user: User,
};
