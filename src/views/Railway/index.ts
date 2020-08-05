import moment from 'moment';
import 'moment/locale/zh-cn';

declare var eStore: any;
declare var global: any;

export default {
    name: 'railway',
    data() {
        return {
            filter: {
                from: '',
                to: '',
                date: '',
            },
            // requirePath: 'https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2020-08-05&leftTicketDTO.from_station=GZQ&leftTicketDTO.to_station=SZQ&purpose_codes=ADULT',
        }
    },
    methods: {
        disabledDate(current: any) {
            return current && current < moment().endOf('day');
        },
    },
    created() {
        // (<any>this).$axios.get('/12306/leftTicket/query').then((res: any) => {
        //     console.log(res);
        // });
        // (<any>this).$axios.get('/12306/resources/js/framework/station_name.js').then((res: any) => {
        //     console.log(res);
        // });
    },
}