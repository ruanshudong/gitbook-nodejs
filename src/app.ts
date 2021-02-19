import Koa from "koa";
import * as path from "path";
import fs from 'fs-extra';
import bodyparser from "koa-bodyparser";
import staticRouter from "koa-static";
import session from 'koa-session';
import helmet from "koa-helmet";
import clone from 'git-clone';
import { pageRouter, apiRouter, ssoRouter } from "./midware";

// import { pageRouter, apiRouter } from "./midware";
import webConf from './config/webConf'
import TreeController from './app/controller/TreeController'

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
app.use(ssoMiddleware(loginConf));

app.use(staticRouter(path.join(__dirname, "../client/dist"), { maxage: 7 * 24 * 60 * 60 * 1000 }));
app.use(staticRouter(path.join(__dirname, "../client/markdown"), { maxage: 7 * 24 * 60 * 60 * 1000 }));

app.use(pageRouter.routes());
app.use(apiRouter.routes());
app.use(ssoRouter.routes());

const hostname = process.env.IP || "0.0.0.0";
const port = process.env.PORT || 6080;

app.listen(port as number, hostname, () => {
    console.log(`server listening at ${hostname}:${port}`);
});

let cloning = false;

const doClone = async () => {

    if (cloning) {
        return;
    }

    console.log(`cloneing ${webConf.respository.repo} => ${webConf.respository.path}`);
    cloning = true;

    await fs.remove(webConf.respository.tmpPath);

    clone(webConf.respository.repo, webConf.respository.tmpPath, null, async(e) => {
        if (!e) {
            //clone succ
            fs.moveSync(webConf.respository.path, webConf.respository.path + ".bak");
            fs.moveSync(webConf.respository.tmpPath, webConf.respository.path);
            await fs.remove(webConf.respository.tmpPath);
            await fs.remove(webConf.respository.path + ".bak");

            TreeController.loadTree();

            console.log(`cloneing ${webConf.respository.repo} => ${webConf.respository.path} succ`);
        } else {
            console.log(`cloneing error: `, e);
        }

        cloning = false;
    });
}

if (webConf.respository.cloneOnStart) {
    doClone();
}

setInterval(() => {
    console.log('setInterval', webConf.respository.interval);

    doClone();
}, webConf.respository.interval);

