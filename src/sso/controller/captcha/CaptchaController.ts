import captcha from 'svg-captcha';
import * as Koa from "koa";

export default class CaptchaController {

    //登出操作，清理session并跳转
    public static async captcha(ctx: Koa.Context) {
        const cap = captcha.createMathExpr({
            size: 4, // 验证码长度
            ignoreChars: '0o1i', // 验证码字符中排除 0o1i
            noise: 2, // 干扰线条的数量
            color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
            background: '#cc9966', // 验证码图片背景颜色
            mathMin: 1,
            mathMax: 9,
        })
        ctx.session.captcha = cap.text.toLocaleLowerCase();
        console.log("ctx.session:" + JSON.stringify(ctx.session, null, 4));
        ctx.set('Content-Type', 'image/svg+xml')
        ctx.body = cap.data
    }
}

// CaptchaController.captcha = async (ctx) => {
// 	const cap = captcha.createMathExpr({
//         size: 4, // 验证码长度
//         ignoreChars: '0o1i', // 验证码字符中排除 0o1i
//         noise: 2, // 干扰线条的数量
//         color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
//         background: '#cc9966', // 验证码图片背景颜色
//         mathMin: 1,
//         mathMax: 9,
//     })
//     ctx.session.captcha = cap.text.toLocaleLowerCase();
//     console.log("ctx.session:" + JSON.stringify(ctx.session, null, 4));
// 	ctx.set('Content-Type', 'image/svg+xml')
//     ctx.body = cap.data
// }

// module.exports = PageController;
