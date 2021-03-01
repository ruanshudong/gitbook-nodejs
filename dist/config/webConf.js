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
        title: '优品科技文档',
    },
    enableLogin: false,
    email: {
        smtp: {
            host: 'smtp.exmail.qq.com',
            port: 465,
            secure: true,
            auth: {
                user: 'xxxx@xxxx.com',
                pass: 'xxxxx',
            }
        },
        schema: 'http://',
        ignoreEmail: ['qq.com', '163.com', 'gmail.com', 'sina.com', 'foxmail.com', 'sohu.com', 'outlook.com', 'tom.com', 'sogou.com', '21cn.com', '189.com', 'yahoo.com', 'aol.com']
    },
    respository: {
        tmpPath: path_1.default.join(__dirname, "../../client/tmp"),
    },
    config: {
        dbConf: null,
        path: null,
        repo: '',
        interval: 3600 * 1000,
        cloneOnStart: false,
    }
};
exports.default = webConf;
