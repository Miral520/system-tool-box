// electron 配置入口
const { app, BrowserWindow, screen } = require('electron');
const createMain = require('./wins/main');
const { osInfo, logicInfo } = require('./utils/sys');

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

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 崩溃监听
app.on('renderer-process-crashed', (event, webContents, killed) => {
    console.log(event);
    console.log('webContents: ' + webContents);
    console.log('killed: ' + killed);
});