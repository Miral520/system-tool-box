// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// const { dialog } = require('electron').remote
// dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })

// 生产环境禁用ctrl + R 刷新
if(process.env.NODE_ENV === 'production') {
    window.onkeydown = function(e) {
        var ev = window.event || e;
        var code = ev.keyCode || ev.which;
        if(code == 82 && (ev.metaKey || ev.ctrlKey)) {
            return false;
        }
    }
}

const Store = require('electron-store');

const eStore = new Store();