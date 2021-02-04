"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var webConf = {
    webConf: {
        port: 6080,
        loggerPath: path_1.default.join(__dirname, "../log"),
        logFileKeepDays: "1",
        defaultLanguage: "cn",
        title: 'Tars-Manual',
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
    webConf.respository.cloneOnStart = false;
    webConf.webConf.title = '优品科技';
}
exports.default = webConf;
