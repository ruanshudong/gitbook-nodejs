import LoginService from '../../service/login/LoginService';
import webConf from '../../../config/webConf';
import * as Koa from "koa";
import loginConf from '../../../config/loginConf';

class logger {
    public static error(...args) {
        console.log(...args);
    }
}
export default class LoginController {

    //登出操作，清理session并跳转
    public static async logout (ctx: Koa.Context) {
        await ctx.redirect('/');
    }

    //登录接口
    public static async login (ctx: Koa.Context) {

        const uid = ctx.paramsObj.uid;
        const password = ctx.paramsObj.password;
        const captcha = ctx.paramsObj.captcha
        const sessionCaptcha = ctx.session.captcha

        try {
            if (captcha === sessionCaptcha) {

                const rst = await LoginService.login(uid, password);
                if (rst.errMsg === undefined) {
                    ctx.cookies.set("ticket", rst.ticket);
                    ctx.makeResObj(200, rst.errMsg, { ticket: rst.ticket });
                } else {
                    ctx.makeResObj(500, rst.errMsg, {});
                }
            } else {
                ctx.makeResObj(500, 'verify code error', {});
            }
        } catch (e) {
            logger.error('[login]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }

    //通过ticket取用户信息接口
    public static async getUidByTicket (ctx: Koa.Context) {
        try {
            const ticket = ctx.paramsObj.ticket;
            const uid = await LoginService.getUidByTicket(ticket);
            if (uid) {
                ctx.makeResObj(200, '', { uid: uid });
            } else {
                ctx.makeResObj(200, '', { uid: '' });
            }
        } catch (e) {
            logger.error('[getUidByTicket]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }

    //校验ticket是否可用
    public static async isLogin(ctx: Koa.Context) {

        const uid = ctx.cookies.get('uid');
        const ticket = ctx.cookies.get('ticket');
        if (uid && ticket) {
            if (await LoginService.validate(uid, ticket)) {
                ctx.makeResObj(200, '', { login: true });
                return;
            }
        }

        ctx.redirect(loginConf.loginUrl);
    }

    //校验ticket是否可用
    public static async validate (ctx: Koa.Context) {
        try {
            const uid = ctx.paramsObj.uid;
            const ticket = ctx.paramsObj.ticket;
            ctx.makeResObj(200, '', { result: await LoginService.validate(uid, ticket) });
        } catch (e) {
            logger.error('[validate]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }

    //注册接口
    public static async register (ctx: Koa.Context) {
        const uid = ctx.paramsObj.uid;
        const password = ctx.paramsObj.password;

        try {
            const rst = await LoginService.register(ctx.request.host, uid, password);

            if (rst && rst.errMsg) {
                ctx.makeResObj(500, rst.errMsg, {});
            } else {
                ctx.makeResObj(200, '', {});
            }
        } catch (e) {
            logger.error('[register]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }

    // activated
    public static async activated(ctx: Koa.Context) {
        const token = ctx.paramsObj.token;

        try {
            const rst = await LoginService.activated(ctx.request.host, token);

            if (rst && rst.errMsg) {
                ctx.makeResObj(500, rst.errMsg, {});
            } else {
                ctx.makeResObj(200, '', { href: loginConf.loginUrl });
            }
        } catch (e) {
            logger.error('[activated]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }
    //forget password
    public static async forget(ctx: Koa.Context) {
        const uid = ctx.paramsObj.uid;

        try {
            const rst = await LoginService.forget(ctx.request.host, uid);

            if (rst && rst.errMsg) {
                ctx.makeResObj(500, rst.errMsg, {});
            } else {
                ctx.makeResObj(200, '', {});
            }
        } catch (e) {
            logger.error('[forget]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }
  
    //重置密码
    public static async resetPass(ctx: Koa.Context) {
        const token = ctx.paramsObj.token;
        const password = ctx.paramsObj.password;

        try {
            const rst = await LoginService.resetPass(token, password);

            if (rst && rst.errMsg) {

                ctx.makeResObj(500, rst.errMsg, {});
            } else {

                ctx.makeResObj(200, '', { href: loginConf.loginUrl});
            }
        } catch (e) {
            logger.error('[resetPass]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }

    
    public static async isEnableLogin (ctx: Koa.Context) {
        try {
            ctx.makeResObj(200, '', { enableLogin: webConf.enableLogin || false });
        } catch (e) {
            logger.error('[isEnableLogin]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }

    public static async getLoginUid (ctx: Koa.Context) {
        try {
            ctx.makeResObj(200, '', { uid: ctx.uid || '' });
        } catch (e) {
            logger.error('[getLoginUid]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    }


    public static async modifyPass (ctx: Koa.Context) {
        const password = ctx.paramsObj.password;
        const repeatPassword = ctx.paramsObj.repeat_password;
        if (password != repeatPassword) {
            ctx.makeResObj(500, '#pass.passwordDiff#', {});
            return;
        }

        try {
            const uid = ctx.uid || [];
            await LoginService.modifyPass(uid, password);

            ctx.makeResObj(200, '#pass.modifySucc#', {});
        } catch (e) {
            logger.error('[modifyPass]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }

    }

}

