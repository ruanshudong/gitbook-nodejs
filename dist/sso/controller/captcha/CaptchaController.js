"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const svg_captcha_1 = __importDefault(require("svg-captcha"));
class CaptchaController {
    //登出操作，清理session并跳转
    static async captcha(ctx) {
        const cap = svg_captcha_1.default.createMathExpr({
            size: 4,
            ignoreChars: '0o1i',
            noise: 2,
            color: true,
            background: '#cc9966',
            mathMin: 1,
            mathMax: 9,
        });
        ctx.session.captcha = cap.text.toLocaleLowerCase();
        ctx.set('Content-Type', 'image/svg+xml');
        ctx.body = cap.data;
    }
}
exports.default = CaptchaController;
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
