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
                text: '',
            },

            // 退出确认
            float: {
                vsisible: false,
                show: true,
            },

            // 全屏状态
            isFullscreen: false,

            // 加载窗口
            loadingWin: {
                show: true,
                percent: 0,
                sec: this.$var.startTime,
                strokeColor: {
                    from: '#108ee9',
                    to: '#87d068',
                }
            },

            // 右上角设置
            settingData: {
                hasMsg: true,
                menu: [ // 菜单
                    {
                        label: '设置',
                        icon: 'setting',
                        hasMsg: true,
                        fn: '',
                    },
                    {
                        label: '关于',
                        icon: 'info-circle',
                        hasMsg: false,
                        fn: 'handleAbout',
                    },
                ],
            },

            // 关于
            about: {
                visible: false,
                data: {
                    devName: {
                        title: '项目',
                        value: '',
                    },
                    author: {
                        title: '开发',
                        value: '',
                    },
                    version: {
                        title: '版本',
                        value: '',
                    },
                },
            },
        }
    },
    created() {
        this.init();

        this.getOsType();

        this.$nextTick(() => {
            this.loadApp(this.launchApp);
        });
    },
    methods: {
        // 初始化
        init() {
            let mode = (<any>this).$fn.getUrlSearch('mode');
            if(mode === 'dev') {
                (<any>this).$store.commit('setMode', mode);
                (<any>this).loadingWin.show = false;
            }
        },

        // dom执行方法
        runFn(name: any) {
            (<any>this)[name]();
        },

        // 关于
        handleAbout() {
            if(!(<any>this).about.visible) {
                (<any>this).about.data.devName.value = (<any>this).$store.state.sysInfo.about.name;
                (<any>this).about.data.author.value = (<any>this).$store.state.sysInfo.about.author;
                (<any>this).about.data.version.value = (<any>this).$store.state.sysInfo.about.version;
            }
            (<any>this).about.visible = !(<any>this).about.visible;
        },

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
                (<any>this).$store.commit('setSys', message);
                (<any>this).footer.text = `${message.about.name} ©${new Date().getFullYear()} Created by ${message.about.author}`;
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
            if((<any>this).loadingWin.show) {
                let timer = setInterval(() => {
                    if ((<any>this).loadingWin.percent >= 100) {
                        clearInterval(timer);
                        if(callback) {
                            callback();
                        }
                    }
                    (<any>this).loadingWin.percent += Math.round(100 / parseInt((<any>this).loadingWin.sec) / 20);
                }, 50);
            }
        },
    },
}