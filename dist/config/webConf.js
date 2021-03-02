"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const webConf = {
    // webConf: {
    //     port: 6080,             //服务启动端口
    //     loggerPath: path.join(__dirname, "../log"),    //本地日志的目录
    //     logFileKeepDays: "1",         //日志保留时间
    //     defaultLanguage: "cn",    //cn 或 en ，用户默认的语言环境
    //     title: 'TARS文档',
    // },
    // enableLogin: false,
    // email: {
    //     smtp: {
    //         host: 'smtp.exmail.qq.com',
    //         port: 465,
    //         secure: true,
    //         auth: {
    //             user: 'xxxx@xxxx.com',
    //             pass: 'xxxxx',
    //         }
    //     },
    //     schema: 'http://',
    //     ignoreEmail: ['qq.com', '163.com', 'gmail.com', 'sina.com', 'foxmail.com', 'sohu.com', 'outlook.com', 'tom.com', 'sogou.com', '21cn.com', '189.com', 'yahoo.com', 'aol.com']
    // },
    respository: {
        tmpPath: path_1.default.join(__dirname, "../../client/tmp"),
    },
    config: {
        webConf: null,
        email: null,
        dbConf: null,
        enableLogin: false,
        path: null,
        repo: '',
        interval: 3600 * 1000,
        cloneOnStart: false,
    }
};
exports.default = webConf;
