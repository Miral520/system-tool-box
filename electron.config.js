const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 500,
    minHeight: 350,
    center: true,
    transparent: true,
    frame: false,
    resizable: true,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, './public/preload.js'),
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })
  win.loadURL('http://localhost:8080/')
  win.webContents.openDevTools()
}
app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})