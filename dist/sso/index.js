"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssoConf = void 0;
const LoginController_1 = __importDefault(require("./controller/login/LoginController"));
const CaptchaController_1 = __importDefault(require("./controller/captcha/CaptchaController"));
const ssoConf = [
    ['get', '/captcha', CaptchaController_1.default, CaptchaController_1.default.captcha],
    //登录注册接口
    ['post', '/register', LoginController_1.default, LoginController_1.default.register, { uid: 'notEmpty', password: 'notEmpty' }],
    ['post', '/forget', LoginController_1.default, LoginController_1.default.forget, { uid: 'notEmpty' }],
    ['post', '/resetPass', LoginController_1.default, LoginController_1.default.resetPass, { password: 'notEmpty', token: 'notEmpty' }],
    ['post', '/login', LoginController_1.default, LoginController_1.default.login, { uid: 'notEmpty', password: 'notEmpty', captcha: 'notEmpty' }],
    ['post', '/activated', LoginController_1.default, LoginController_1.default.activated, { token: 'notEmpty' }],
    ['get', '/getUidByTicket', LoginController_1.default, LoginController_1.default.getUidByTicket],
    ['get', '/getLoginUid', LoginController_1.default, LoginController_1.default.getLoginUid],
    ['get', '/isLogin', LoginController_1.default, LoginController_1.default.isLogin],
    ['get', '/isEnableLogin', LoginController_1.default, LoginController_1.default.isEnableLogin],
    //需要登录
    ['post', '/modifyPass', LoginController_1.default, LoginController_1.default.modifyPass]
];
exports.ssoConf = ssoConf;
