import path from "path";
import postcss
 from "postcss";
 import sass from "sass";

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  /** Expose public folder to storybook as static */
  staticDirs: ["../lib"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "storybook-dark-mode", {
    name: "@storybook/addon-postcss",
    options: {
		postCss: {
			implementation: postcss,
		  },
      postcssLoaderOptions: {
        implementation: postcss
      }
    }
  }, "@storybook/addon-mdx-gfm"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    // Provide your own options if necessary.
    // See https://storybook.js.org/docs/configure/typescript for more information.
    reactDocgenTypescriptOptions: {},
  },
  webpackFinal: async config => {
    config.resolve.extensions.push(".ts", ".tsx");

    // SASS + Tailwdind CSS
    config.module.rules.push({
      test: /\.s(a|c)ss$/,
      use: ["style-loader", {
        loader: "css-loader",
        options: {
          importLoaders: 1,
          // We always need to apply postcss-loader before css-loader
          modules: {
            auto: /\.module\.scss$/,
            // true
            localIdentName: "[name]__[local]--[hash:base64:5]"
          }
        }
      }, {
        loader: "postcss-loader",
        // required for tailwind
        options: {
          implementation: postcss,
          // postcss 8
          postcssOptions: {
            config: path.resolve(__dirname, "../postcss.config.js")
          }
        }
      }, {
        loader: "sass-loader",
        options: {
          // sourceMap: true,
          implementation: sass // dart sass
        }
      }]
    });

    return config;
  },
  docs: {
    autodocs: true
  },
  telemetry: false
};
