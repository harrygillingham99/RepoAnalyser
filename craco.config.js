const CracoAlias = require("craco-alias");
const { whenDev } = require("@craco/craco");
const path = require("path");
const StyleLintPlugin = require("stylelint-webpack-plugin");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: "./src",
        /* tsConfigPath should point to the file where "baseUrl" and "paths" 
           are specified*/
        tsConfigPath: "./tsconfig.paths.json",
      },
    },
  ],
  webpack: {
    devServer: whenDev(() => ({ https: true })),
    plugins: {
      add: [
        new StyleLintPlugin({
          configBasedir: __dirname,
          context: path.resolve(__dirname, "src"),
          files: ["**/*.scss"],
        }),
      ],
    },
  },
};
