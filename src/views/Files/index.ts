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

            picExt: ['jpg', 'jpeg', 'png'], // 图片扩展名

            videoExt: ['mp4'], // 视频扩展名

            audioExt: ['mp3'], // 音频扩展名

            loopTimer: null, // tabs监听防抖

            worker: null, // worker线程

            canUseSpace: true, // 可以使用空格

            preSize: { // 缩略图最大尺寸
                maxWidth: 100,
                maxHeight: 100,
            },

            contextMenu: { // 右键菜单
                delete: {
                    label: '删除',
                    fn: 'delFile',
                },
                rename: {
                    label: '重命名',
                    fn: 'reName',
                },
            },
        }
    },
    created() {
        (<any>this).init();
        (<any>this).watchSpace();
    },
    methods: {
        // 菜单方法重定向
        setMenuMethod(menu: any, data: any) {
            (<any>this)[menu.fn](data);
        },

        // 删除
        delFile(data: any) {
            const $this = (<any>this);
            const h = $this.$createElement;
            const confirm = h('div', {
                style: 'margin-top: 5px;',
            }, [
                h('p', {
                    style: 'margin-bottom: 10px;',
                }, `您确定要删除文件 ${data.name} 吗？`),
                h('span', {
                    style: 'font-size: 12px;',
                }, `永久删除`),
                h('a-switch', {
                    style: 'margin-left: 5px;', 
                    props: {
                        size: 'small',
                        'default-checked': false,
                    },
                }),
            ]);
            $this.$confirm({
                title: '确定删除？',
                // content: `您确定要永久删除文件 ${data.name} 吗？`,
                content: confirm,
                okText: '确认',
                cancelText: '取消',
                okType: 'danger',
                centered: true,
                onOk() {
                    if(confirm.children[2].elm.ariaChecked) {
                        // 直接删除，不移入回收站
                        return new Promise((resolve: any, reject: any) => {
                            global.fs.unlink(data.url, (err: any) => {
                                if (err) {
                                    $this.$message.error(err);
                                    reject();
                                    return false;
                                }
                                else {
                                    $this.$message.success('删除成功！');
                                    $this.refresh();
                                    resolve();
                                }
                            });
                        }).then((resolve: any) => {}, (reject: any) => {});
                    }
                    else {
                        let success = global.shell.moveItemToTrash(data.url);
                        if(success) {
                            $this.$message.success('删除成功！');
                            $this.refresh();
                        }
                        else {
                            $this.$message.error('删除失败！');
                        }
                    }
                },
            });
        },

        // 重命名
        reName(data: any) {
            const $this = (<any>this);
            const input = $this.$createElement('a-input', {
                style: 'margin-top: 5px;', 
                props: {
                    value: data.name,
                },
                attrs: {
                    spellcheck: false,
                },
                domProps: {

                },
            });
            $this.$confirm({
                title: '文件重命名',
                content: input,
                okText: '确认',
                cancelText: '取消',
                centered: true,
                onOk() {
                    let result = input.elm.value.trim();
                    return new Promise((resolve: any, reject: any) => {
                        if(result !== data.name) {
                            if(result === '') {
                                $this.$message.error('文件名不能为空！');
                                reject();
                            }
                            else {
                                let canReName = true;
                                for (let tabIndex = 0; tabIndex < $this.tabs.length; tabIndex++) {
                                    if($this.tabs[tabIndex].url === $this.inputURL) {
                                        for (let i = 0; i < $this.tabs[tabIndex].data.lists.length; i++) {
                                            let file = $this.tabs[tabIndex].data.lists[i];
                                            if(file.name === result) {
                                                canReName = false;
                                                break;
                                            }
                                        }
                                    }
                                    break;
                                }
                                if(canReName) {
                                    global.fs.rename(data.url, `${data.url.substring(0, data.url.lastIndexOf(data.name))}${result}`, (err: any) => {
                                        if (err) {
                                            $this.$message.error(err);
                                            reject();
                                            return false;
                                        }
                                        else {
                                            $this.$message.success('文件重命名成功！');
                                            $this.refresh();
                                            resolve();
                                        }
                                    });
                                }
                                else {
                                    $this.$message.error('文件名已重复！');
                                    reject();
                                }
                            }
                        }
                        else {
                            resolve();
                        }
                    }).then((resolve: any) => {}, (reject: any) => {});
                },
            });
        },

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
            (<any>this).$store.state.disks.forEach((disk: any) => {
                let url = disk.name;
                let label = disk.name;
                if(disk.name[disk.name.length - 1] === global.path.sep) {
                    label = global.path.sep;
                }
                else {
                    let labelArr = disk.name.split(global.path.sep);
                    let lastWord = labelArr[labelArr.length - 1];
                    if(lastWord[lastWord.length - 1] === ':') {
                        label = `${lastWord}${global.path.sep}`;
                        url = label;
                    }
                    else {
                        label = lastWord;
                    }
                }

                let data = (<any>this).loadFiles(url, false);
                if(data) {
                    (<any>this).addTab(label, url, data, false);
                }
            });
            if((<any>this).tabs.length) {
                (<any>this).activeURL = (<any>this).tabs[0].url;
                (<any>this).inputURL = (<any>this).tabs[0].url;
            }
            else {
                if(error) {
                    error();
                }
            }
        },

        // 添加tab
        addTab(label: String, url: String, data: any, closable: Boolean = true) {
            (<any>this).tabs.push({
                label: label,
                url: url,
                closable: closable,
                data: data,
            });
            (<any>this).timeoutProview((<any>this).tabs);
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
            (<any>this).timeoutProview((<any>this).tabs);
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
                if(target === '') {
                    target = global.path.sep;
                    label = global.path.sep;
                }
                let data = (<any>this).loadFiles(target);
                if(data) {
                    let code = (<any>this).getTabCode((<any>this).inputURL);
                    (<any>this).tabs[code].label = label;
                    (<any>this).tabs[code].url = target;
                    (<any>this).tabs[code].data = data;
                    (<any>this).activeURL = target;
                    (<any>this).inputURL = target;
                    (<any>this).timeoutProview((<any>this).tabs);
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
                if ((<any>this).inputURL === '') {
                    label = global.path.sep;
                    (<any>this).inputURL = global.path.sep;
                }
                if(code) {
                    (<any>this).tabs[code].label = label;
                    (<any>this).tabs[code].url = (<any>this).inputURL;
                    (<any>this).tabs[code].data = data;
                }
                (<any>this).activeURL = (<any>this).inputURL;
                (<any>this).timeoutProview((<any>this).tabs);
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
                        (<any>this).timeoutProview((<any>this).tabs);
                    }
                    (<any>this).activeURL = target;
                    (<any>this).inputURL = target;
                }
                else {
                    // if(file.isImage) {

                    // }
                    // else {

                    // }
                    global.shell.openExternal(`file://${file.url}`);
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
            (<any>this).preview = {};
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
                    let isMedia = '';
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

        // 读取文件或文件夹描述
        getDesc(url: String, type: String) {
            let info = {
                info: '',
                type: ''
            };
            if(type === 'file') {
                try {
                    let data = global.fs.statSync(url);
                    info.info = (<any>this).$fn.setByte(data.size);
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

        // 标签变化
        tabChange(activeKey: any) {
            (<any>this).inputURL = activeKey;
        },

        // 单击聚焦
        handleClick(data: any) {

        },

        // 空格预览
        handleSpace(data: any) {
            if((<any>this).canUseSpace) {
                global.ipcRenderer.send('preview', data);
            }
            (<any>this).canUseSpace = false;
        },

        // 监听空格键可用性
        watchSpace() {
            global.ipcRenderer.on('canSpace', (event: any, message: any) => {
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    (<any>this).canUseSpace = true;
                }, 1000);
            });
        },

        // 多线程
        setWorker(data: any, callback: Function) {
            if((<any>this).worker) {
                (<any>this).worker.terminate(); // 关闭主进程
            }
            (<any>this).worker = new Worker();
            (<any>this).worker.postMessage({
                tabs: data,
                maxSize: (<any>this).preSize,
            });
            (<any>this).worker.addEventListener("message", (e: any) => {
                if(e.data) {
                    if(e.data.proview) {
                        if(callback) {
                            let timer = setTimeout(() => {
                                callback(e.data.proview);
                                clearTimeout(timer);
                            }, 0);
                        }
                    }
                    if(e.data.lastThumb) {
                        (<any>this).worker.terminate(); // 关闭主进程
                    }
                }
            });
        },

        // 设置缩略图
        setProload(data: any) {
            if(data && data.proload && (<any>this).tabs[data.tabIndex].data.lists[data.listIndex]) {
                (<any>this).tabs[data.tabIndex].data.lists[data.listIndex].proload = data.proload;
                (<any>this).tabs[data.tabIndex].data.lists[data.listIndex].width = data.width;
                (<any>this).tabs[data.tabIndex].data.lists[data.listIndex].height = data.height;
                (<any>this).tabs[data.tabIndex].data.lists[data.listIndex].ratio = data.ratio;
            }
        },

        // 延迟设置缩略图
        timeoutProview(data: any) {
            if(data && data.length) {
                clearTimeout((<any>this).loopTimer);
                (<any>this).loopTimer = setTimeout(() => {
                    (<any>this).setWorker(data, (r_d: any) => {
                        (<any>this).setProload(r_d);
                    });
                }, 500);
            }
        },
    },
}