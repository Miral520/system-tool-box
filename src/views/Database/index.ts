import mysql from 'mysql';
import moment from 'moment';
import 'moment/locale/zh-cn';

declare var eStore: any;
declare var global: any;

export default {
    name: 'database',
    data() {
        return {
            // 登录信息
            login: {
                title: {
                    label: '数据库登录',
                    icon: 'database',
                    theme: 'filled',
                },
                props: {
                    layout: 'horizontal',
                    labelCol: {
                        span: 4,
                    },
                    wrapperCol: {
                        span: 19,
                        offset: 1,
                    },
                },
                value: {
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: '',
                    port: 3306,
                    localAddress: '',
                    charset: 'UTF8_GENERAL_CI',
                    connectTimeout: 10000,
                    stringifyObjects: false,
                    insecureAuth: false,
                    queryFormat: '',
                    supportBigNumbers: false,
                },
                label: {
                    host: {
                        label: '主机名',
                        type: 'input',
                        props: {
                            placeholder: '您要连接的数据库的主机名',
                        },
                    },
                    user: {
                        label: '用户名',
                        type: 'input',
                        props: {
                            placeholder: '要作为身份验证的MySQL用户',
                        },
                    },
                    password: {
                        label: '密码',
                        type: 'input-password',
                        props: {
                            placeholder: '该MySQL用户的密码',
                        },
                    },
                    database: {
                        label: '数据库名称',
                        type: 'input',
                        props: {
                            placeholder: '用于此连接的数据库的名称',
                        },
                    },
                    port: {
                        label: '端口号',
                        type: 'input',
                        props: {
                            placeholder: '要连接的端口号',
                        },
                    },
                    localAddress: {
                        label: 'TCP地址',
                        type: 'input',
                        props: {
                            placeholder: '用于TCP连接的源IP地址',
                        },
                    },
                    charset: {
                        label: '字符集',
                        type: 'input',
                        props: {
                            placeholder: '这在MySQL的SQL级别如utf8_general_ci中称为排序规则',
                        },
                    },
                    connectTimeout: {
                        label: '超时',
                        type: 'input',
                        props: {
                            placeholder: '与MySQL服务器的初始连接期间发生超时之前的毫秒数',
                        },
                    },
                    stringifyObjects: {
                        label: '字符串化',
                        type: 'switch',
                        props: {
                            placeholder: '将对象字符串化，而不是转换为值',
                        },
                    },
                    insecureAuth: {
                        label: '旧验证方法',
                        type: 'switch',
                        props: {
                            placeholder: '允许连接到要求使用旧的（不安全的）身份验证方法的MySQL实例',
                        },
                    },
                    queryFormat: {
                        label: '自定义查询',
                        type: 'input',
                        props: {
                            placeholder: '自定义查询格式功能',
                        },
                    },
                    supportBigNumbers: {
                        label: '大数支持',
                        type: 'switch',
                        props: {
                            placeholder: '在处理数据库中的大数BIGINT和DECIMAL列时应启用',
                        },
                    },
                },
            },

            // 连接实例
            connection: null,

            // 命令执行记录
            records: [],

            // 更多
            more: false,
        }
    },
    methods: {
        // 初始化
        init() {

        },

        // 登录框更多
        loginMoreOpts() {
            (<any>this).more = !(<any>this).more;
            (<any>this).$nextTick(() => {
                (<any>this).$refs.loginScrollBar.refresh();
            });
        },

        // 创建连接
        createConnection() {
            // (<any>this).closeConnection();
            (<any>this).connection = mysql.createConnection((<any>this).login.value);
            (<any>this).connection.connect((err: any) => {
                if (err) {
                    console.log('error: ' + err);
                    return false;
                  }
                  console.log('Connected to the MySQL server.');                
            });
        },

        // 关闭连接
        closeConnection() {
            if((<any>this).connection && (<any>this).connection.end) {
                (<any>this).connection.end((err: any) => {
                    console.log(err);
                });
            }
        },

        // 终止连接
        destroyConnection() {
            if((<any>this).connection && (<any>this).connection.destroy) {
                (<any>this).connection.destroy();
            }
        },

        // 操作数据库
        queryBase(cmd: string, callback: Function) {
            (<any>this).connection.query(cmd, (error: any, results: any, fields: any) => {
                if (error) {
                    console.log(error);
                    return false;
                };
                if(callback) {
                    callback(results, fields);
                }
            });
        },

        // 登录数据库
        handleLogin() {
            (<any>this).createConnection();
        },
    },
    created() {
        
    },
}