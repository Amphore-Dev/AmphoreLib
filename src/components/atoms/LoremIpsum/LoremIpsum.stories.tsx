import React from "react";
import { StoryFn } from "@storybook/react";
import { LoremIpsum } from "./LoremIpsum";

export default {
    title: "Components/Atoms/LoremIpsum",
    component: LoremIpsum,
    argTypes: {
        className: {
            control: "text",
        },
        count: {
            control: "number",
        },
        format: {
            options: ["plain", "html"],
            control: "radio",
        },
        paragraphLowerBound: {
            control: "range",
            min: 1,
            max: 3,
        },
        paragraphUpperBound: {
            control: "range",
            min: 1,
            max: 3,
        },
        random: {
            control: "object",
        },
        sentenceLowerBound: {
            control: "number",
        },
        sentenceUpperBound: {
            control: "number",
        },
        units: {
            options: ["words", "sentences", "paragraphs"],
            control: "radio",
        },
        words: {
            control: "array",
        },
        suffix: {
            control: "text",
        },
    },
};

const Template: StoryFn = (props) => {
    console.log(props);
    return <LoremIpsum {...props} />;
};

export const Base: any = Template.bind({});

Base.args = {};
