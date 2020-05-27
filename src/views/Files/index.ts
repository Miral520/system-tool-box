declare var global: any;

export default {
    name: 'files',
    data() {
        return {
            activeURL: '', // 激活标签URL

            activeStatus: { // 激活目录状态
                folders: 12,
                files: 5,
                total: 17,
            },

            tabs: [], // 标签数据

            loading: true, // 加载中

            isThumb: true, // 缩略图模式
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
            return global.fs.readdirSync(url);
        }
    },
}