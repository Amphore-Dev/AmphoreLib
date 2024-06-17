import React from "react";
import { Meta } from "@storybook/addon-docs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHouse,
	faEnvelope,
	faHeart,
	faCloud,
	faComment,
	faFile,
	faBomb,
	faPoo,
	faBolt,
	faFire,
} from "@fortawesome/free-solid-svg-icons";
import {
	faSlack,
	faGoogle,
	faInstagram,
	faTiktok,
	faLinkedin,
	faGithub,
	faApple,
	faFigma,
	faPlaystation,
	faMedium,
} from "@fortawesome/free-brands-svg-icons";

export default {
	title: "Style Guide/Icons",
	parameters: {
		docs: {
			page: () => (
				<>
					<Meta title="Style Guide/Icons" />
					<h1>Icons</h1>
					<p>
						A collection of Font Awesome icons. Namely a few (some
						of which I don't even use lol).
					</p>
					<h2>Solid icons</h2>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "20px",
						}}
					>
						<div>
							<h3>house</h3>
							<FontAwesomeIcon icon={faHouse} />
						</div>
						<div>
							<h3>envelope</h3>
							<FontAwesomeIcon icon={faEnvelope} />
						</div>
						<div>
							<h3>heart</h3>
							<FontAwesomeIcon icon={faHeart} />
						</div>
						<div>
							<h3>cloud</h3>
							<FontAwesomeIcon icon={faCloud} />
						</div>
						<div>
							<h3>comment</h3>
							<FontAwesomeIcon icon={faComment} />
						</div>
						<div>
							<h3>file</h3>
							<FontAwesomeIcon icon={faFile} />
						</div>
						<div>
							<h3>bomb</h3>
							<FontAwesomeIcon icon={faBomb} />
						</div>
						<div>
							<h3>poo</h3>
							<FontAwesomeIcon icon={faPoo} />
						</div>
						<div>
							<h3>bolt</h3>
							<FontAwesomeIcon icon={faBolt} />
						</div>
						<div>
							<h3>fire</h3>
							<FontAwesomeIcon icon={faFire} />
						</div>
					</div>
					<h2>Brand icons</h2>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "20px",
						}}
					>
						<div>
							<h3>slack</h3>
							<FontAwesomeIcon icon={faSlack} />
						</div>
						<div>
							<h3>google</h3>
							<FontAwesomeIcon icon={faGoogle} />
						</div>
						<div>
							<h3>instagram</h3>
							<FontAwesomeIcon icon={faInstagram} />
						</div>
						<div>
							<h3>tiktok</h3>
							<FontAwesomeIcon icon={faTiktok} />
						</div>
						<div>
							<h3>linkedin</h3>
							<FontAwesomeIcon icon={faLinkedin} />
						</div>
						<div>
							<h3>github</h3>
							<FontAwesomeIcon icon={faGithub} />
						</div>
						<div>
							<h3>apple</h3>
							<FontAwesomeIcon icon={faApple} />
						</div>
						<div>
							<h3>figma</h3>
							<FontAwesomeIcon icon={faFigma} />
						</div>
						<div>
							<h3>playstation</h3>
							<FontAwesomeIcon icon={faPlaystation} />
						</div>
						<div>
							<h3>medium</h3>
							<FontAwesomeIcon icon={faMedium} />
						</div>
					</div>
				</>
			),
		},
	},
};

export const All = () => (
	<>
		<h1>Icons</h1>
		<p>
			A collection of Font Awesome icons. Namely a few (some of which I
			don't even use lol).
		</p>
		<h2>Solid icons</h2>
		<div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
			<div>
				<h3>house</h3>
				<FontAwesomeIcon icon={faHouse} />
			</div>
			<div>
				<h3>envelope</h3>
				<FontAwesomeIcon icon={faEnvelope} />
			</div>
			<div>
				<h3>heart</h3>
				<FontAwesomeIcon icon={faHeart} />
			</div>
			<div>
				<h3>cloud</h3>
				<FontAwesomeIcon icon={faCloud} />
			</div>
			<div>
				<h3>comment</h3>
				<FontAwesomeIcon icon={faComment} />
			</div>
			<div>
				<h3>file</h3>
				<FontAwesomeIcon icon={faFile} />
			</div>
			<div>
				<h3>bomb</h3>
				<FontAwesomeIcon icon={faBomb} />
			</div>
			<div>
				<h3>poo</h3>
				<FontAwesomeIcon icon={faPoo} />
			</div>
			<div>
				<h3>bolt</h3>
				<FontAwesomeIcon icon={faBolt} />
			</div>
			<div>
				<h3>fire</h3>
				<FontAwesomeIcon icon={faFire} />
			</div>
		</div>
		<h2>Brand icons</h2>
		<div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
			<div>
				<h3>slack</h3>
				<FontAwesomeIcon icon={faSlack} />
			</div>
			<div>
				<h3>google</h3>
				<FontAwesomeIcon icon={faGoogle} />
			</div>
			<div>
				<h3>instagram</h3>
				<FontAwesomeIcon icon={faInstagram} />
			</div>
			<div>
				<h3>tiktok</h3>
				<FontAwesomeIcon icon={faTiktok} />
			</div>
			<div>
				<h3>linkedin</h3>
				<FontAwesomeIcon icon={faLinkedin} />
			</div>
			<div>
				<h3>github</h3>
				<FontAwesomeIcon icon={faGithub} />
			</div>
			<div>
				<h3>apple</h3>
				<FontAwesomeIcon icon={faApple} />
			</div>
			<div>
				<h3>figma</h3>
				<FontAwesomeIcon icon={faFigma} />
			</div>
			<div>
				<h3>playstation</h3>
				<FontAwesomeIcon icon={faPlaystation} />
			</div>
			<div>
				<h3>medium</h3>
				<FontAwesomeIcon icon={faMedium} />
			</div>
		</div>
	</>
);
