import React from "react";
import { Meta } from "@storybook/addon-docs";
import { ColorPalette, ColorItem } from "@storybook/addon-docs/blocks";

export default {
  title: 'Style Guide/Colors',
  parameters: {
    docs: {
      page: () => (
        <>
          <Meta title="Style Guide/Colors" />
          <h1>Colors</h1>
          <div className="pt-32">
            <ColorPalette>
              <ColorItem
                title="Primary"
                subtitle="Shades of Purple"
                colors={{
                  "primary-50": "#F0E6F2",
                  "primary-100": "#f3dcf9",
                  "primary-300": "#c7a4d1",
                  "primary-500": "#741b8c",
                  "primary-600": "#4A1159",
                  "primary-800": "#461054",
                }}
              />
              <ColorItem
                title="Accent"
                subtitle="Orange"
                colors={{
                  "accent-500": "#fa6400",
                }}
              />
              <ColorItem
                title="Success"
                subtitle="Shades of Green"
                colors={{
                  "success-100": "#CCE8E4",
                  "success-500": "#6cca67",
                  "success-600": "#326961",
                }}
              />
              <ColorItem
                title="Warning"
                subtitle="Red"
                colors={{
                  "warning-500": "#d4364d",
                }}
              />
              <ColorItem
                title="Error"
                subtitle="Red"
                colors={{
                  "error-500": "#d4364d",
                  "error-600": "#E55151",
                }}
              />
              <ColorItem
                title="Others"
                subtitle="Neutral Colors"
                colors={{
                  white: "#fff",
                  "neutral-50": "#f9f9f9",
                  "neutral-100": "#f3f3f4",
                  "neutral-150": "#e7e6e6",
                  "neutral-200": "#e1e1e3",
                  "neutral-300": "#cecfd2",
                  "neutral-500": "#85868f",
                  "neutral-600": "#666666",
                  "neutral-700": "#4d4d4d",
                  "neutral-800": "#333333",
                  black: "#000",
                }}
              />
              <ColorItem
                title="Rating Range"
                subtitle="Shades of Colors"
                colors={{
                  "rating-range-1": "#d4364d",
                  "rating-range-2": "#e8682b",
                  "rating-range-3": "#41793e",
                  "rating-range-4": "#6cca67",
                }}
              />
              <ColorItem
                title="Progress Bar"
                subtitle="Peach"
                colors={{
                  "progress-bar": "#FFF0E5",
                }}
              />
            </ColorPalette>
          </div>
        </>
      ),
    },
  },
};

export const All = () => (
  <>
   
  </>
);
