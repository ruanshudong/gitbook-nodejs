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

        if (webConf.config.login.enableLogin) {
            const ticket = ctx.paramsObj.ticket || ctx.cookies.get('ticket');

            if (ticket) {
                if (await LoginService.validate(ticket)) {
                    ctx.makeResObj(200, '', { login: true });
                    return;
                }
            }
            ctx.makeResObj(200, '', { login: false, href: loginConf.loginUrl });

        } else {
            ctx.makeResObj(200, '', { login: true, href: loginConf.loginUrl });
        }
    }

    //注册接口
    public static async register (ctx: Koa.Context) {
        const uid : string = ctx.paramsObj.uid;
        const password : string = ctx.paramsObj.password;

        for (let i = 0; i < webConf.config.login.email.ignoreEmail.length; i++)
        {
            if (uid.toLowerCase().indexOf(webConf.config.login.email.ignoreEmail[i]) != -1) {
                ctx.makeResObj(500, '#login.ignoreEmail#');

                return;
            } 
        }

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
            ctx.makeResObj(200, '', { enableLogin: webConf.config.login.enableLogin || false });
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
        const oldPassword = ctx.paramsObj.oldPassword;
        const newPassword = ctx.paramsObj.newPassword;

        try {
            const uid = ctx.uid;
            const rst = await LoginService.modifyPass(uid, oldPassword, newPassword);
            if (rst && rst.errMsg) {
                ctx.makeResObj(500, rst.errMsg, {});
            } else {
                ctx.makeResObj(200, '#login.modifySucc#', {});
            }
        } catch (e) {
            logger.error('[modifyPass]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }

    }

}

