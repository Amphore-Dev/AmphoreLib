// scripts/convert-svg.js
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

import { transform } from "@svgr/core";

const CONV_DIR = path.resolve("src/assets/pictos/conv");
const OUTPUT_DIR = path.resolve("src/assets/pictos");
const C_PICTOS_PATH = path.resolve("src/constants/CPictos.ts");

const [nameArg] = process.argv.slice(2).filter((arg) => arg !== "--");

// Résoudre la liste des fichiers SVG à traiter
let svgFiles = [];

if (nameArg) {
	const svgPath = path.join(CONV_DIR, `${nameArg}.svg`);
	if (!fs.existsSync(svgPath)) {
		console.error(`Fichier SVG introuvable : ${svgPath}`);
		process.exit(1);
	}
	svgFiles = [svgPath];
} else {
	if (!fs.existsSync(CONV_DIR)) {
		console.error(
			`Dossier introuvable : ${CONV_DIR}\nCrée-le et place tes SVG dedans.`
		);
		process.exit(1);
	}
	svgFiles = fs
		.readdirSync(CONV_DIR)
		.filter((f) => f.endsWith(".svg"))
		.map((f) => path.join(CONV_DIR, f));

	if (svgFiles.length === 0) {
		console.log(`Aucun SVG trouvé dans ${CONV_DIR}`);
		process.exit(0);
	}
}

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

(async () => {
	for (const svgFilePath of svgFiles) {
		await convertFile(svgFilePath);
	}

	const indexPath = path.join(OUTPUT_DIR, "index.ts");
	console.log("🎨 Formatage prettier...");
	execSync(`npx prettier --write "${indexPath}" "${C_PICTOS_PATH}"`, {
		stdio: "inherit",
	});
	console.log("✅ Prettier OK");
})();

async function convertFile(svgFilePath) {
	const rawName = path.basename(svgFilePath, ".svg");
	const componentBaseName =
		rawName.charAt(0).toUpperCase() + rawName.slice(1);
	const componentName = `SVG${componentBaseName}`;
	const tsxFilePath = path.join(OUTPUT_DIR, `${componentName}.tsx`);

	const svgCode = fs.readFileSync(svgFilePath, "utf8");

	const tsxCode = await transform(
		svgCode,
		{
			icon: true,
			typescript: true,
			prettier: true,
			jsxRuntime: "classic",
			plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
			replaceAttrValues: {
				"#333333": "currentColor",
				"#000": "currentColor",
			},
			svgoConfig: {
				plugins: [
					{
						name: "preset-default",
						params: { overrides: { removeViewBox: false } },
					},
					{
						name: "convertColors",
						params: { currentColor: true },
					},
				],
			},
		},
		{ componentName }
	);

	fs.writeFileSync(tsxFilePath, tsxCode, "utf8");
	console.log(`✅ Composant créé : ${tsxFilePath}`);

	console.log(`🔧 ESLint fix sur ${componentName}.tsx...`);
	execSync(`npx eslint '${tsxFilePath}' --fix`, { stdio: "inherit" });
	console.log(`✅ ESLint OK`);

	// ---- index.ts ----
	const indexPath = path.join(OUTPUT_DIR, "index.ts");
	fs.appendFileSync(
		indexPath,
		`\nexport { default as ${componentBaseName} } from "./${componentName}";`
	);

	// ---- CPictos.ts ----
	addToCPictos(componentBaseName, componentBaseName.toLowerCase());

	console.log(`✅ Picto ${componentBaseName} ajouté`);
}

function addToCPictos(iconName, keyName) {
	let content = fs.readFileSync(C_PICTOS_PATH, "utf8");

	if (content.match(new RegExp(`\\s${keyName}:`))) {
		console.log(`⚠️  La clé ${keyName} existe déjà dans CPictos.ts`);
		return false;
	}

	// Ajouter l'import
	const importMatch = content.match(
		/(import \{[\s\S]*?\} from "\.\.\/assets\/pictos";)/
	);
	if (importMatch) {
		const importBlock = importMatch[1];
		if (!importBlock.includes(iconName)) {
			const importLines = importBlock.split("\n");
			let insertIndex = importLines.length - 1;

			for (let i = 0; i < importLines.length; i++) {
				const match = importLines[i].match(/\t(\w+),/);
				if (match && match[1] > iconName) {
					insertIndex = i;
					break;
				}
			}

			importLines.splice(insertIndex, 0, `\t${iconName},`);
			content = content.replace(importMatch[1], importLines.join("\n"));
		}
	} else {
		console.warn(
			"⚠️  Impossible de trouver le bloc d'import dans CPictos.ts"
		);
	}

	// Ajouter dans l'objet Pictos
	const pictosMatch = content.match(/(export const Pictos = \{[\s\S]*?\};)/);
	if (pictosMatch) {
		const pictosBlock = pictosMatch[1];
		if (!pictosBlock.match(new RegExp(`\\s${keyName}:`))) {
			const pictosLines = pictosBlock.split("\n");
			let insertIndex = pictosLines.length - 1;

			for (let i = 0; i < pictosLines.length; i++) {
				const match = pictosLines[i].match(/\t(\w+):/);
				if (match && match[1] > keyName) {
					insertIndex = i;
					break;
				}
			}

			pictosLines.splice(insertIndex, 0, `\t${keyName}: ${iconName},`);
			content = content.replace(pictosMatch[1], pictosLines.join("\n"));
		}
	} else {
		console.warn(
			"⚠️  Impossible de trouver l'objet Pictos dans CPictos.ts"
		);
		return false;
	}

	fs.writeFileSync(C_PICTOS_PATH, content, "utf8");
	return true;
}
