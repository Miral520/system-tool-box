declare var global: any;

export default {
    name: 'files',
    data() {
        return {
            activeURL: '', // 激活标签URL

            tabs: [], // 标签数据

            loading: true, // 加载中

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
            let userInfo = (<any>this).$store.state.sysInfo.userInfo;
            let tab = {
                label: userInfo.username,
                url: userInfo.homedir,
                closable: false,
                data: (<any>this).loadFiles(userInfo.homedir),
            };
            (<any>this).tabs.push(tab);
            (<any>this).activeURL = userInfo.homedir;
        },

        // 切换缩略图和列表
        handleThumb() {
            (<any>this).isThumb = !(<any>this).isThumb;
        },

        // 读取指定目录下文件
        loadFiles(url: String) {
            let files: any = {
                lists: [],
                desc: {
                    folders: 0,
                    files: 0,
                    total: 0,
                },
            };

            let allFiles = global.fs.readdirSync(url, {
                withFileTypes: true,
            });

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
                    // (<any>this).$message.error(`${url} 没有权限！`);
                    info.info = '无权限访问';
                }
            }
            else {
                try {
                    let files = global.fs.readdirSync(url);
                    info.info = `${files.length}个文件`;
                    info.type = 'folder';
                }
                catch (error) {
                    // (<any>this).$message.error(`${url} 没有权限！`);
                    info.info = '无权限访问';
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
    },
}