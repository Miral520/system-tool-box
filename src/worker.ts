// Web Worker文件
declare var global: any;

const ctx: Worker = self as any;
const fs: any = global.require('fs');
const electron: any = global.require('electron');

let maxSize: any = null;

ctx.addEventListener('message', (e: any) => {
    if(e.data) {
        if(e.data.maxSize) {
            maxSize = e.data.maxSize;
        }
        if(e.data.tabs) {
            mapTabs(e.data.tabs);
        }
    }
});

// 遍历tabs
const mapTabs = (tabs: any) => {
    tabs.forEach((tab: any, tabIndex: any) => {
        tab.data.lists.forEach((file: any, index: any) => {
            if(file.isMedia === 'pic' && !file.proload) {
                (function(t_i, i) {
                    setTimeout(() => {
                        handlePreview(file.url).then((res: any) => {
                            ctx.postMessage({
                                proview: {
                                    proload: res.base64,
                                    tabIndex: tabIndex,
                                    listIndex: index,
                                    width: res.width,
                                    height: res.height,
                                    ratio: res.ratio,
                                },
                            });
                        });
                    }, (t_i + 1) * i * 20);
                })(tabIndex, index);
            }
            else {
                if(tabIndex === tabs.length - 1 && index === tab.data.lists.length - 1) {
                    (function(t_i, i) {
                        setTimeout(() => {
                            ctx.postMessage({
                                lastThumb: true,
                            });
                        }, (t_i + 1) * i * 20);
                    })(tabIndex, index);
                }
            }
        });
    });
};

// 获取缩略图
const handlePreview = async (url: any) => {
    return await getBase64(url);
};

// 获取base64
const getBase64 = (url: any) => {
    return new Promise((resolve, reject) => {
        let img = electron.nativeImage.createFromPath(url);
        let size = img.getSize();
        let ratio = img.getAspectRatio();
        if(size.width > maxSize.maxWidth || size.height > maxSize.maxHeight) {
            let width = maxSize.maxWidth;
            let height = maxSize.maxHeight;
            if(ratio >= 1) {
                height = maxSize.maxWidth / ratio;
            }
            else {
                width = maxSize.maxHeight * ratio;
            }
            img = img.resize({
                width: width,
                height: height,
                quality: 'good',
            });
        }
        img = img.toPNG({
            scaleFactor: 0.8,
        }).toString('base64');
        resolve({
            base64: `data:image/png;base64,${img}`,
            width: size.width,
            height: size.height,
            ratio: ratio,
        });
    });
};

export default null as any;