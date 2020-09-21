const { BrowserWindow } = require('electron');
const path = require('path');
const { previewSize } = require('../setting/size');

const createPre = (arg, screenSize, win) => {
    // 监听新建预览窗口
    let width = previewSize.init.width;
    let height = previewSize.init.height;

    if (arg.type === 'file') {
        if (arg.isMedia === 'pic') {
            arg.width += previewSize.shawdow; // 图像宽度加上padding
            arg.height += (previewSize.shawdow + previewSize.titleBar); // 图像高度加上弹窗控制栏高度
            if (arg.width <= screenSize.width && arg.height <= screenSize.height) { // 宽高小于等于屏幕宽高
                width = arg.width > previewSize.min.width ? arg.width : previewSize.min.width;
                height = arg.height > previewSize.min.height ? arg.height : previewSize.min.height;
            }
            else { // 宽高大于屏幕宽高
                width = previewSize.large.width + previewSize.shawdow;
                height = previewSize.large.height + previewSize.shawdow + previewSize.titleBar;
            }
        }
    }
    
    const preview = new BrowserWindow({
        width: width,
        height: height,
        frame: false,
        parent: win,
        center: true,
        resizable: false,
        hasShadow: true,
        transparent: true,
        webPreferences: {
            devTools: process.env.NODE_ENV === 'development' ? true : false,
            preload: path.join(__dirname, '../../public/preload.js'),
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            webSecurity: false,
        },
    });

    preview.loadURL(path.join('file:', __dirname, '../../', 'public', 'preview.html'));

    preview.webContents.on('did-finish-load', () => {
        preview.webContents.send('preview', {
            target: arg,
        });
    });

    // 预览窗口的devtools
    // if(process.env.NODE_ENV === 'development') {
    //   preview.webContents.openDevTools();
    // }

    return preview;
};

module.exports = createPre;