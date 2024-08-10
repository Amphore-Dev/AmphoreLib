# File Generator README.md

Script qui permet de créer des fichiers en suivant des templates
les indexes des dossiers sont aussi mis à jour lors du process

## Utilisation

`yarn new <file_type> <file_name>`

Available files types: `atom | molecule | organism | template | view | service | type | util | constant | form`

---

## Ajouter un type

Pour ajouter un type:

-   dans le fichier `./src/paths.sh`, ajoutez le chemin du dossier de destination des fichiers générés pour le type

-   créer le fichier builder dans `./src/builders`

    -   les arguments reçus par le builder sont:
        -   `$1`: le nom du type
        -   `$2`: le nom du fichier
        -   `$3`: le chemin de destination

-   ajouter l'import du fichier builder depuis `./src/imports.sh`

-   si le type se base sur un template, créer un fichier `template_name.template` dans le dossier `./templates`

-   aller dans le fichier `./src/types.sh`

    -   ajouter le nom du type dans la liste TYPES_NAMES
    -   ajouter le chemin de destination dans la liste TYPES_PATHS
    -   ajouter le nom du builder dans la liste TYPES_BUILDERS

    ### ATTENTION : l'ordre des éléments dans les listes doit ABSOLUMENT être le même

---

## Exemples

### Composants

file_type: `atom | molecule | organism | template`

ex: `yarn new atom test` génère ce fichier

```javascript
import React from "react";

export interface ITestProps {}

export const Test: React.FC<ITestProps> = () => {
	return <div>Test</div>;
};
```

a partir du template `component.template`

```javascript
import React from "react";

export interface I{COMPONENT_NAME}Props {
}

export const {COMPONENT_NAME}: React.FC<I{COMPONENT_NAME}Props> = () => {
    return (
        <div>
            {COMPONENT_NAME}
        </div>
    );
};
```

et ajoute cette ligne dans `src/components/atoms/index.ts`

```javascript
export * from "./Test/Test";
```

---

### Form

`yarn new form test` génère ces fichiers

#### - TestForm.tsx

```javascript
import React from "react";
import { Formik, Form } from "formik";
import {
	TestFormInitialValues,
	TestFormValidation,
	ITestFormValues,
} from "./TestFormValidation";
import { t } from "i18next";

interface ITestFormProps {
	onSubmit: (values: ITestFormValues, formikHelpers: any) => Promise<any>;
}

export const TestForm: React.FC<ITestFormProps> = ({ onSubmit }) => {
	return (
		<Formik
			initialValues={TestFormInitialValues}
			onSubmit={onSubmit}
			validationSchema={TestFormValidation(t)}
		>
			{({ isValid, dirty, isSubmitting, errors }) => {
				return (
					<Form>
						<div>Test</div>
					</Form>
				);
			}}
		</Formik>
	);
};
```

a partir du template `form.template`

```javascript
import React from "react";
import { Formik, Form } from "formik";
import {
    {FORM_NAME}FormInitialValues,
    {FORM_NAME}FormValidation,
    I{FORM_NAME}FormValues
} from "./{FORM_NAME}FormValidation"
import { t } from "i18next";

interface I{FORM_NAME}FormProps {
    onSubmit: (values: I{FORM_NAME}FormValues, formikHelpers: any) => Promise<any>;
}

export const {FORM_NAME}Form: React.FC<I{FORM_NAME}FormProps> = ({
    onSubmit
}) => {

    return (
        <Formik
            initialValues={{FORM_NAME}FormInitialValues}
            onSubmit={onSubmit}
            validationSchema={{FORM_NAME}FormValidation(t)}
        >
        	{({ isValid, dirty, isSubmitting, errors }) => {
				return (
					<Form>
                        <div>{FORM_NAME}</div>
                    </Form>
                );
            }}
        </Formik>
    );
};
```

#### - TestFormValidation.ts

```javascript
import * as Yup from "yup";

export interface ITestFormValues {}

export const TestFormInitialValues = {};

export const TestFormValidation = (t: any) => {
	return Yup.object().shape({});
};
```

a partir du fichier `formValidation.template`

```javascript
import * as Yup from "yup";

export interface I{FORM_NAME}FormValues {

}

export const {FORM_NAME}FormInitialValues = {

}

export const {FORM_NAME}FormValidation = (t:any) => {

    return Yup.object().shape({

    })
}
```

et ajoute cette ligne dans `src/forms/index.ts`

```javascript
export * from "./TestForm/TestForm";
```
