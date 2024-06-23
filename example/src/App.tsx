import React from "react";

import { Button, InfoMessage, Picto, Spinner, Title } from "ertylib";

import logo from "./logo.svg";

import "./App.css";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
				<Button>OK</Button>
				<Title tag="h1">Hello World</Title>
				<Title tag="h3">Hello World</Title>
				<h1>Hello World</h1>
				<Picto icon="logo" />
				<InfoMessage>OKOK</InfoMessage>
				<Spinner />
			</header>
		</div>
	);
}

export default App;
