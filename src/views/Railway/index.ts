import moment from 'moment';
import puppeteer from 'puppeteer';
import 'moment/locale/zh-cn';

declare var eStore: any;
declare var global: any;

export default {
    name: 'railway',
    data() {
        return {
            // 筛选条件
            filter: {
                from: [],
                to: [],
                date: moment(),
            },

            // 加载状态
            loading: false,

            // 处理后的城市列表
            cities: [],

            // 节流
            throttle: {
                timer: null,
                sec: 2000,
                enable: true,
            },

            // 表格
            table: {
                columns: [
                    {
                        title: '车次',
                        dataIndex: 'number',
                        key: 'number',
                        width: 80,
                    },
                    {
                        dataIndex: 'journey',
                        key: 'journey',
                        scopedSlots: {
                            customRender: 'journey',
                        },
                        slots: {
                            title: 'journeyTitle'
                        },
                        width: 150,
                    },
                    {
                        title: '一等座',
                        dataIndex: 'level1',
                        key: 'level1',
                        width: 120,
                        scopedSlots: {
                            customRender: 'ticket',
                        },
                    },
                    {
                        title: '二等座',
                        dataIndex: 'level2',
                        key: 'level2',
                        width: 120,
                        scopedSlots: {
                            customRender: 'ticket',
                        },
                    },
                    {
                        title: '硬卧 / 二等卧',
                        dataIndex: 'hard_sleeper',
                        key: 'hard_sleeper',
                        width: 120,
                    },
                    {
                        title: '硬座',
                        dataIndex: 'hard_seat',
                        key: 'hard_seat',
                        width: 120,
                    },
                    {
                        title: '无座',
                        dataIndex: 'no_seat',
                        key: 'no_seat',
                        width: 120,
                    },
                ],
                expand: [
                    {
                        title: '历时',
                        dataIndex: 'last',
                        key: 'last',
                        width: 80,
                    },
                    {
                        title: '商务座 / 特等座',
                        dataIndex: 'business_seat',
                        key: 'business_seat',
                    },
                    {
                        title: '高级软卧',
                        dataIndex: 'senior_soft_sleeper',
                        key: 'senior_soft_sleeper',
                    },
                    {
                        title: '软卧 / 一等卧',
                        dataIndex: 'soft_sleeper',
                        key: 'soft_sleeper',
                    },
                    {
                        title: '动卧',
                        dataIndex: 'high_soft_sleeper',
                        key: 'high_soft_sleeper',
                    },
                    {
                        title: '软座',
                        dataIndex: 'soft_seat',
                        key: 'soft_seat',
                    },
                    {
                        title: '其他',
                        dataIndex: 'other',
                        key: 'other',
                    },
                ],
                data: [
                    {
                        key: 0,
                        number: 'K1666',
                        journey: {
                            from: {
                                station: '乌鲁木齐南',
                                time: '07:36',
                            },
                            to: {
                                station: '乌鲁木齐南',
                                time: '07:36',
                            },
                            interval: 1,
                        },
                        last: '06:50',
                        business_seat: '100 / ¥1239.0',
                        level1: '¥1239.0',
                        level2: '¥1239.0',
                        senior_soft_sleeper: '100 / ¥1239.0',
                        soft_sleeper: '100 / ¥1239.0',
                        high_soft_sleeper: '100 / ¥1239.0',
                        hard_sleeper: '100 / ¥1239.0',
                        soft_seat: '100 / ¥1239.0',
                        hard_seat: '100 / ¥1239.0',
                        no_seat: '100 / ¥1239.0',
                        other: '100 / ¥1239.0',
                    },
                ],
            },

            // 接口格式
            format: {
                leftTicket: {
                    item2: {
                        label: '车次别名',
                        value: 'alias',
                    },
                    item3: {
                        label: '车次',
                        value: 'train',
                    },
                },
            },

            browser: null,
            page: null,

            // requirePath: 'https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2020-08-05&leftTicketDTO.from_station=GZQ&leftTicketDTO.to_station=SZQ&purpose_codes=ADULT',
        }
    },
    methods: {
        // 
        async init() {
            (<any>this).browser = await puppeteer.launch();
            (<any>this).page = await (<any>this).browser.newPage();
            await (<any>this).page.goto('https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2020-08-05&leftTicketDTO.from_station=GZQ&leftTicketDTO.to_station=SZQ&purpose_codes=ADULT');
        },

        // 不可选择的日期
        disabledDate(current: any) {
            return current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
        },

        // 筛选
        onFilter(inputValue: any, path: any) {
          return path.some((option: any) => {
              return option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
          });
        },

        // 获取站点列表
        getStationList() {
            // (<any>this).$getFiles('/12306/index/script/core/common/station_name_v10082.js');
            (<any>this).$getFiles('/kyfw/resources/js/framework/station_name.js').then((res: any) => {
                (<any>this).cities = [];
                let orgin = decodeURI(res).split('\'')[1].split('@');
                orgin.splice(0, 1);
                orgin.forEach(item => {
                    let arr = item.split('|');
                    let target = {
                        label: `${arr[1]}(${arr[2]})`,
                        value: arr[2],
                        alias: arr[0],
                        short: arr[4],
                        full: arr[3],
                        index: arr[5],
                    };
                    if(arr[1].split(' ').length === 1) { // 暂时剔除未知的带有空格的站点名
                        if((<any>this).cities.length) {
                            let notAdd = true;
                            for (let i = 0; i < (<any>this).cities.length; i++) {
                                if((<any>this).cities[i].value === arr[3][0]) {
                                    (<any>this).cities[i].children.push(target);
                                    notAdd = false;
                                    break;
                                }
                            }
                            if(notAdd) {
                                (<any>this).cities.push({
                                    value: arr[3][0],
                                    label: `拼音 ${arr[3][0].toUpperCase()} 开头`,
                                    children: [target],
                                });
                            }
                        }
                        else {
                            (<any>this).cities.push({
                                value: arr[3][0],
                                label: `拼音 ${arr[3][0].toUpperCase()} 开头`,
                                children: [target],
                            });
                        }
                    }
                });

                // 第一级排序
                (<any>this).cities.sort((a: any, b: any) => {
                    if(a.value < b.value) return -1;
                    if(a.value > b.value) return 1;
                    return 0;
                });

                // 第二级排序
                (<any>this).cities.forEach((item: any) => {
                    item.children.sort((a: any, b: any) => {
                        // if(a.full < b.full) return -1;
                        // if(a.full > b.full) return 1;
                        // return 0;
                        return a.full.localeCompare(b.full);
                    });
                });
            });
        },

        // 获取数据
        getData(from: String, to: String, date: String) {
            // console.log(res.data);
            // res.data.result.forEach(item => {
            //     let arr = item.split('|');
            //     console.log(arr);
            // });

            // superagent.get('https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2020-08-12&leftTicketDTO.from_station=GZQ&leftTicketDTO.to_station=GIW&purpose_codes=ADULT')
            // .end((res: any, ret: any) => {
            //     console.log(res);
            // });

            let url= 'https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2020-08-12&leftTicketDTO.from_station=GZQ&leftTicketDTO.to_station=GIW&purpose_codes=ADULT';

            url=url.replace(/&/g,'$');

            (<any>this).$axios('http://127.0.0.1:8888?url='+ url, 'get').then((res: any) => {
                console.log(res.data);
            });
        },

        // 查询
        submit() {
            let canSubmit = true;
            for (const key in (<any>this).filter) {
                if ((<any>this).filter[key] === '' || (<any>this).filter[key].length === 0) {
                    canSubmit = false;
                    (<any>this).$message.error('查询条件未完整！');
                    return false;
                }
            }
            if(JSON.stringify((<any>this).filter.from) === JSON.stringify((<any>this).filter.to)) {
                canSubmit = false;
                (<any>this).filter.from = [];
                (<any>this).filter.to = [];
                (<any>this).$message.error('出发地和到达地不能相同！');
                return false;
            }
            if(canSubmit && (<any>this).throttle.enable) {
                (<any>this).getData((<any>this).filter.from[(<any>this).filter.from.length - 1], (<any>this).filter.to[(<any>this).filter.to.length - 1], (<any>this).filter.date.format('YYYY-MM-DD'));
                // (<any>this).throttle.enable = false;
                // (<any>this).loading = true;
                // if((<any>this).throttle.timer) {
                //     clearTimeout((<any>this).throttle.timer);
                // }
                // (<any>this).throttle.timer = setTimeout(() => {
                //     (<any>this).loading = false;
                //     (<any>this).getData();
                //     (<any>this).throttle.enable = true;
                // }, (<any>this).throttle.sec);
            }
        },
    },
    created() {
        (<any>this).getStationList();
    },
}