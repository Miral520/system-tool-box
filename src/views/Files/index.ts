declare var global: any;

export default {
    name: 'files',
    data() {
        return {
            inputURL: '', // 输入框URL

            activeURL: '', // 激活标签URL

            tabs: [], // 标签数据

            isThumb: true, // 缩略图模式

            grid: { // 布局
                thumb: {
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 6,
                    xxl: 3,
                },
                list: {
                    gutter: 16,
                    column: 1,
                },
            },

            units: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'], // 单位
        }
    },
    created() {
        (<any>this).init();
    },
    methods: {
        // 初始化
        init() {
            (<any>this).addDefault();
        },

        // 添加默认目录
        addDefault() {
            let userInfo = (<any>this).$store.state.sysInfo.userInfo;
            (<any>this).addTab(userInfo.username, userInfo.homedir, (<any>this).loadFiles(userInfo.homedir), false);
            (<any>this).activeURL = userInfo.homedir;
            (<any>this).inputURL = userInfo.homedir;

            global.child_process.exec('wmic logicaldisk get caption', (err: any, stdout: any, stderr: any) => {
                if(err || stderr) {
                    let userInfo = (<any>this).$store.state.sysInfo.userInfo;
                    (<any>this).addTab(userInfo.username, userInfo.homedir, (<any>this).loadFiles(userInfo.homedir), false);
                    (<any>this).activeURL = userInfo.homedir;
                    (<any>this).inputURL = userInfo.homedir;
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
                            let name = newArr.join('');
                            let data = (<any>this).loadFiles(name);
                            if(data) {
                                (<any>this).addTab(name, name, data, false);
                            }
                        }
                    });
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

        // 刷新
        refresh() {
            (<any>this).tabs[parseInt((<any>this).getTabCode((<any>this).activeURL))].data = (<any>this).loadFiles((<any>this).activeURL);
        },

        // 向上
        rollback() {
            let urlArr = (<any>this).activeURL.split('\\');
            if(urlArr.length > 1) {
                urlArr.pop();
                let label = urlArr[urlArr.length - 1];
                let target = urlArr.join('\\');
                let data = (<any>this).loadFiles(target);
                let code = (<any>this).getTabCode((<any>this).inputURL);
                (<any>this).tabs[code].label = label;
                (<any>this).tabs[code].url = target;
                (<any>this).tabs[code].data = data;
                (<any>this).activeURL = target;
                (<any>this).inputURL = target;
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
                let urlArr = (<any>this).inputURL.split('\\');
                let label = urlArr[urlArr.length - 1];
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
                let target = `${(<any>this).activeURL}\\${file.name}`;
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
        loadFiles(url: String) {
            try {
                let allFiles = global.fs.readdirSync(url, {
                    withFileTypes: true,
                });
                let files: any = {
                    lists: [],
                    desc: {
                        folders: 0,
                        files: 0,
                        total: 0,
                    },
                };
                files.desc.total = allFiles.length;
                allFiles.forEach((item: any) => {
                    let isFile = item.isFile();
                    let type = '';
                    let desc = '';
                    if(isFile) {
                        let data = (<any>this).getDesc(`${url}\\${item.name}`, 'file');
                        type = 'file';
                        desc = data.info;
                        files.desc.files++;
                    }
                    else {
                        let data = (<any>this).getDesc(`${url}\\${item.name}`, 'folder');
                        type = 'folder';
                        desc = data.info;
                        files.desc.folders++;
                    }
                    files.lists.push({
                        name: item.name,
                        type: type,
                        isImage: false,
                        desc: desc,
                    });
                });
                return files;
            }
            catch (error) {
                (<any>this).$message.error('目录不存在');
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
    },
}