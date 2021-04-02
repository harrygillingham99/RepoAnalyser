const CracoAlias = require("craco-alias");
const path = require("path");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

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
    plugins: {
      add: [
        new StyleLintPlugin({
          configBasedir: __dirname,
          context: path.resolve(__dirname, "src"),
          files: ["**/*.scss"],
        }),
        new SpeedMeasurePlugin(),
      ],
    },
  },
  babel: {
    loaderOptions: {
      cacheDirectory: true,
      exclude: /(node_modules|bower_components)/,
    },
  },
};
