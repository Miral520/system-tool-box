// Web Worker文件
declare var global: any;

const ctx: Worker = self as any;
const fs: any = global.require('fs');

ctx.addEventListener('message', (e: any) => {
    if(e.data) {
        if(e.data.tabs) {
            handlePreview(e.data.tabs);
        }
    }
});

// 设置缩略图
const handlePreview = (tabs: any) => {
    // console.log(tabs);
};
// ctx.postMessage({
//     tabs: tabs,
// });
export default null as any;