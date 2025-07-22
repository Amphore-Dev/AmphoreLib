export interface IChartProps {
	className?: string; // classe CSS pour le style personnalisé
	animationDuration?: number; // en ms, par défaut 500ms
	animate?: boolean; // si true, l'animation est activée
	animateOnMount?: boolean; // si true, l'animation se déclenche au premier rendu
	animationDelay?: number; // délai avant le début de l'animation, en ms
}
