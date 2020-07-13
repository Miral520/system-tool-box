declare var eStore: any;

export default {
    name: 'home',
    data() {
        return {
            statistic: [
                {
                    title: '运行次数',
                    value: eStore.get('runTime'),
                    suffix: {
                        type: 'text',
                        value: '',
                    },
                },
                {
                    title: '今日',
                    value: (<any>this).getToday(),
                    suffix: {
                        type: 'text',
                        value: '',
                    },
                },
            ],

            // 滚动条配置
            ops: {
                scrollPanel: {
                    scrollingX: false,
                },
            },

            // 是否显示ipv6
            showIPv6: false,

            // 物理磁盘
            diskDrive: [],

            // 逻辑分区
            logicDrive: [],

            // 刷新定时器
            timer: null,
        }
    },
    methods: {
        // 获取今日
        getToday() {
            let date = new Date();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            return `${date.getFullYear()}年${month > 9 ? month : '0' + month}月${day > 9 ? day : '0' + day}日`;
        },

        // 获取物理磁盘
        getDiskDrive() {
            (<any>this).diskDrive = [];
            (<any>this).$fn.getCMDInfo('disk_drive', (stdout: any) => {
                stdout.forEach((item: any) => {
                    (<any>this).diskDrive.push({
                        name: item[0],
                        interface: item[1],
                        size: (<any>this).$fn.setByte(item[2]),
                    });
                });
            }, (err: any, stderr: any) => {
                (<any>this).$message.error('获取物理磁盘失败！');
            });
        },

        // 获取分区详细
        getDiskDetail() {
            (<any>this).logicDrive = [];
            (<any>this).$fn.getCMDInfo('logic_drive', (stdout: any) => {
                stdout.forEach((item: any) => {
                    (<any>this).logicDrive.push({
                        name: item[0].substring(0, item[0].length - 1),
                        fileSystem: item[1],
                        free: (<any>this).$fn.setByte(item[2]),
                        total: (<any>this).$fn.setByte(item[3]),
                        percent: (item[2] / item[3] * 100).toFixed(0),
                    });
                });
            }, (err: any, stderr: any) => {
                (<any>this).$message.error('获取分区失败！');
            });
        },
    },
    computed: {
        sysInfo() {
            let orgin = (<any>this).$store.state.sysInfo;
            if(JSON.stringify(orgin) === '{}') {
                return null;
            }
            else {
                let colorSpace = orgin.screen.colorSpace.substring(1, orgin.screen.colorSpace.length - 1).split(',');
                let colorSpaceData: any = {};
                colorSpace.forEach((str: any) => {
                    str = str.replace(/(^\s*)|(\s*$)/g, '');
                    let target = str.split(':');
                    colorSpaceData[target[0]] = target[1];
                });
                let cpusData: any = [];
                orgin.cpus.forEach((item: any) => {
                    cpusData.push({
                        name: item.model,
                        speed: `${(item.speed / 1024).toFixed(2)}GHz`,
                    });
                });
                let networkData: any = [];
                let netIndex = 0;
                for (const key in orgin.networkInterfaces) {
                    let netTarget = orgin.networkInterfaces[key];
                    networkData[netIndex] = {
                        name: key,
                        interface: [],
                    };
                    for (let i = 0; i < netTarget.length; i++) {
                        if(netTarget[i].family === 'IPv6' && !(<any>this).showIPv6) {
                            continue;
                        }
                        networkData[netIndex].interface.push(netTarget[i]);
                    }
                    netIndex++;
                }
                // 删除空网卡
                for (let i = networkData.length - 1; i >= 0; i--) {
                    if(networkData[i].interface.length) {
                        continue;
                    }
                    else {
                        networkData.splice(i, 1);
                    }
                }
                let sysInfoData = {
                    hostname: orgin.hostname, // 主机名
                    user: {
                        homedir: orgin.userInfo.homedir,
                        username: orgin.userInfo.username,
                        tmpdir: orgin.tmpdir,
                        uptime: (<any>this).$fn.formatSeconds(orgin.uptime),
                    },
                    memery: {
                        free: (<any>this).$fn.setByte(orgin.freemem),
                        total: (<any>this).$fn.setByte(orgin.totalmem),
                        percent: (orgin.freemem / orgin.totalmem * 100).toFixed(0),
                    },
                    os: {
                        type: orgin.type === 'Darwin' ? 'MacOS' : (orgin.type === 'Windows_NT' ? 'Windows' : orgin.type),
                        platform: orgin.platform,
                        version: orgin.release,
                    },
                    screen: {
                        accelerometer: { // 加速器支持 available、unavailable、unknown
                            label: orgin.screen.accelerometerSupport === 'available' ? '可用' : (orgin.screen.accelerometerSupport === 'unavailable' ? '不可用' : '未知'),
                            value: orgin.screen.accelerometerSupport,
                        },
                        touch: { // 触控支持 available、unavailable、unknown
                            label: orgin.screen.touchSupport === 'available' ? '可用' : (orgin.screen.touchSupport === 'unavailable' ? '不可用' : '未知'),
                            value: orgin.screen.touchSupport,
                        },
                        width: orgin.screen.size.width * orgin.screen.scaleFactor, // 屏幕宽
                        height: orgin.screen.size.height * orgin.screen.scaleFactor, // 屏幕高
                        colorDepth: orgin.screen.colorDepth, // 色彩深度
                        colorSpace: colorSpaceData, // 色彩空间
                    },
                    cpus: {
                        arch: orgin.arch, // 架构
                        core: cpusData, // 核心
                    },
                    networks: networkData,
                };
                return sysInfoData;
            }
        },
    },
    watch: {
        sysInfo: {
            // immediate: true,
            // deep: true,
            handler(val: any) {
                if((<any>this).timer) {
                    clearTimeout((<any>this).timer);
                }
                (<any>this).timer = setTimeout(() => {
                    (<any>this).getDiskDrive();
                    (<any>this).getDiskDetail();
                }, 500);
            }
        },
    },
}