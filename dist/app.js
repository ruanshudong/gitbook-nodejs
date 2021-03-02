"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.app = void 0;
const koa_1 = __importDefault(require("koa"));
const path = __importStar(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_session_1 = __importDefault(require("koa-session"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const git_clone_1 = __importDefault(require("git-clone"));
const TreeController_1 = __importDefault(require("./app/controller/TreeController"));
const LoginService_1 = __importDefault(require("./sso/service/login/LoginService"));
const midware_1 = require("./midware");
const webConf_1 = __importDefault(require("./config/webConf"));
const loginConf_1 = __importDefault(require("./config/loginConf"));
const localeMidware_1 = __importDefault(require("./midware/localeMidware"));
const ssoMidware_1 = __importDefault(require("./midware/ssoMidware"));
const app = new koa_1.default();
exports.app = app;
//信任proxy头部，支持 X-Forwarded-Host
app.proxy = true;
// error handler
// onerror(app);
//验证码
const CONFIG = {
    key: 'koa:sess',
    maxAge: 1000 * 60 * 60 * 12,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
};
app.keys = ['sessionCaptcha'];
app.use(koa_session_1.default(CONFIG, app));
//安全防护
app.use(koa_helmet_1.default());
app.use(koa_bodyparser_1.default());
//国际化多语言中间件
app.use(localeMidware_1.default);
if (webConf_1.default.config.login.enableLogin) {
    app.use(ssoMidware_1.default(loginConf_1.default));
}
app.use(koa_static_1.default(path.join(__dirname, "../client/dist"), { maxage: 7 * 24 * 60 * 60 * 1000 }));
app.use(midware_1.pageRouter.routes());
app.use(midware_1.apiRouter.routes());
app.use(midware_1.ssoRouter.routes());
let cloning = false;
const doClone = async () => {
    try {
        if (cloning) {
            return;
        }
        console.log(`cloneing ${webConf_1.default.config.git.repo} => ${webConf_1.default.config.git.path}`);
        cloning = true;
        await fs_extra_1.default.remove(webConf_1.default.respository.tmpPath);
        git_clone_1.default(webConf_1.default.config.git.repo, webConf_1.default.respository.tmpPath, null, async (e) => {
            if (!e) {
                //clone succ
                if (fs_extra_1.default.existsSync(webConf_1.default.config.git.path)) {
                    fs_extra_1.default.moveSync(webConf_1.default.config.git.path, webConf_1.default.config.git.path + ".bak");
                }
                if (fs_extra_1.default.existsSync(webConf_1.default.respository.tmpPath)) {
                    fs_extra_1.default.moveSync(webConf_1.default.respository.tmpPath, webConf_1.default.config.git.path);
                }
                await fs_extra_1.default.remove(webConf_1.default.respository.tmpPath);
                await fs_extra_1.default.remove(webConf_1.default.config.git.path + ".bak");
                TreeController_1.default.loadTree();
                console.log(`clone succ ${webConf_1.default.config.git.repo} => ${webConf_1.default.config.git.path}`);
            }
            else {
                console.log(`cloneing error: `, e);
            }
            cloning = false;
        });
    }
    catch (e) {
        console.log('error:', e);
    }
};
const initialize = async () => {
    const dbPath = path.join(__dirname, "./config/config.json");
    Object.assign(webConf_1.default.config, JSON.parse(fs_extra_1.default.readFileSync(dbPath, 'utf-8')));
    console.log(webConf_1.default);
    if (webConf_1.default.config.login.enableLogin) {
        LoginService_1.default.initialize();
    }
    TreeController_1.default.initialize();
    TreeController_1.default.loadTree();
    app.use(koa_static_1.default(webConf_1.default.config.git.path, { maxage: 7 * 24 * 60 * 60 * 1000 }));
    if (webConf_1.default.config.git.enableGit) {
        console.log('doClone');
        doClone();
        setInterval(() => {
            console.log('setInterval', webConf_1.default.config.git.interval);
            doClone();
        }, webConf_1.default.config.git.interval);
    }
};
exports.initialize = initialize;
