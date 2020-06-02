import Worker from 'worker-loader!./../../worker';
declare var global: any;

export default {
    name: 'files',
    data() {
        return {
            inputURL: '', // 输入框URL

            activeURL: '', // 激活标签URL

            tabs: [], // 标签数据

            loading: true, // 加载中

            isThumb: true, // 缩略图模式

            hidden: true, // 显示隐藏文件

            grid: { // 布局
                thumb: {
                    gutter: 5,
                    xs: 2,
                    sm: 4,
                    md: 6,
                    lg: 8,
                    xl: 8,
                    xxl: 8,
                },
                list: {
                    gutter: 0,
                    column: 1,
                },
            },

            units: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'], // 单位

            picExt: ['jpg', 'jpeg', 'png', 'gif'], // 图片扩展名

            videoExt: ['mp4'], // 视频扩展名

            audioExt: ['mp3'], // 音频扩展名

            loopTimer: null, // tabs监听防抖

            worker: null, // worker线程
        }
    },
    created() {
        (<any>this).init();
    },
    methods: {
        // 初始化
        init() {
            (<any>this).tabs = [];
            (<any>this).addDefault();
        },

        // 添加默认目录
        addDefault() {
            // 读取本地分区
            (<any>this).getLocalDisk(() => {
                // 出错时获取用户目录
                let userInfo = (<any>this).$store.state.sysInfo.userInfo;
                (<any>this).addTab(userInfo.username, userInfo.homedir, (<any>this).loadFiles(userInfo.homedir), false);
                (<any>this).activeURL = userInfo.homedir;
                (<any>this).inputURL = userInfo.homedir;
            });
        },

        // 读取本地分区
        getLocalDisk(error: Function) {
            global.child_process.exec('wmic logicaldisk get caption', (err: any, stdout: any, stderr: any) => {
                if(err || stderr) {
                    if(error) {
                        error();
                    }
                }
                else {
                    let disk = stdout.split('\n');
                    disk.forEach((item: any) => {
                        let string = item.split('');
                        let newArr = [];
                        for (let i = 0; i < string.length; i++) {
                            newArr.push(string[i]);
                            if(string[i] === ':') {
                                break;
                            }
                            if(i === string.length - 1) {
                                newArr = [];
                            }
                        }
                        
                        if(newArr.length) {
                            let name = newArr.join('') + global.path.sep;
                            let data = (<any>this).loadFiles(name, false);
                            if(data) {
                                (<any>this).addTab(name, name, data, false);
                            }
                        }
                    });
                    (<any>this).activeURL = (<any>this).tabs[0].url;
                    (<any>this).inputURL = (<any>this).tabs[0].url;
                }
            });
        },

        // 添加tab
        addTab(label: String, url: String, data: any, closable: Boolean = true) {
            (<any>this).tabs.push({
                label: label,
                url: url,
                closable: closable,
                data: data,
            });
        },

        // 切换缩略图和列表
        handleThumb() {
            (<any>this).isThumb = !(<any>this).isThumb;
        },

        // 切换隐藏文件
        handleHide() {
            (<any>this).hidden = !(<any>this).hidden;
        },

        // 刷新
        refresh() {
            (<any>this).tabs[parseInt((<any>this).getTabCode((<any>this).activeURL))].data = (<any>this).loadFiles((<any>this).activeURL);
        },

        // 向上
        rollback() {
            let urlArr = (<any>this).activeURL.split(global.path.sep);
            if(urlArr.length > 1 && urlArr[urlArr.length - 1] !== '') {
                urlArr.pop();
                let label = urlArr[urlArr.length - 1];
                let target = urlArr.join(global.path.sep);
                if(target[target.length - 1] === ':') {
                    target += global.path.sep;
                    label += global.path.sep;
                }
                let data = (<any>this).loadFiles(target);
                if(data) {
                    let code = (<any>this).getTabCode((<any>this).inputURL);
                    (<any>this).tabs[code].label = label;
                    (<any>this).tabs[code].url = target;
                    (<any>this).tabs[code].data = data;
                    (<any>this).activeURL = target;
                    (<any>this).inputURL = target;
                }
            }
            else {
                (<any>this).$message.warning('不能向上咯');
            }
        },

        // 访问地址栏
        setUrl() {
            let data = (<any>this).loadFiles((<any>this).inputURL);
            if(data) {
                let code = (<any>this).getTabCode((<any>this).activeURL);
                let urlArr = (<any>this).inputURL.split(global.path.sep);
                let label = urlArr[urlArr.length - 1];
                if((<any>this).inputURL[(<any>this).inputURL.length - 1] === ':') {
                    (<any>this).inputURL += global.path.sep;
                    label += global.path.sep;
                }
                if(code) {
                    (<any>this).tabs[code].label = label;
                    (<any>this).tabs[code].url = (<any>this).inputURL;
                    (<any>this).tabs[code].data = data;
                }
                (<any>this).activeURL = (<any>this).inputURL;
            }
            else {
                (<any>this).inputURL = (<any>this).activeURL;
            }
        },

        // 点击文件
        openFile(file: any) {
            if(file.desc === '无访问权限') {
                (<any>this).$message.warning('无访问权限');
            }
            else {
                let target = '';
                if((<any>this).activeURL[(<any>this).activeURL.length - 1] === global.path.sep) {
                    target = `${(<any>this).activeURL}${file.name}`;
                }
                else {
                    target = `${(<any>this).activeURL}${global.path.sep}${file.name}`;
                }
                if(file.type === 'folder') {
                    let code = (<any>this).getTabCode((<any>this).activeURL);
                    if(code) {
                        (<any>this).tabs[code].label = file.name;
                        (<any>this).tabs[code].url = target;
                        (<any>this).tabs[code].data = (<any>this).loadFiles(target);
                    }
                    (<any>this).activeURL = target;
                    (<any>this).inputURL = target;
                }
                else {
                    if(file.isImage) {

                    }
                    else {

                    }
                }
            }
        },

        // 返回文件扩展名
        getExtension(text: String) {
            let arr = text.split(global.path.sep);
            let filename = text;
            if(arr.length > 1) {
                // URL
                filename = arr[arr.length - 1];
            }
            let nameArr = filename.split('.');
            if(nameArr[0] === '') {
                nameArr.shift();
            }
            if (nameArr.length > 1) {
                return nameArr[nameArr.length - 1];
            }
            else {
                return false;
            }
        },

        // 判断为媒体文件
        isMedia(ext: any) {
            if(!ext) {
                return false;
            }
            let extName = ext.toLowerCase();
            if((<any>this).picExt.indexOf(extName) > -1) {
                return 'pic';
            }
            if((<any>this).videoExt.indexOf(extName) > -1) {
                return 'video';
            }
            if((<any>this).audioExt.indexOf(extName) > -1) {
                return 'audio';
            }
            return false;
        },

        // 查找tab
        getTabCode(url: any) {
            for (let i = 0; i < (<any>this).tabs.length; i++) {
                if((<any>this).tabs[i].url === url) {
                    return i.toString();
                }
            }
            return false;
        },

        // 读取指定目录下文件
        loadFiles(url: String, showMsg: Boolean = true) {
            try {
                let allFiles = global.fs.readdirSync(url, {
                    withFileTypes: true,
                });
                let files: any = {
                    lists: [],
                    desc: {
                        folders: 0,
                        hideFolders: 0,
                        files: 0,
                        hideFiles: 0,
                        total: 0,
                    },
                };
                files.desc.total = allFiles.length;
                allFiles.forEach((item: any) => {
                    let isFile = item.isFile();
                    let type = '';
                    let desc = '';
                    let hide = (item.name[0] === '.' || item.name[0] === '$' || item.name[0] === '~');
                    let isMedia = false;
                    let proload = '';
                    let fileURL = `${url}${global.path.sep}${item.name}`;
                    if(url[url.length - 1] === global.path.sep) {
                        fileURL = `${url}${item.name}`;
                    }
                    if(isFile) {
                        let data = (<any>this).getDesc(fileURL, 'file');
                        type = 'file';
                        desc = data.info;
                        files.desc.files++;
                        if(hide) {
                            files.desc.hideFiles++;
                        }
                        isMedia = (<any>this).isMedia((<any>this).getExtension(item.name));
                    }
                    else {
                        let data = (<any>this).getDesc(fileURL, 'folder');
                        type = 'folder';
                        desc = data.info;
                        files.desc.folders++;
                        if(hide) {
                            files.desc.hideFolders++;
                        }
                    }
                    files.lists.push({
                        name: item.name,
                        type: type,
                        isMedia: isMedia,
                        desc: desc,
                        hide: hide,
                        proload: proload,
                        url: fileURL,
                    });
                });
                files.lists.sort((a: any, b: any) => {
                    if(a.type === 'folder') {
                        return -1;
                    }
                    else if(a.type === 'file') {
                        return 1;
                    }
                    return 0;
                });
                return files;
            }
            catch (error) {
                if(showMsg) {
                    (<any>this).$message.error('目录不存在');
                }
                return false;
            }
        },

        // 读取本地资源
        // async loadLocalSrc(url: String, type: String) {
        //     if(type === 'pic') {
        //         try {
        //             return `data:image/png;base64,${global.fs.readFileSync(url).toString('base64')}`;
        //         }
        //         catch (error) {
        //             return '';
        //         }
        //     }
        //     else {
        //         return await global.app.getFileIcon(url, {
        //             size: global.os.type() === 'Darwin' ? 'normal' : 'large',
        //         }).then((res: any) => {
        //             let binary = '';
        //             const bytes = new Uint8Array(res.toPNG());
        //             for (let i = 0; i < bytes.byteLength; i += 1) {
        //                 binary += String.fromCharCode(bytes[i]);
        //             }
        //             return `data:image/png;base64,${window.btoa(binary)}`;
        //         }, (rej: any) => {
        //             return '';
        //         });
        //     }
        // },

        // 设置预渲染图片
        // setThumb() {
        //     let _this = (<any>this);
        //     for (let i = 0; i < _this.tabs.length; i++) {
        //         for (let index = 0; index < _this.tabs[i].data.lists.length; index++) {
        //             if(_this.tabs[i].data.lists[index].type === 'file') {
        //                 (function(tabIndex, itemIndex) {
        //                     _this.loadLocalSrc(_this.tabs[tabIndex].data.lists[itemIndex].url, _this.tabs[tabIndex].data.lists[itemIndex].isMedia).then((res: any) => {
        //                         // _this.tabs[tabIndex].data.lists[itemIndex].proload = res;
        //                         // _this.cutImageBase64(res, 300, 0.1, (base64: any) => {
        //                         //     // _this.tabs[tabIndex].data.lists[itemIndex].proload = base64;
        //                         //     console.log(base64);
        //                         // });
        //                     }, (rej: any) => {
        //                         _this.tabs[tabIndex].data.lists[itemIndex].proload = rej;
        //                     })
        //                 })(i, index)
        //             }
        //         }
        //     }
        // },

        // base64压缩
        // cutImageBase64(base64: any, w: any = 500, quality: any = 0.6, callback: Function) {
        //     let newImage = new Image();
        //     newImage.src = base64;
        //     newImage.setAttribute("crossOrigin", 'Anonymous');  //url为外域时需要
        //     let imgWidth, imgHeight;
        //     newImage.onload = () => {
        //         imgWidth = newImage.width;
        //         imgHeight = newImage.height;
        //         let canvas = document.createElement("canvas");
        //         let ctx = canvas.getContext("2d");
        //         if (Math.max(imgWidth, imgHeight) > w) {
        //             if (imgWidth > imgHeight) {
        //                 canvas.width = w;
        //                 canvas.height = w * imgHeight / imgWidth;
        //             }
        //             else {
        //                 canvas.height = w;
        //                 canvas.width = w * imgWidth / imgHeight;
        //             }
        //         }
        //         else {
        //             canvas.width = imgWidth;
        //             canvas.height = imgHeight;
        //         }
        //         if(ctx) {
        //             ctx.clearRect(0, 0, canvas.width, canvas.height);
        //             ctx.drawImage(newImage, 0, 0, canvas.width, canvas.height);
        //         }
        //         let newBase64 = canvas.toDataURL("image/jpeg", quality); //压缩语句
        //         // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
        //         while (newBase64.length / 1024 > 150) {
        //             quality -= 0.01;
        //             newBase64 = canvas.toDataURL("image/jpeg", quality);
        //         }
        //         // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
        //         while (newBase64.length / 1024 < 50) {
        //             quality += 0.001;
        //             newBase64 = canvas.toDataURL("image/jpeg", quality);
        //         }
        //         callback(newBase64);
        //     }
        // },

        // 读取文件或文件夹描述
        getDesc(url: String, type: String) {
            let info = {
                info: '',
                type: ''
            };
            if(type === 'file') {
                try {
                    let data = global.fs.statSync(url);
                    info.info = (<any>this).setByte(data.size);
                    info.type = 'file';
                }
                catch (error) {
                    info.info = '无访问权限';
                }
            }
            else {
                try {
                    let files = global.fs.readdirSync(url);
                    info.info = `${files.length}个文件`;
                    info.type = 'folder';
                }
                catch (error) {
                    info.info = '无访问权限';
                }
            }
            return info;
        },

        // 字节转换
        setByte(size: any, unitCode: any = 0) {
            if(size < 1024) {
                return `${size}${(<any>this).units[unitCode]}`;
            }
            else {
                return (<any>this).setByte(Math.round(size / 1024 * 100) / 100, unitCode + 1);
            }
        },

        // 标签变化
        tabChange(activeKey: any) {
            (<any>this).inputURL = activeKey;
        },

        // 单击聚焦
        handleClick(data: any) {

        },

        // 右键菜单
        handleMenu(data: any) {

        },

        // 空格预览
        handleSpace(data: any) {
            global.ipcRenderer.send('preview', data);
        },

        // 多线程
        setWorker(data: any, callback: Function) {
            (<any>this).worker = new Worker();
            (<any>this).worker.postMessage({
                tabs: data,
            });
            (<any>this).worker.addEventListener("message", (e: any) => {
                if(e.data && e.data.tabs) {
                    if(callback) {
                        callback(e.data.tabs);
                    }
                    (<any>this).worker.terminate(); // 关闭主进程
                }
            });
        },
    },
    watch: {
        tabs: {
            immediate: true,
            // deep: true,
            handler(val: any) {
                clearTimeout((<any>this).loopTimer);
                // (<any>this).loopTimer = setTimeout((<any>this).setThumb, 500);
                (<any>this).loopTimer = setTimeout(() => {
                    (<any>this).setWorker(val, (data: any) => {
                        console.log(data);
                    });
                }, 500);
            }
        },
    },
}