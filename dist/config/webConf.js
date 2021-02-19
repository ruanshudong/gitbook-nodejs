"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const webConf = {
    webConf: {
        port: 6080,
        loggerPath: path_1.default.join(__dirname, "../log"),
        logFileKeepDays: "1",
        defaultLanguage: "cn",
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
        tmpPath: path_1.default.join(__dirname, "../../client/tmp"),
        path: path_1.default.join(__dirname, "../../client/markdown"),
        interval: 3600 * 1000,
        cloneOnStart: true
    }
};
if (process.env.NODE_ENV == 'doc') {
    webConf.respository.repo = 'http://gitlab.whup.com/up-document/docs.git';
    webConf.respository.cloneOnStart = true;
    webConf.webConf.title = '优品科技';
    webConf.dbConf = {
        database: "db_gitbook",
        host: '172.16.8.247',
        port: '3306',
        user: 'tafadmin',
        password: 'tafadmin2017',
        charset: 'utf8mb4',
        pool: {
            max: 10,
            min: 0,
            idle: 10000 // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
        }
    };
}
exports.default = webConf;
