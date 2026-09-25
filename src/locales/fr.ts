import type { TThemeLabels } from "@theme/TThemeLabels";

/**
 * French bundle — same shape as `en.ts`, pass to `<AmphoreProvider
 * locale="fr">` or `config={{ labels: fr }}`. Doesn't need every key
 * covered the way `en.ts` does: `mergeConfig`'s per-component merge (see
 * `mergeLabels` in UThemeConfig.ts) layers this over `en` (the base
 * default), so anything missing here still resolves in English, never an
 * empty string.
 */
export const fr: TThemeLabels = {
	common: {
		cancel: "Annuler",
		confirm: "Confirmer",
		reset: "Réinitialiser",
		submit: "Valider",
		add: "Ajouter",
		edit: "Modifier",
		close: "Fermer",
		remove: "Retirer",
		clear: "Effacer",
		back: "Retour",
		loading: "Chargement",
	},
	ActiveFilters: {
		resetLabel: "Réinitialiser",
		showMoreLabel: "Voir plus",
		showLessLabel: "Voir moins",
	},
	AddTodoItem: {
		placeholder: "Ajouter…",
		buttonLabel: "Ajouter",
	},
	Badge: {
		removeLabel: "Retirer",
	},
	BottomPanel: {
		openLabel: "Panneau ouvert",
		collapsedLabel: "Panneau réduit",
		collapseLabel: "Réduire le panneau",
		expandLabel: "Agrandir le panneau",
	},
	Breadcrumb: {
		navigationLabel: "Fil d'Ariane",
	},
	ConfirmModal: {
		cancelText: "Annuler",
		confirmText: "Confirmer",
	},
	DatePicker: {
		placeholder: "jj/mm/aaaa",
	},
	EditableCard: {
		editLabel: "Modifier",
		addLabel: "Ajouter",
	},
	FileViewer: {
		zoomOutLabel: "Réduire",
		zoomInLabel: "Agrandir",
		resetZoomLabel: "Réinitialiser le zoom",
		previousPageLabel: "Page précédente",
		nextPageLabel: "Page suivante",
		downloadLabel: "Télécharger",
		loadingLabel: "Chargement du document",
		pdfErrorLabel: "Impossible d'afficher ce PDF.",
		unsupportedFormatLabel: "Format non pris en charge",
		previewAltLabel: "Aperçu",
	},
	FiltersModal: {
		title: "Filtres",
		buttonLabel: "Filtrer",
		applyLabel: "Appliquer",
		resetLabel: "Réinitialiser les filtres",
	},
	FormRenderer: {
		submitLabel: "Valider",
		cancelLabel: "Annuler",
		resetLabel: "Réinitialiser",
		resetFormLabel: "Réinitialiser les champs",
	},
	HeadBar: {
		menuLabel: "Menu",
	},
	InfoMessage: {
		closeLabel: "Fermer",
	},
	Input: {
		clearLabel: "Effacer",
	},
	InputFile: {
		placeholder: "Ajouter un fichier",
		removeFileLabel: "Retirer le fichier",
	},
	Modal: {
		closeLabel: "Fermer",
	},
	NumberInput: {
		increaseLabel: "Augmenter",
		decreaseLabel: "Diminuer",
	},
	PageHeader: {
		loadingLabel: "Chargement...",
		onBackLabel: "Retour",
	},
	PasswordField: {
		hidePasswordLabel: "Masquer le mot de passe",
		showPasswordLabel: "Afficher le mot de passe",
	},
	Select: {
		loadingMessage: "Chargement...",
		placeholder: "Sélectionner...",
		noResultsMessage: "Aucun résultat",
		clearLabel: "Effacer",
	},
	SidePanel: {
		closeLabel: "Fermer",
	},
	Spinner: {
		label: "Chargement",
	},
	Table: {
		noDataMessage: "Aucune donnée",
	},
	Tabs: {
		scrollLeftLabel: "Défiler à gauche",
		scrollRightLabel: "Défiler à droite",
	},
	TimePicker: {
		hoursLabel: "Heures",
		minutesLabel: "Minutes",
	},
	TodoItem: {
		removeLabel: "Retirer",
	},
	TodoList: {
		moveLabel: "Déplacer (flèches haut/bas)",
	},
	Tour: {
		nextLabel: "Suivant",
		prevLabel: "Précédent",
		skipLabel: "Passer",
		doneLabel: "Terminer",
		stepOfLabel: "Étape {current} sur {total}",
	},
};
