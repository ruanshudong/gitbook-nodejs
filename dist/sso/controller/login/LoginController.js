"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginService_1 = __importDefault(require("../../service/login/LoginService"));
const webConf_1 = __importDefault(require("../../../config/webConf"));
const loginConf_1 = __importDefault(require("../../../config/loginConf"));
class logger {
    static error(...args) {
        console.log(...args);
    }
}
class LoginController {
    //登出操作，清理session并跳转
    static async logout(ctx) {
        await ctx.redirect('/');
    }
    //登录接口
    static async login(ctx) {
        const uid = ctx.paramsObj.uid;
        const password = ctx.paramsObj.password;
        const captcha = ctx.paramsObj.captcha;
        const sessionCaptcha = ctx.session.captcha;
        try {
            if (captcha === sessionCaptcha) {
                const rst = await LoginService_1.default.login(uid, password);
                if (rst.errMsg === undefined) {
                    ctx.cookies.set("ticket", rst.ticket);
                    ctx.makeResObj(200, rst.errMsg, { ticket: rst.ticket });
                }
                else {
                    ctx.makeResObj(500, rst.errMsg, {});
                }
            }
            else {
                ctx.makeResObj(500, 'verify code error', {});
            }
        }
        catch (e) {
            logger.error('[login]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }
    //通过ticket取用户信息接口
    static async getUidByTicket(ctx) {
        try {
            const ticket = ctx.paramsObj.ticket;
            const uid = await LoginService_1.default.getUidByTicket(ticket);
            if (uid) {
                ctx.makeResObj(200, '', { uid: uid });
            }
            else {
                ctx.makeResObj(200, '', { uid: '' });
            }
        }
        catch (e) {
            logger.error('[getUidByTicket]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }
    //校验ticket是否可用
    static async isLogin(ctx) {
        const uid = ctx.cookies.get('uid');
        const ticket = ctx.cookies.get('ticket');
        if (uid && ticket) {
            if (await LoginService_1.default.validate(uid, ticket)) {
                ctx.makeResObj(200, '', { login: true });
                return;
            }
        }
        ctx.redirect(loginConf_1.default.loginUrl);
    }
    //校验ticket是否可用
    static async validate(ctx) {
        try {
            const uid = ctx.paramsObj.uid;
            const ticket = ctx.paramsObj.ticket;
            ctx.makeResObj(200, '', { result: await LoginService_1.default.validate(uid, ticket) });
        }
        catch (e) {
            logger.error('[validate]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }
    //注册接口
    static async register(ctx) {
        const uid = ctx.paramsObj.uid;
        const password = ctx.paramsObj.password;
        try {
            const rst = await LoginService_1.default.register(ctx.request.host, uid, password);
            if (rst && rst.errMsg) {
                ctx.makeResObj(500, rst.errMsg, {});
            }
            else {
                ctx.makeResObj(200, '', {});
            }
        }
        catch (e) {
            logger.error('[register]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }
    //forget password
    static async forget(ctx) {
        const uid = ctx.paramsObj.uid;
        try {
            const rst = await LoginService_1.default.forget(ctx.request.host, uid);
            if (rst && rst.errMsg) {
                ctx.makeResObj(500, rst.errMsg, {});
            }
            else {
                ctx.makeResObj(200, '', {});
            }
        }
        catch (e) {
            logger.error('[forget]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }
    //重置密码
    static async resetPass(ctx) {
        const token = ctx.paramsObj.token;
        const password = ctx.paramsObj.password;
        try {
            const rst = await LoginService_1.default.resetPass(token, password);
            if (rst && rst.errMsg) {
                ctx.makeResObj(500, rst.errMsg, {});
            }
            else {
                ctx.makeResObj(200, '', { href: loginConf_1.default.loginUrl });
            }
        }
        catch (e) {
            logger.error('[resetPass]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }
    static async isEnableLogin(ctx) {
        try {
            ctx.makeResObj(200, '', { enableLogin: webConf_1.default.enableLogin || false });
        }
        catch (e) {
            logger.error('[isEnableLogin]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }
    static async getLoginUid(ctx) {
        try {
            ctx.makeResObj(200, '', { uid: ctx.uid || '' });
        }
        catch (e) {
            logger.error('[getLoginUid]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }
    static async modifyPass(ctx) {
        const password = ctx.paramsObj.password;
        const repeatPassword = ctx.paramsObj.repeat_password;
        if (password != repeatPassword) {
            ctx.makeResObj(500, '#pass.passwordDiff#', {});
            return;
        }
        try {
            const uid = ctx.uid || [];
            await LoginService_1.default.modifyPass(uid, password);
            ctx.makeResObj(200, '#pass.modifySucc#', {});
        }
        catch (e) {
            logger.error('[modifyPass]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }
}
exports.default = LoginController;
