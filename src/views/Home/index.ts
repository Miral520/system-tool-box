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
        }
    },
    methods: {
        getToday() {
            let date = new Date();
            return `${date.getFullYear()}`;
        },
    },
}