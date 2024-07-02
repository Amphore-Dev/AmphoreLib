import React from "react";

import { TextField } from "ertylib";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import "./App.css";

const App: React.FC = () => {
	const validationSchema = Yup.object().shape({
		name: Yup.string().required("Name is required"),
	});
	return (
		<div className="App">
			<Formik
				initialValues={{
					name: "",
				}}
				onSubmit={(values) => {}}
				validationSchema={validationSchema}
			>
				{({ values }) => {
					return (
						<Form>
							<TextField name="name" label="Name" />
							<TextField name="firstName" label="Name" />
							<TextField name="okok" label="Name" />
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};

export default App;
