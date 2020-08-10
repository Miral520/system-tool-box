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

            // 表格
            table: {
                scroll: {
                    x: 1920,
                },
                columns: [
                    {
                        title: '车次',
                        dataIndex: 'number',
                        key: 'number',
                        ellipsis: true,
                        fixed: 'left',
                        width: 60,
                    },
                    {
                        title: '出发站 / 出发时间',
                        dataIndex: 'sts_std',
                        key: 'sts_std',
                        ellipsis: true,
                        fixed: 'left',
                        width: 140,
                    },
                    {
                        title: '到达站 / 到达时间',
                        dataIndex: 'ess_esd',
                        key: 'ess_esd',
                        ellipsis: true,
                        fixed: 'left',
                        width: 140,
                    },
                    {
                        title: '历时',
                        dataIndex: 'last',
                        key: 'last',
                        ellipsis: true,
                        fixed: 'left',
                        width: 70,
                    },
                    {
                        title: '商务座 / 特等座',
                        dataIndex: 'business_seat',
                        key: 'business_seat',
                        ellipsis: true,
                        width: 130,
                    },
                    {
                        title: '一等座',
                        dataIndex: 'level1',
                        key: 'level1',
                        ellipsis: true,
                        width: 120,
                    },
                    {
                        title: '二等座 / 二等包座',
                        dataIndex: 'level2',
                        key: 'level2',
                        ellipsis: true,
                        width: 145,
                    },
                    {
                        title: '高级软卧',
                        dataIndex: 'senior_soft_sleeper',
                        key: 'senior_soft_sleeper',
                        ellipsis: true,
                        width: 120,
                    },
                    {
                        title: '软卧 / 一等卧',
                        dataIndex: 'soft_sleeper',
                        key: 'soft_sleeper',
                        ellipsis: true,
                        width: 120,
                    },
                    {
                        title: '动卧',
                        dataIndex: 'high_soft_sleeper',
                        key: 'high_soft_sleeper',
                        ellipsis: true,
                        width: 120,
                    },
                    {
                        title: '硬卧 / 二等卧',
                        dataIndex: 'hard_sleeper',
                        key: 'hard_sleeper',
                        ellipsis: true,
                        width: 120,
                    },
                    {
                        title: '软座',
                        dataIndex: 'soft_seat',
                        key: 'soft_seat',
                        ellipsis: true,
                        width: 120,
                    },
                    {
                        title: '硬座',
                        dataIndex: 'hard_seat',
                        key: 'hard_seat',
                        ellipsis: true,
                        width: 120,
                    },
                    {
                        title: '无座',
                        dataIndex: 'no_seat',
                        key: 'no_seat',
                        ellipsis: true,
                        width: 120,
                    },
                    {
                        title: '其他',
                        dataIndex: 'other',
                        key: 'other',
                        ellipsis: true,
                        width: 120,
                    },
                ],
                data: [
                    {
                        key: 0,
                        number: 'K1666',
                        sts_std: '广州东 / 07:36',
                        ess_esd: '乌鲁木齐东 / 07:36',
                        last: '06:50',
                        business_seat: '100 / ¥1239.0',
                        level1: '100 / ¥1239.0',
                        level2: '100 / ¥1239.0',
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

        let data = { 'httpstatus': 200, 'data': { 'result': ['HIZt42Xb8qzCqdO9yxWfsMk9ME9L4SXG8HgsHyFagsovoRYoD2W5Ix968wjgVn6G%2B8lbgetRL12g%0ADsv62NQ1wSxJYs%2FVJAjd%2B%2BS%2BjTiq%2BfCRcmFlkpfpfFhiCJCVYf%2FuZtGHEeqkiNbs9X3HlQ452N0K%0ArjZUmaztY38lQ1MYdKjmTCmvErI8oDzKyEdEV0Uv05SI7jsw%2FjRWwZcynfhN9jlNDYtlIfcYbvNt%0AlBCNlYZgK7JipeOSTWBKxSQC0JIi4IJbrk4rVcg52E8EedWE5JWtom%2F6jYCK9PVB5cVDxbtexsaH%0Aghif5A%3D%3D|预订|6b0000Z1120A|Z112|VUQ|VAB|GZQ|GZG|07:36|12:42|05:06|Y|lU%2FaR81kRlByQuJ%2BLNawLC372aEYx924XnZZUK%2BhXyLfdFhmVJL4U7UKZQk%3D|20200807|3|Q6|08|10|1|0||||2|||无||无|无|||||301040W0|3141|1|1||3011050000100625000040213500021006253000||||||1|', 'coOn22GzPMeEUhph6pEO2ph%2BhUVTdZQXghDESqe1zG%2Fg2syIf7bDMQ6vtxd1kZ1AJprIsDzLTrQJ%0A4n0zKJnC1204W4ganvDhMIM4fM85611XOclS1004qbDlRj5CpT1hk2CTLWyqLIi%2BbEsj%2BybHIRRd%0Ai2OhmornmlJHzV6bHxzza58YrBZyp8bZp04O2vwydrXN2CsnQfU%2BhngPbv4AanW499ZN7%2B6%2FoAoD%0AXq25PpmeWdF6sUzQZUcNzlMZDvv6sEuBZHhxvtPXYPy3F1Uv9fZkhE0LkossPdMZT3ES6H%2FB3Z%2FQ%0Ad5r%2FvFGuJVY%3D|预订|650000K67509|K675|GGQ|XCH|GGQ|GZG|07:45|14:39|06:54|Y|nkizpKwcupfbleozoXaA7i%2BNVtZ8rw1g06VVSjX71jiNGjqAqPYW4kfgWoM%3D|20200808|3|Q9|01|06|1|0||||13|||无||有|有|||||304010W0|3411|1|0||3017200021402640001310100000211010003000||||||1|', 'uw92gBBMSh%2BNf6ocqDdC79j18E%2BCqIBylKs1b60W2PjYz6oaKl5zo40Tefwg5bdSXT5sMPh5aSF7%0A29Qy6opnIWeg5EpMi%2BSpz2iknreYzspNfeOwgd%2BaaTkBIUPlwvIGQPMvcF1G9zwHB5%2FrUsuJjWJm%0A22MlXrcEbSvFYk2E%2BcK1DuM%2FxDp%2Fu6mh%2FzqoslD3p2yEuohi6fmx67JCv0YChySwkopElWbOBbWj%0A3ZdpjLGSE8WUA3MxAhfcyrWS3VSiAZv9IDSXVtHkjzIWqBsjZbhmGTSCwpLHLSWHCiOnTpuB8LII%0AbAtz%2FDQLhu%2FW2vJUKXUMag%3D%3D|预订|650000T21906|T219|GGQ|HFH|GGQ|GZG|11:12|17:52|06:40|Y|2dSJHV%2B%2Fc%2BLSjGoWZ0F5O%2Fsp%2BiSZLU8xkHVy%2FYOsxgamJSFoBibmgKvZrrRwlA7Gfk4nODOis6U%3D|20200808|3|Q7|01|06|1|0||4||7|||无||有|有|||||30104060W0|31461|1|0|4|30172000211010000021402640000760476000041010003000||||||1|', 'uzbu6Rwpt3fNwSHeQL%2FkhX2bh%2FHBgRqTfs2AiSssPdr21FhBUnRK0T4%2BrsRhHO2DflyHDm6yn0vH%0AS4RH24iDP3za3eTv%2FkKll%2BArh0a4V8Ao8v0vA96sQlm9moVgHc4BnJrNjEPoJEFMm2n3Jl4COJoX%0AX%2FzXG9fwlQVAAPDfYDanz4Q%2Bw2ERPj7B6a5BpT0KYgqY7gr3gfq7FWPkIsslHjVRVTZwwa139ojO%0AQ7Ywgk5XDp0iD9JFuaofRcU%2Bj%2FcLLcBOXtg7TkJYQPOYUzGHrfsPyxBOAjsZZDqWg%2BC6K2GZ08lc%0AfeIPi0zr2js%3D|预订|650000K7290J|K729|GGQ|DTV|GGQ|GZG|14:48|21:46|06:58|N|c9xlyrwFl3NUarePPmSK2RvrOIgo5ZmcxTLrvwzGx7O2gqxrzukwBoZAAIk%3D|20200808|3|Q6|01|07|1|0||||无|||无||无|无|||||304010W0|3411|1|1||3013300000402050000010075000001007503000||||||1|', 'R3gCrSOOiWEDxeEU%2BE2CJsodvZBce0yCQsnKVH8W%2FOpMyFb5GT%2BV6XZ6NLKv8p%2FW8ibMjKd%2BZCZX%0ACE3NyBtxGnhuZnh%2FAFKkyvuH0lrBFS41MmMIm2vSFQGQu%2B3VvAOca9TDuELzcYgD%2BYLPneQVeJKU%0A6Ol41ok3j06wgDtBiWz6IYu5WwNNKXYgjlIOFYhAEYIT6%2FmTAQLxpuOIQOhC4%2B8kBGNioNp5Z084%0AhcAh60%2Flohzg31PGqUey7jgUvHoYMgrZngvpScVJloscNy4HFZdOyEmgXAo5CNRxd9Pw%2B29vyFrp%0AXdeU5g%3D%3D|预订|630000T1700Q|T170|GZQ|SNH|GZQ|GZG|15:02|20:11|05:09|N|LoY6ZvBkKyP1iOcgOIpNsAAvMmp1FxwQn%2BN3jI9CC5PmMTTRIdvKI138Xgc%3D|20200808|3|QZ|01|06|1|0||||无|||无||无|无|||||301040W0|3141|0|1|1|3011050000100625000040213500001006253000||||||1|', 'MmrfHXjJR%2FwYjLSvXvPqPNFrIXZWebVN6Z8vD9LWDv7TRlcEl%2B%2FGglD3sV9rvYqEacgnSwOSbvp2%0A75WdBPeBL%2B0bDoF2itgiv3dHbmxCYtZ%2BOHQtLdkXLWKYy4gPRWa418bUWIMq%2B5Wmqazisteo18w4%0AwM87LaUZoPW%2BR8AALnQTqGduve57VgxpZ7Gpc5U%2B7Cz0nNvIcA350A4DKIu57T6W1sOdQafVi12h%0AQ90sIRPV26DvJAhjJYa5cnEzpEqZXJYFpoW3JGongoD4%2B9na%2BaoAC6cD49p6%2BRxuLkXczjqZwJPn%0Ar1ZeiFe27ks%3D|预订|650000K7950L|K795|GGQ|YTG|GGQ|GZG|16:30|23:12|06:42|Y|N7qC3wNH6b2DxUhUukDHwWywFnuc7P83GIsUVcWDw%2FWMCGq%2F7iWNDjM7l7w%3D|20200808|3|Q7|01|06|1|0||||5|||无||有|有|||||403010W0|4311|1|0||4026400005301720002110100000211010003000||||||1|', 'nO4EFQHUN4V0vVU%2B2gVlD5I7dJsT9fLhlCLoyQ4eAk5LEVx7QhbeNIZc7Xu9oo7ed98puihDzcqt%0AqY76FvnuVKf9y7hQsNBgPouzWIsqCac6vSRx151BBZ4yYDS4FVyYgqWfeenzdW91JUuEeTMw8%2BF9%0A8m5DtxT2wozvsSYQVTkP7cbTyBlCJuKCiRhSnQvV3Obktkd4rRmU5ba1sv3GaQqrYRrjKez45aGt%0ABs8WL8FCsE4mQsIUdAfx7mrvAaZWri79%2F%2FPIwRS4bDdIuJ5NHmATUBy9Xm5k0knKoTqhATc7FJjU%0Ar%2BEBvQ%3D%3D|预订|6300000K850S|K85|GZQ|JDG|GZQ|GZG|18:35|01:28|06:53|Y|M758Rh6%2FpjmpXl4kbHpFLQcpWWaOGu1d4EJyRS4VFR3Yerqe45kVMaIABPY%3D|20200808|3|Q6|01|06|1|0||||1|||无||无|无|||||403010W0|4311|1|1||4026400001301720000010100000001010003000||||||1|', 'yXGsjZGI66VgnI3DRcsP2hCQYqkhKgx3BPpuF096JtrDGVaALtvQR2IJTegL76xmH%2F7RXIaKBvMq%0AOB5Om1rxqqHbZxLJG%2FDyLWKD7ul3dLgUL%2FQY5A6NlE%2BmqweEzWWnSy%2BVq0a6s9%2FU%2BUFwaMoR5Ac1%0Ae1QbO28HanENxoMuz%2BWkgcxuzfwfd1nvEBGLRp%2BcS%2Fdffp5K%2B%2Fglwi8YSwoWAz%2FZL8%2FB%2F4kRSw9p%0ALK%2FEqLm%2Fs5woXa2vW6p%2ByXycGYMndegbMwaOp4aD8YEtDsHTFkc7smHSuGxOL%2B%2F4zxH0aZndkKnT%0ASISFGw%3D%3D|预订|630000K2100I|K210|GZQ|NGH|GZQ|GZG|21:03|01:49|04:46|N|mKyHCu3SAc9g4KB5mbZAyGJYiTjG2QKCbwr3RwbVT5Gsty33J9kGbWMlcwE%3D|20200808|3|Q6|01|03|1|0||||无|||无||无|无|||||403010W0|4311|0|1||4021350000301105000010062500001006253000||||||1|', 'Ggy1wfpQAEg7BCZNx9GgVcCTyudxogDkSjc5HsyVj3W935eNpzoI%2BDWqpWzi4t2u%2F1h2ZpbWFpNs%0A2amj220%2BxwW4OAKUFXS%2BnOIS6h7l8FhoGv2kBv6bpJ5r3T1skdt8TSWsd4w%2FZs%2FNY7fKNRuzAiMW%0Aw7dqxC7qsHOMnSxWo5kj5yvHTZ%2F%2B%2BEH97BG3Kvt9Klg5Bj6vdB2v9NtAVMBOy4DLsRz%2FiGUr9oHG%0Aay56529xPfdMCsBPJZzkckgFQuGXaoPAc7RYtjZ69PHVc69OvPQzvUKNCECQWDq1G7cLS5E%3D|预订|65000K166603|K1666|GGQ|NCG|GGQ|GZG|23:00|08:00|09:00|Y|nYrHBr9KbChT2ruc%2BMnrA2YQGEieb9Q2Ae2%2Bg7wpqx1CQdL7|20200808|3|QY|01|04|1|0|||||||无||无|有|||||3010W0|311|1|1||301155000010064500211006453000||||||1|'], 'flag': '1', 'map': { 'GGQ': '广州东', 'GZG': '赣州', 'GZQ': '广州' } }, 'messages': '', 'status': true };
    },
}