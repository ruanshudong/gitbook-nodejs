import * as Koa from "koa";
import { pageConf, apiConf } from "./routerConf";
import Router from "koa-router";
// import _ from "lodash";

import noCacheMidware from "../midware/noCacheMidware";
import { paramsDealMidware, paramsCheckMidware } from "../midware/paramsMidware";

//获取路由
const getRouter = (prefix: string, router: Router, routerConf: any[]) => {
    routerConf.forEach(function (conf: any) {
        try {
            const [method, url, obj, controller, checkRule, validParams] = conf;

            //前置参数合并校验相关中间件
            router.register(prefix + url, [method], [paramsDealMidware(validParams), paramsCheckMidware(checkRule), noCacheMidware, async (ctx: Koa.Context, next: Koa.Next) => {
                
                await controller.call(obj, ctx);
                await next();
            }]);

            // console.log(v);
        } catch (e) {
            console.log(e);
        }
        
    });
};

//页面类型路由
const pageRouter = new Router();
getRouter("", pageRouter, pageConf);

const apiRouter = new Router();
getRouter("/pages/api", apiRouter, apiConf);

export { pageRouter, apiRouter };