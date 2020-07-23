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
            },

            // 设置
            setting: {
                visible: false,
                config: {
                    floatHide: {
                        title: '隐藏退出询问',
                        type: 'switch',
                        value: false,
                    },
                    theme: {
                        title: '选择界面主题',
                        type: 'radio-group',
                        full:  true,
                        props: {
                            defaultValue: 'light',
                        },
                        childCpt: { 
                            type: 'radio',
                            option: [
                                {
                                    label: '浅色主题',
                                    value: 'light',
                                },
                                {
                                    label: '深色主题',
                                    value: 'dark',
                                },
                                {
                                    label: '跟随系统',
                                    value: 'auto',
                                },
                            ],
                        },
                        value: 'light',
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
                        title: '',
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

            // 开发模式
            mode: '',

            // 当前系统主题为暗色主题
            sysIsDark: false,
        }
    },
    created() {
        (<any>this).init();

        (<any>this).getOsType();

        (<any>this).$nextTick(() => {
            (<any>this).loadApp((<any>this).launchApp);
        });

        (<any>this).calcRunTime();
    },
    methods: {
        // 初始化
        init() {
            (<any>this).setTheme(true);
            (<any>this).getSysTheme();
            (<any>this).mode = (<any>this).$fn.getUrlSearch('mode') === 'prod' ? 'prod' : 'dev';
            if((<any>this).mode === 'dev') {
                (<any>this).$store.commit('setMode', (<any>this).mode);
                (<any>this).loadingWin.show = false;
            }
        },

        // dom执行方法
        runFn(name: any) {
            (<any>this)[name]();
        },

        // 设置主题
        setTheme(first: Boolean = false) {
            let config = first ? (<any>this).$store.state.config : {};
            for (const key in (<any>this).setting.config) {
                if(first) {
                    if (Object.prototype.hasOwnProperty.call(config, key)) {
                        (<any>this).setting.config[key].value = (<any>this).$store.state.config[key];
                    }
                    else {
                        config[key] = (<any>this).setting.config[key].value;
                    }
                }
                else {
                    config[key] = (<any>this).setting.config[key].value;
                }
            }
            (<any>this).$fn.saveProfile('config', config);
            if(config.theme === 'auto') {
                (<any>this).$store.commit('setTheme', (<any>this).sysIsDark ? 'dark' : 'light');
            }
            else {
                (<any>this).$store.commit('setTheme', config.theme);
            }
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
                (<any>this).setting.config[key].value = (<any>this).config[key];
            }
            (<any>this).setting.visible = !(<any>this).setting.visible;
        },

        // 设置确定
        confirmSetting() {
            (<any>this).setTheme(false);
            (<any>this).setting.visible = false;
        },

        // 关闭提示
        closeFloatHandle() {
            if((<any>this).config.floatHide) {
                this.closeHandle();
            }
            else {
                (<any>this).float.visible = true;
            }
        },

        // 关闭程序
        closeHandle() {
            (<any>this).confirmSetting();
            global.app.exit();
        },

        // 取消关闭
        cancelHandle() {
            (<any>this).setting.config.floatHide.value = false;
        },

        // 监听checkbox
        nextBoxHandle(e: any) {
            (<any>this).setting.config.floatHide.value = e.target.checked;
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

                // macOS下添加主题跟随系统选项
                // (<any>this).setting.config.theme.childCpt.option[2].disable = message.platform === 'darwin' ? false : true;
            });
        },

        // 监听系统主题状态
        getSysTheme() {
            global.ipcRenderer.on('nativeTheme', (event: any, message: any) => {
                (<any>this).sysIsDark = message.shouldUseDarkColors;
                if((<any>this).$store.state.config.theme && (<any>this).$store.state.config.theme === 'auto') {
                    (<any>this).$store.commit('setTheme', message.shouldUseDarkColors ? 'dark' : 'light');
                }
            });
        },

        // 启动页切换至主页
        launchApp() {
            (<any>this).loadingWin.show = false;
            let timer = setTimeout(() => {
                clearTimeout(timer);
                global.ipcRenderer.send('changeWinSize');
            }, (<any>this).mode === 'dev' ? 0 : 1000);
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
                    (<any>this).loadingWin.percent += Math.round(100 / parseInt((<any>this).mode === 'dev' ? 0 : (<any>this).loadingWin.sec) / 20);
                }, 50);
            }
        },

        // 程序访问次数
        calcRunTime() {
            if(eStore.has('runTime')) {
                let time = eStore.get('runTime');
                eStore.set('runTime', time + 1);
            }
            else {
                eStore.set('runTime', 1);
            }
        },
    },
    computed: {
        // 设置
        config() {
            return (<any>this).$store.state.config;
        },

        // 主题
        theme() {
            return (<any>this).$store.state.theme;
        },
    },
}