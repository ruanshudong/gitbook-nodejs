import Koa from "koa";
import * as path from "path";
import fs from 'fs-extra';
import bodyparser from "koa-bodyparser";
import staticRouter from "koa-static";
import session from 'koa-session';
import helmet from "koa-helmet";
import clone from 'git-clone';
import TreeController from './app/controller/TreeController';
import LoginService from './sso/service/login/LoginService';
import { pageRouter, apiRouter, ssoRouter } from "./midware";

import webConf from './config/webConf'

import loginConf from "./config/loginConf";

import localeMidware from "./midware/localeMidware";
import ssoMiddleware from "./midware/ssoMidware";

const app = new Koa();

//信任proxy头部，支持 X-Forwarded-Host
app.proxy = true;

// error handler
// onerror(app);


//验证码
const CONFIG = {
    key: 'koa:sess',
    maxAge: 1000 * 60 * 60 * 12, // 12小时, 设置 session 的有效时间，单位毫秒
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
}
app.keys = ['sessionCaptcha']
app.use(session(CONFIG, app))

//安全防护
app.use(helmet());

app.use(bodyparser());

//国际化多语言中间件
app.use(localeMidware);

if (webConf.config.login.enableLogin) {
    app.use(ssoMiddleware(loginConf));
}

app.use(staticRouter(path.join(__dirname, "../client/dist"), { maxage: 7 * 24 * 60 * 60 * 1000 }));

app.use(pageRouter.routes());
app.use(apiRouter.routes());
app.use(ssoRouter.routes());

let cloning = false;

const doClone = async () => {

    try {
        if (cloning) {
            return;
        }

        console.log(`cloneing ${webConf.config.git.repo} => ${webConf.config.git.path}`);
        cloning = true;

        await fs.remove(webConf.respository.tmpPath);

        clone(webConf.config.git.repo, webConf.respository.tmpPath, null, async (e) => {
            if (!e) {
                //clone succ

                if (fs.existsSync(webConf.config.git.path)) {
                    fs.moveSync(webConf.config.git.path, webConf.config.git.path + ".bak");
                }
                if (fs.existsSync(webConf.respository.tmpPath)) {
                    fs.moveSync(webConf.respository.tmpPath, webConf.config.git.path);
                }
                await fs.remove(webConf.respository.tmpPath);
                await fs.remove(webConf.config.git.path + ".bak");

                TreeController.loadTree();

                console.log(`clone succ ${webConf.config.git.repo} => ${webConf.config.git.path}`);
            } else {
                console.log(`cloneing error: `, e);
            }

            cloning = false;
        });
    } catch (e) {
        console.log('error:', e);
    }
}


const initialize = async() => {

    const dbPath = path.join(__dirname, "./config/config.json");

    Object.assign(webConf.config, JSON.parse(fs.readFileSync(dbPath, 'utf-8')));

    console.log(webConf);

    if (webConf.config.login.enableLogin) {
        LoginService.initialize();
    }

    TreeController.initialize();

    TreeController.loadTree();

    app.use(staticRouter(webConf.config.git.path, { maxage: 7 * 24 * 60 * 60 * 1000 }));

    if (webConf.config.git.enableGit) {

        console.log('doClone');
        doClone();

        setInterval(() => {
            console.log('setInterval', webConf.config.git.interval);

            doClone();
        }, webConf.config.git.interval);

    }
}

export {app, initialize};