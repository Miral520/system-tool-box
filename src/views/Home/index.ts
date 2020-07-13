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
                {
                    title: '系统正常运行时间',
                    value: '',
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
        }
    },
    methods: {
        getToday() {
            let date = new Date();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            return `${date.getFullYear()}年${month > 9 ? month : '0' + month}月${day > 9 ? day : '0' + day}日`;
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
                (<any>this).statistic[2].value = (<any>this).$fn.formatSeconds(orgin.uptime);
                let sysInfoData = {
                    hostname: orgin.hostname, // 主机名
                    user: {
                        homedir: orgin.userInfo.homedir,
                        username: orgin.userInfo.username,
                        tmpdir: orgin.tmpdir,
                        uptime: (<any>this).statistic[2].value,
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
                        width: orgin.screen.size.width, // 屏幕宽
                        height: orgin.screen.size.height, // 屏幕高
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
}