
import path from "path";

const webConf = {
    
    webConf: {
        port: 6080,             //服务启动端口
        loggerPath: path.join(__dirname, "../log"),    //本地日志的目录
        logFileKeepDays: "1",         //日志保留时间
        defaultLanguage: "cn",    //cn 或 en ，用户默认的语言环境
        title: 'Manual',
    },
    enableLogin: false,
    email: {
        smtp: {
            host: 'smtp.exmail.qq.com',
            port: 465,
            secure: true,
            auth: {
                user: 'jarodruan@upchina.com',
                pass: 'Lucky8066',
            }
        },
        schema: 'http://'
    },
    dbConf: {
        database: "db_gitbook",
        host: "127.0.0.1",
        port: "3306",
        user: "root",
        password: "12345",
        charset: "utf8mb4",
        pool: {
            max: 10,
            min: 0,
            idle: 10000
        }
    },
    respository: {
        repo: 'https://github.com/TarsCloud/TarsDocs',
        tmpPath: path.join(__dirname, "../../client/tmp"),   
        path: path.join(__dirname, "../../client/markdown"),
        interval: 3600 * 1000,
        cloneOnStart: true
    }
};

if (process.env.NODE_ENV == 'doc') {
    webConf.respository.repo = 'http://gitlab.whup.com/up-document/docs.git';
    webConf.respository.cloneOnStart = false;
    webConf.webConf.title = '优品科技';

    webConf.dbConf = {
        database: "db_gitbook",
        host: '172.16.8.247', // 数据库地址
        port: '3306', // 数据库端口
        user: 'tafadmin', // 用户名
        password: 'tafadmin2017', // 密码
        charset: 'utf8mb4', // 数据库编码
        pool: {
            max: 10, // 连接池中最大连接数量
            min: 0, // 连接池中最小连接数量
            idle: 10000 // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
        }
    };
}

export default webConf;