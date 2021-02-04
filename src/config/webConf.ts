
import path from "path";

let webConf = {
    
    webConf: {
        port: 6080,             //服务启动端口
        loggerPath: path.join(__dirname, "../log"),    //本地日志的目录
        logFileKeepDays: "1",         //日志保留时间
        defaultLanguage: "cn",    //cn 或 en ，用户默认的语言环境
        title: 'Tars-Manual',
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
}

export default webConf;