"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const webConf = {
    respository: {
        tmpPath: path_1.default.join(__dirname, "../../client/tmp"),
    },
    config: {
        webConf: {
            port: 6080,
            loggerPath: "./log",
            logFileKeepDays: "1",
            defaultLanguage: "cn",
            title: "文档"
        },
        login: {
            enableLogin: false,
            email: {
                smtp: {
                    host: "smtp.exmail.qq.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: "xxxx@xxxx.com",
                        pass: "xxxxx"
                    }
                },
                schema: "http://doc.tarsyun.com",
                ignoreEmail: ["gmail.com"]
            },
            dbConf: {
                database: "db_gitbook",
                host: "127.0.0.1",
                port: "3306",
                user: "root",
                password: "Root@12345",
                charset: "utf8mb4",
                pool: {
                    "max": 10,
                    "min": 0,
                    "idle": 10000
                }
            }
        },
        git: {
            enableGit: false,
            repo: "https://github.com/TarsCloud/TarsDocs",
            path: "./client/markdown",
            interval: 3600000
        },
    }
};
exports.default = webConf;
