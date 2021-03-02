"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { logger } from "../app/logger";
const LoginService_1 = __importDefault(require("../sso/service/login/LoginService"));
/**
 * 登录配置
 */
const loginConf = {
    redirectUrlParamName: "redirect_url",
    loginUrl: "/sso.html#/login",
    logoutUrl: "",
    logoutredirectUrlParamName: "url",
    cookieDomain: "",
    getUidByTicket: getUidByTicket,
    validate: validate,
    validateMatch: [
        ["data.result", true]
    ],
    mustLogin: ['/pages/sso/modifyPass'],
    ignore: ['/static', '/pages/api/get_locale', '/sso.html', '/pages/sso', '/refresh'],
    apiPrefix: ["/pages/api"],
    apiNotLoginMes: "common.noLogin",
};
/**
 * 由用户直接定制通过ticket获取用户信息的方法
 * @param ctx
 */
async function getUidByTicket(ctx, ticket) {
    const userInfo = await LoginService_1.default.getUserInfoByTicket(ticket);
    if (userInfo) {
        return userInfo.uid;
    }
    return null;
}
/**
 * 由用户直接定制判断用户名校验方法
 * @param ctx
 */
async function validate(ctx, ticket) {
    if (!ticket) {
        return null;
    }
    const userInfo = await LoginService_1.default.getUserInfoByTicket(ticket);
    if (userInfo) {
        return userInfo.uid;
    }
    return null;
}
exports.default = loginConf;
