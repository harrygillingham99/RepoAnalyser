const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({ width: 900, height: 900, show: false });
  mainWindow.loadURL(
    !app.isPackaged
      ? process.env.ELECTRON_START_URL
      : url.format({
          pathname: path.join(__dirname, "../index.html"),
          protocol: "file:",
          slashes: true,
        })
  );

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.webContents.on('dom-ready', ()=>{
      let code = `var base = document.getElementById("base");
                  base.setAttribute('href', './');`;
                  
      mainWindow.webContents.executeJavaScript(code);
  });
  });

  mainWindow.on("closed", () => mainWindow.destroy());
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
