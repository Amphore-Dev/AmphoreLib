import React from "react";
import { Meta } from "@storybook/addon-docs";

export default {
  title: 'Style Guide/Shadows',
  parameters: {
    docs: {
      page: () => (
        <>
          <Meta title="Style Guide/Shadows" />
          <h1>Shadows</h1>
          <p>A list of shadows which help in adding depth and realism to our designs.</p>
          <p>The below shadows are default utility classes from Tailwind CSS.</p>
          <section className="mt-48 flex space-y-32 flex-col lg:space-x-8 lg:space-y-0 lg:flex-row">
            <div className="p-32 shadow-sm rounded-12 bg-white border-2 border-black-500">shadow-sm</div>
            <div className="p-32 shadow rounded-12 bg-white border-2 border-black-500">shadow</div>
            <div className="p-32 shadow-md rounded-12 bg-white border-2 border-black-500">shadow-md</div>
            <div className="p-32 shadow-lg rounded-12 bg-white border-2 border-black-500">shadow-lg</div>
            <div className="p-32 shadow-xl rounded-12 bg-white border-2 border-black-500">shadow-xl</div>
            <div className="p-32 shadow-2xl rounded-12 bg-white border-2 border-black-500">shadow-2xl</div>
          </section>
        </>
      ),
    },
  },
};

export const Shadows = () => (
  <>
    <h1>Shadows</h1>
    <p>A list of shadows which help in adding depth and realism to our designs.</p>
    <p>The below shadows are default utility classes from Tailwind CSS.</p>
    <section className="mt-48 flex space-y-32 flex-col lg:space-x-8 lg:space-y-0 lg:flex-row">
      <div className="p-32 shadow-sm rounded-12 bg-white border-2 border-black-500">shadow-sm</div>
      <div className="p-32 shadow rounded-12 bg-white border-2 border-black-500">shadow</div>
      <div className="p-32 shadow-md rounded-12 bg-white border-2 border-black-500">shadow-md</div>
      <div className="p-32 shadow-lg rounded-12 bg-white border-2 border-black-500">shadow-lg</div>
      <div className="p-32 shadow-xl rounded-12 bg-white border-2 border-black-500">shadow-xl</div>
      <div className="p-32 shadow-2xl rounded-12 bg-white border-2 border-black-500">shadow-2xl</div>
    </section>
  </>
);
