// MySQL访问组件
const mysql = require('mysql');

// 创建 Connection类
class Connection {
    constructor() {
        this.target = null;
    }

    // 创建连接
    createConnection(config) {
        this.target = mysql.createConnection(config);
        this.target.connect(err => {
            if (err) {
                console.log('error: ' + err);
                return false;
            }
            console.log('Connected to the MySQL server.');                
        });
    }

    // 关闭连接
    closeConnection() {
        this.target.end(err => {
            console.log(err);
        });
    }

    // 终止连接
    destroyConnection() {
        this.target.destroy();
    }

    // 操作数据库
    queryBase(cmd, callback) {
        this.target.query(cmd, (error, results, fields) => {
            if (error) {
                console.log(error);
                return false;
            };
            if(callback) {
                callback(results, fields);
            }
        });
    }
}

// 创建 Connection类 实例
const db = new Connection();

module.exports = db; 