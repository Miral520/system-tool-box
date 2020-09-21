// electron 配置入口
const { app, BrowserWindow, ipcMain, screen, crashReporter } = require('electron');
const { init } = (process.type === 'browser'
  ? require('@sentry/electron/dist/main')
  : require('@sentry/electron/dist/renderer'))

const createMain = require('./windows/main');
const profile = require('./setting/profile');
const { osInfo, logicInfo } = require('./setting/sys');

// 创建主窗口
const createWindow = () => {
  createMain(screenData.workAreaSize, target => {
    // 磁盘信息
    target.webContents.send('disks', logicInfo);

    // 系统信息
    target.webContents.send('sys', Object.assign(osInfo, {
      screen: screenData,
    }));
  });
};

// 屏幕数据
let screenData = null;

app.whenReady().then(() => {
  screenData = screen.getPrimaryDisplay();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 崩溃监听
app.on('renderer-process-crashed', (event, webContents, killed) => {
  console.log(event);
  console.log('webContents: ' + webContents);
  console.log('killed: ' + killed);
});

// 崩溃报告上报
// 常规错误
init({
  dsn: 'https://bb1be0f6cde842fd9205d6c90d559f1d@o421172.ingest.sentry.io/5340517',
});
// 系统错误
crashReporter.start({
  companyName: profile.author,
  productName: profile.alias,
  ignoreSystemCrashHandler: true,
  submitURL: 'https://o421172.ingest.sentry.io/api/5340517/minidump/?sentry_key=bb1be0f6cde842fd9205d6c90d559f1d'
});