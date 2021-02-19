import * as Koa from "koa";
// import { logger } from "../app/logger";
import LoginService from "../sso/service/login/LoginService";

/**
 * 登录配置
 */
const loginConf = {
    redirectUrlParamName: "redirect_url",    //跳转到登录url的时带的原url参数名，如：***/login?service=***，默认是service
    loginUrl:"/sso.html#/login",
    logoutUrl: "",
    logoutredirectUrlParamName: "url",
    cookieDomain: "",              //cookie值对应的域
    getUidByTicket: getUidByTicket,         //通过ticket从cas服务端校验和获取用户基本信息的url,或获取用户基本信息的方法
    validate: validate,                     //通过token和用户名到cas服务端校验key和用户名是否匹配的url或方法
    validateMatch: [
        ["data.result", true]
    ],                                  //校验通过匹配条件，可以从多层结果，多个情况
    ignore: ['/static', '/pages/api/get_locale', '/sso.html', '/pages/sso'],           //不需要登录校验的路径
    apiPrefix: ["/pages/api"],          //接口相应的路径前缀，这类接口访问不直接跳转到登录界面，而只是提示未登录
    apiNotLoginMes: "common.noLogin",   //接口无登录权限的提示语
};

/**
 * 由用户直接定制通过ticket获取用户信息的方法
 * @param ctx
 */
async function getUidByTicket(ctx: Koa.Context, ticket: string) {
    const userInfo = await LoginService.getUserInfoByTicket(ticket);

    if (userInfo) {
        return userInfo.uid;
    }
    return null;
}

/**
 * 由用户直接定制判断用户名校验方法
 * @param ctx
 */
async function validate(ctx: Koa.Context, ticket: string) {

    if (!ticket) {
        return null;
    }

    const userInfo = await LoginService.getUserInfoByTicket(ticket);

    if (userInfo) { 
        return userInfo.uid;
    }

    return null;
}

export default loginConf;
