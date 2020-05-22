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
                dataList: [
                    {
                        name: 'home',
                        label: '首页',
                        to: '/',
                    },
                ],
            },

            // 底部
            footer: {
                show: true,
                text: 'Project ©2020 Created by Miral',
            },
        }
    },
    created() {
        
    },
    methods: {
        
    },
}