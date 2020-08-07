import moment from 'moment';
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

            // requirePath: 'https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2020-08-05&leftTicketDTO.from_station=GZQ&leftTicketDTO.to_station=SZQ&purpose_codes=ADULT',
        }
    },
    methods: {
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

        // 查询
        submit() {
            let canSubmit = true;
            for (const key in (<any>this).filter) {
                if ((<any>this).filter[key] === '' || (<any>this).filter[key].length === 0) {
                    canSubmit = false;
                    (<any>this).$message.error('查询条件未完整！');
                    break;
                }
            }
            if(JSON.stringify((<any>this).filter.from) === JSON.stringify((<any>this).filter.to)) {
                canSubmit = false;
                (<any>this).filter.from = [];
                (<any>this).filter.to = [];
                (<any>this).$message.error('出发地和到达地不能相同！');
            }
            if(canSubmit && (<any>this).throttle.enable) {
                (<any>this).throttle.enable = false;
                (<any>this).loading = true;
                if((<any>this).throttle.timer) {
                    clearTimeout((<any>this).throttle.timer);
                }
                (<any>this).throttle.timer = setTimeout(() => {
                    (<any>this).loading = false;
                    (<any>this).throttle.enable = true;
                }, (<any>this).throttle.sec);
            }
        },
    },
    created() {
        (<any>this).getStationList();
    },
}