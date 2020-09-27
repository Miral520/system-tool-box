// MySQL访问组件
const mysql = require('mysql');

// 创建 Connection类
class Connection {
    constructor() {
        this.target = null;
        this.info = {
            success: true,
            data: null,
        };
    }

    // 创建连接
    createConnection(config) {
        this.target = mysql.createConnection(config);
        return new Promise((resolve, reject) => {
            this.target.connect(err => {
                this.info.success = true;
                this.info.data = 'MySQL服务连接成功';
                if (err) {
                    this.info.success = false;
                    this.info.data = err.message;
                }
                resolve(this.info);              
            });
        });
    }

    // 关闭连接
    closeConnection() {
        return new Promise((resolve, reject) => {
            this.target.end(err => {
                this.info.success = true;
                this.info.data = '关闭连接成功';
                if (err) {
                    this.info.success = false;
                    this.info.data = err.message;
                }
                resolve(this.info);
            });
        });
    }

    // 终止连接
    destroyConnection() {
        return new Promise((resolve, reject) => {
            this.target.destroy();
            this.info.success = true;
            this.info.data = '销毁连接成功';
            resolve(this.info);
        });
    }

    // 操作数据库
    queryBase(cmd) {
        return new Promise((resolve, reject) => {
            this.target.query(cmd, (error, results, fields) => {
                this.info.success = true;
                this.info.data = {
                    results,
                    fields
                };
                if (error) {
                    this.info.success = false;
                    this.info.data = error.message;
                }
                resolve(this.info);
            });
        });
    }
} 

// 创建 Connection类 实例
const db = new Connection();

module.exports = db;