"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const url_1 = __importDefault(require("url"));
//带ticket参数, 验证, 登录则写cookie
//需要登录的界面, 未登录则跳转到登录界面
//需要验证的api, 验证, 未登录直接返回
function ssoMiddleware(loginConf) {
    const cookieDomainConfig = {
        domain: loginConf.cookieDomain || "",
    };
    const cookieConfig = Object.assign({
        maxAge: 365 * 24 * 60 * 60 * 1000,
    }, cookieDomainConfig);
    return async (ctx, next) => {
        if (ctx.request.path === "/logout") {
            ctx.cookies.set("ticket", "", cookieDomainConfig);
            ctx.cookies.set("uid", "", cookieDomainConfig);
            toLogoutPage(ctx);
        }
        else {
            // if (isInPath(ctx, loginConf.ignore || [])) { 
            //   await next();
            // }
            // else {
            let ticket = "";
            let uid = "";
            const ticketFromQuery = ctx.query["ticket"];
            if (ticketFromQuery) {
                ticket = ticketFromQuery;
                uid = await loginConf.getUidByTicket(ctx, ticket);
                if (uid) {
                    await ctx.cookies.set("ticket", ticket, cookieConfig);
                    await ctx.cookies.set("uid", uid, cookieConfig);
                }
            }
            if (!ticket) {
                ticket = ctx.cookies.get("ticket") || "";
            }
            if (ticket) {
                ctx.uid = await loginConf.validate(ctx, ticket);
            }
            else {
                ctx.uid = null;
            }
            if (ctx.uid) {
                if (ticketFromQuery) {
                    //从页面过来的
                    const urlObj = url_1.default.parse(ctx.request.url, true);
                    delete (urlObj.query["ticket"]);
                    delete (urlObj.search);
                    const redirectUrl = url_1.default.format(urlObj);
                    ctx.redirect(redirectUrl);
                }
                else {
                    //从cookie过来的请求
                    await next();
                }
            }
            else {
                if (isInPath(ctx, loginConf.mustLogin || [])) {
                    ctx.body = { ret_code: 500, err_msg: loginConf.apiNotLoginMes, data: {} };
                }
                else if (isInPath(ctx, loginConf.ignore || [])) {
                    await next();
                }
                else if (isInPath(ctx, loginConf.apiPrefix)) {
                    ctx.body = { ret_code: 500, err_msg: loginConf.apiNotLoginMes, data: {} };
                }
                else {
                    toLoginPage(ctx);
                }
            }
        }
    };
    // 检测是否在path列表中
    function isInPath(ctx, pathList) {
        const pathname = ctx.request.path;
        // console.log(pathname, pathList);
        const index = lodash_1.default.findIndex(pathList, (rule) => {
            if (!rule) {
                return false;
            }
            if (typeof rule === "string") {
                return pathname.indexOf(rule) === 0;
            }
            if (rule instanceof RegExp) {
                return rule.test(pathname);
            }
        });
        return index > -1;
    }
    // 控制跳转到登录页面
    async function toLoginPage(ctx) {
        if (loginConf.loginUrl.indexOf("?") === -1) {
            ctx.redirect(`${loginConf.loginUrl}?${loginConf.redirectUrlParamName}=${encodeURIComponent(`${ctx.protocol}://${ctx.host}${ctx.request.url}`)}`);
        }
        else {
            ctx.redirect(`${loginConf.loginUrl}&${loginConf.redirectUrlParamName}=${encodeURIComponent(`${ctx.protocol}://${ctx.host}${ctx.request.url}`)}`);
        }
    }
    // 控制跳转到登出页面
    async function toLogoutPage(ctx) {
        if (loginConf.logoutUrl) {
            if (loginConf.loginUrl.indexOf("?") === -1) {
                ctx.redirect(`${loginConf.logoutUrl}?${loginConf.logoutredirectUrlParamName}=${encodeURIComponent(`${ctx.protocol}://${ctx.host}`)}`);
            }
            else {
                ctx.redirect(`${loginConf.logoutUrl}&${loginConf.logoutredirectUrlParamName}=${encodeURIComponent(`${ctx.protocol}://${ctx.host}`)}`);
            }
        }
        else {
            ctx.redirect(`/`);
        }
    }
}
exports.default = ssoMiddleware;
