import React from "react";
import { Meta, Typeset } from "@storybook/addon-docs/blocks";

export default {
  title: 'Style Guide/Typography',
  parameters: {
    docs: {
      page: () => (
        <>
          <Meta title="Style Guide/Typography" />
          <h1>Typography</h1>
          <p><strong>Font:</strong> Montserrat</p>
          <p><strong>Weights:</strong> 500(medium), 800(extrabold), 900(black)</p>
          <Typeset
            fontSizes={[
              12,
              14,
              16,
              18,
              20,
              24,
              32,
              48,
              56,
              64
            ]}
            fontWeight="900"
            sampleText="I like potatoes and I like chocolate milk"
            fontFamily='"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif'
          />
        </>
      ),
    },
  },
};

export const Typography = () => (
  <>
    
  </>
);
