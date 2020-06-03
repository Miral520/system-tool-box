// Web Worker文件
declare var global: any;

const ctx: Worker = self as any;
const fs: any = global.require('fs');
// const { app } = global.require('electron');
const Jimp = global.require('./../node_modules/jimp');

ctx.addEventListener('message', (e: any) => {
    if(e.data) {
        if(e.data.tabs) {
            setThumb(e.data.tabs);
        }
    }
});

// 读取本地资源
const loadLocalSrc = async (url: String, type: String, limitSize: Number = 400) => {
    if(type === 'pic') {
        return await Jimp.read(fs.readFileSync(url))
            .then((image: any) => {
                if(image.bitmap.width >= image.bitmap.height) {
                    if(image.bitmap.width > limitSize) {
                        image.resize(limitSize, Jimp.AUTO);
                    }
                }
                else {
                    if(image.bitmap.height > limitSize) {
                        image.resize(Jimp.AUTO, limitSize);
                    }
                }
                image.quality(20);
                return image.getBase64Async(Jimp.AUTO);
            })
            .catch((err: any) => {
                return '';
            });
    }
    return '';
};

// 设置缩略图
const setThumb = (tabs: any) => {
    for (let i = 0; i < tabs.length; i++) {
        for (let index = 0; index < tabs[i].data.lists.length; index++) {
            if(tabs[i].data.lists[index].type === 'file') {
                (function(tabIndex, itemIndex) {
                    loadLocalSrc(tabs[tabIndex].data.lists[itemIndex].url, tabs[tabIndex].data.lists[itemIndex].isMedia).then((res: any) => {
                        tabs[tabIndex].data.lists[itemIndex].proload = res;
                    });
                })(i, index);
            }
        }
    }
    let timer = setInterval(() => {
        for (let i = 0; i < tabs.length; i++) {
            let full = true;
            for (let index = 0; index < tabs[i].data.lists.length; index++) {
                if(tabs[i].data.lists[index].isMedia === 'pic') {
                    if(tabs[i].data.lists[index].proload) {
                        continue;
                    }
                    else {
                        full = false;
                        break;
                    }
                }
                else {
                    continue;
                }
            }
            if(!full) {
                break;
            }
            if(i >= tabs.length - 1 && full) {
                ctx.postMessage({
                    tabs: tabs,
                });
                clearInterval(timer);
            }
        }
    }, 10);
};

export default null as any;