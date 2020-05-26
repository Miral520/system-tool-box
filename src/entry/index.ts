declare var global: any;

export default<any> {
    name: 'index',
    data() {
        return {
            // 菜单
            menu: {
                collapsed: true,
                collapsedWidth: 50,
                defaultSelectedKeys: [this.$router.options.routes[0].name],
            },

            // 面包屑
            breadcrumb: {
                show: true,
            },

            // 底部
            footer: {
                show: true,
                text: 'Project ©2020 Created by Miral',
            },

            // 退出确认
            float: {
                vsisible: false,
                show: true,
            },

            // 系统信息
            sysInfo: {},

            // 全屏状态
            isFullscreen: false,

            // 加载窗口
            loadingWin: {
                show: true,
                percent: 0,
                sec: 3,
                strokeColor: {
                    from: '#108ee9',
                    to: '#87d068',
                }
            },

            // 右上角设置
            settingData: {
                userName: '测试用户',
                userDesc: '用户描述',
                icon: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                hasMsg: true,
                menu: [
                    {
                        label: '设置',
                        icon: 'setting',
                        hasMsg: true,
                        to: '',
                    },
                    {
                        label: '用户',
                        icon: 'user',
                        hasMsg: false,
                        to: '',
                    },
                    {
                        label: '更多',
                        icon: 'ellipsis',
                        hasMsg: false,
                        to: '',
                    },
                ],
            },
        }
    },
    created() {
        this.getOsType();

        this.$nextTick(() => {
            this.loadApp(this.launchApp);
        });
    },
    methods: {
        // 关闭提示
        closeFloatHandle() {
            if((<any>this).float.show) {
                // (this as any).float.vsisible = true;
                (<any>this).float.vsisible = true;
            }
            else {
                this.closeHandle();
            }
        },

        // 关闭程序
        closeHandle() {
            global.app.exit();
        },

        // 取消关闭
        cancelHandle() {
            (<any>this).float.show = true;
        },

        // 监听checkbox
        nextBoxHandle(e: any) {
            (<any>this).float.show = !e.target.checked;
        },

        // 最小化
        minimizeHandle() {
            global.ipcRenderer.send('min');
        },

        // 全屏切换
        fullscreenHandle() {
            global.ipcRenderer.send('fullscreen');
            (<any>this).isFullscreen = !(<any>this).isFullscreen;
        },

        // 获取系统信息
        getOsType() {
            global.ipcRenderer.on('sys', (event: any, message: any) => {
              (<any>this).sysInfo = message;
            });
        },

        // 启动页切换至主页
        launchApp() {
            (<any>this).loadingWin.show = false;
            let timer = setTimeout(() => {
                clearTimeout(timer);
                global.ipcRenderer.send('changeWinSize');
            }, 1000);
        },

        // 加载
        loadApp(callback: any) {
            let timer = setInterval(() => {
                if ((<any>this).loadingWin.percent >= 100) {
                    clearInterval(timer);
                    if(callback) {
                        callback();
                    }
                }
                (<any>this).loadingWin.percent += Math.round(100 / parseInt((<any>this).loadingWin.sec) / 20);
            }, 50); 
        },
    },
}