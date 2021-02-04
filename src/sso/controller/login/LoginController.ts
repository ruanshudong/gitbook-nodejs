import LoginService from '../../service/login/LoginService';
import webConf from '../../../config/webConf';
import * as Koa from "koa";

export default class LoginController {

    private _loginService: LoginService;

    public constructor() {

        this._loginService = new LoginService(webConf.dbConf);
    }

    //登录页面控制，若已经有登录信息，则直接带票据跳转
    public async loginPage(ctx: Koa.Context) {
        let uid = ctx.cookies.get('uid');
        let ticket = ctx.cookies.get('ticket');
        if (uid && ticket) {
            if (await this._loginService.validate(uid, ticket)) {
                ctx.redirect(ctx.paramsObj.redirect_url || '/');
                return;
            }
        }
        await ctx.render('login/login', { redirect_url: ctx.paramsObj.redirect_url || '/' });
    };

    //注册页面控制
    public async registerPage (ctx: Koa.Context) {
        await ctx.render('login/register', { redirect_url: ctx.paramsObj.redirect_url || '/' });
    };

    //登出操作，清理session并跳转
    public async logout (ctx: Koa.Context) {
        await ctx.redirect('/');
    };

    //登录接口
    public async login (ctx: Koa.Context) {

        let uid = ctx.paramsObj.uid;
        let password = ctx.paramsObj.password;
        const captcha = ctx.paramsObj.captcha
        const sessionCaptcha = ctx.session.captcha

        // console.log('login', captcha, sessionCaptcha);

        try {
            if (captcha === sessionCaptcha) {

                let rst = await this._loginService.login(uid, password);
                if (rst.errMsg === undefined) {
                    ctx.makeResObj(200, rst.errMsg, { ticket: rst.ticket });
                } else {
                    ctx.makeResObj(500, rst.errMsg, {});
                }
            } else {
                ctx.makeResObj(500, 'verify code error', {});
            }
        } catch (e) {
            // logger.error('[login]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    };

    //通过ticket取用户信息接口
    public async getUidByTicket (ctx: Koa.Context) {
        try {
            let ticket = ctx.paramsObj.ticket;
            let uid = '';
            if (uid = await this._loginService.getUidByTicket(ticket)) {
                ctx.makeResObj(200, '', { uid: uid });
            } else {
                ctx.makeResObj(200, '', { uid: '' });
            }
        } catch (e) {
            // logger.error('[getUidByTicket]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    };

    //校验ticket是否可用
    public async validate (ctx: Koa.Context) {
        try {
            let uid = ctx.paramsObj.uid;
            let ticket = ctx.paramsObj.ticket;
            ctx.makeResObj(200, '', { result: await this._loginService.validate(uid, ticket) });
        } catch (e) {
            // logger.error('[validate]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    };

    //注册接口
    public async register (ctx: Koa.Context) {
        let uid = ctx.paramsObj.uid;
        let password = ctx.paramsObj.password;
        let repeatPassword = ctx.paramsObj.repeat_password;
        if (password != repeatPassword) {
            ctx.makeResObj(500, '#login.passwordDiff#', {});
            return;
        }
        try {
            let rst = await this._loginService.register(uid, password);
            if (rst && rst.errMsg) {
                ctx.makeResObj(500, rst.errMsg, {});
            } else {
                ctx.makeResObj(200, '', {});
            }
        } catch (e) {
            // logger.error('[register]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    };

    public async isEnableLogin (ctx: Koa.Context) {
        try {
            ctx.makeResObj(200, '', { enableLogin: webConf.enableLogin || false });
        } catch (e) {
            // logger.error('[isEnableLogin]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    };

    public async getLoginUid (ctx: Koa.Context) {
        try {
            ctx.makeResObj(200, '', { uid: ctx.uid || '' });
        } catch (e) {
            // logger.error('[getLoginUid]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }
    };


    public async modifyPass (ctx: Koa.Context) {
        let password = ctx.paramsObj.password;
        let repeatPassword = ctx.paramsObj.repeat_password;
        if (password != repeatPassword) {
            ctx.makeResObj(500, '#pass.passwordDiff#', {});
            return;
        }

        try {
            let uid = ctx.uid || [];
            await this._loginService.modifyPass(uid, password);

            // if (rst && rst.errMsg) {
            //     ctx.makeResObj(500, rst.errMsg, {});
            // } else {
            ctx.makeResObj(200, '#pass.modifySucc#', {});
            // }
        } catch (e) {
            // logger.error('[modifyPass]', e.body ? e.body.message : e, ctx);
            ctx.makeResObj(500, e.body ? e.body.message : e);
        }

    }; 

}

