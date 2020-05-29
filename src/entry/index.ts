declare var global: any;
declare var eStore: any;

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
                visible: false,
                show: !eStore.get('floatHide'),
            },

            // 设置
            setting: {
                visible: false,
                config: {
                    floatHide: {
                        title: '隐藏退出确认',
                        type: 'switch',
                        value: eStore.get('floatHide'),
                    },
                },
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
                        fn: 'handleSetting',
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

        // 设置
        handleSetting() {
            for (const key in (<any>this).setting.config) {
                (<any>this).setting.config[key].value = eStore.get(key);
            }
            (<any>this).setting.visible = !(<any>this).setting.visible;
        },

        // 设置确定
        confirmSetting() {
            for (const key in (<any>this).setting.config) {
                eStore.set(key, (<any>this).setting.config[key].value);
            }
            (<any>this).setting.visible = false;
        },

        // 关闭提示
        closeFloatHandle() {
            (<any>this).float.show = !eStore.get('floatHide');
            if((<any>this).float.show) {
                // (this as any).float.visible = true;
                (<any>this).float.visible = true;
            }
            else {
                this.closeHandle();
            }
        },

        // 关闭程序
        closeHandle() {
            eStore.set('floatHide', !(<any>this).float.show);
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
    // computed: {
    //     floatHide() {
    //         return (<any>this).float.show;
    //     },
    // },
    // watch: {
    //     floatHide: {
    //         // immediate: true,
    //         handler(val: Boolean) {
    //             eStore.set('floatHide', val);
    //         }
    //     },
    // },
}