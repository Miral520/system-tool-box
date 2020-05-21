// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  };
});

// 传递electron，改变为全局变量，便于react内部调用
global.electron = require('electron');
global.ipcRenderer = global.electron.ipcRenderer;
global.remote = global.electron.remote;
global.app = global.remote.app;