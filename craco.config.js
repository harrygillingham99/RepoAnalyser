//CRACO (Create React App Config Override)
//Configure things here without having to eject the CRA config

const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@state": path.resolve(__dirname, "./src/state"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
};
