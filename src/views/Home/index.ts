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
            return (<any>this).$store.state.sysInfo;
        },
    },
}