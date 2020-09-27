const { BrowserWindow, ipcMain, nativeTheme } = require('electron');
const path = require('path');
const { mainSize } = require('../default/size');
const createPre = require('./preview');
const db = require('../utils/db');

const createMain = (screenSize, callback) => {
    const win = new BrowserWindow({
        width: process.env.NODE_ENV === 'development' ? mainSize.init.width : mainSize.min.width,
        height: process.env.NODE_ENV === 'development' ? mainSize.init.height : mainSize.min.height,
        minWidth: mainSize.min.width,
        minHeight: mainSize.min.height,
        center: true,
        transparent: true,
        frame: false,
        resizable: true,
        hasShadow: true,
        // icon: '',
        webPreferences: {
            devTools: process.env.NODE_ENV === 'development' ? true : false,
            preload: path.join(__dirname, '../../public/preload.js'),
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
        },
    });

    let loadAdd = 'http://localhost:8888/';
    if (process.env.NODE_ENV === 'development') {
        loadAdd += '?mode=dev';
        win.webContents.openDevTools();
    }
    else {
        loadAdd += '?mode=prod';
    }

    win.loadURL(loadAdd);

    // 传递操作系统信息
    win.webContents.on('did-finish-load', () => {
        // 监听系统主题变化
        nativeTheme.on('updated', () => {
            let data = {
                shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
                themeSource: nativeTheme.themeSource,
                shouldUseHighContrastColors: nativeTheme.shouldUseHighContrastColors,
                shouldUseInvertedColorScheme: nativeTheme.shouldUseInvertedColorScheme,
            };
            win.webContents.send('nativeTheme', data);
        });

        // 初始化主题
        win.webContents.send('nativeTheme', {
            shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
            themeSource: nativeTheme.themeSource,
            shouldUseHighContrastColors: nativeTheme.shouldUseHighContrastColors,
            shouldUseInvertedColorScheme: nativeTheme.shouldUseInvertedColorScheme,
        });

        if (callback) {
            callback(win);
        }
    });

    // 监听最小化
    ipcMain.on('min', (e, arg) => {
        win.minimize();
    });

    // 监听全屏
    ipcMain.on('fullscreen', (e, arg) => {
        let thisSize = win.getSize(); // 当前窗口尺寸
        if (thisSize[0] === screenSize.width && thisSize[1] === screenSize.height) {
            win.unmaximize();
        }
        else {
            win.maximize();
        }
    });

    // 监听加载状态
    ipcMain.on('changeWinSize', (e, arg) => {
        let x = (screenSize.width / 2) - (mainSize.init.width / 2);
        let y = (screenSize.height / 2) - (mainSize.init.height / 2);
        win.setContentBounds({
            x: x ? parseInt(x) : 10,
            y: y ? parseInt(y) : 10,
            width: mainSize.init.width,
            height: mainSize.init.height,
        }, true);
    });

    // 监听新建预览窗口
    ipcMain.on('preview', (e, arg) => {
        const preview = createPre(arg, screenSize, win);
        preview.on('closed', () => {
            win.webContents.send('canSpace');
        });
        ipcMain.on('closePreview', (e, arg) => {
            preview.destroy();
        });
    });

    // 数据库访问
    ipcMain.handle('dataBase', async (event, args) => {
        return await db[args.cmd](args.data);
    });

    return win;
};

module.exports = createMain;