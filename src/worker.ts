// Web Worker文件
declare var global: any;

const ctx: Worker = self as any;
const fs: any = global.require('fs');
const os: any = global.require('os');
const { app } = global.require('electron');

ctx.addEventListener('message', (e: any) => {
    if(e.data) {
        if(e.data.tabs) {
            // setThumb(e.data.tabs);
            console.log(e.data.tabs);
            // ctx.postMessage({
            //     tabs: e.data.tabs,
            // });
        }
    }
});

// 读取本地资源
const loadLocalSrc = (url: String, type: String) => {
    if(type === 'pic') {
        try {
            // let buffer = images(fs.readFileSync(url)).size(500).encode('base64', {operation: 40});
            // return `data:image/png;base64,${images(fs.readFileSync(url)).size(500).encode('jpg', {operation: 40}).toString('base64')}`;
        }
        catch (error) {
            return '';
        }
    }
    return '';
};

// 设置缩略图
const setThumb = (tabs: any) => {
    for (let i = 0; i < tabs.length; i++) {
        for (let index = 0; index < tabs[i].data.lists.length; index++) {
            if(tabs[i].data.lists[index].type === 'file') {
                (function(tabIndex, itemIndex) {
                    tabs[tabIndex].data.lists[itemIndex].proload = loadLocalSrc(tabs[tabIndex].data.lists[itemIndex].url, tabs[tabIndex].data.lists[itemIndex].isMedia);
                })(i, index)
            }
        }
    }
};

export default null as any;