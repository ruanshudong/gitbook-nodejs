import LoginController from './controller/login/LoginController';
import CaptchaController from './controller/captcha/CaptchaController';
import { confType } from "../midware/type";

const ssoConf: Array<confType> = [
    ['get', '/captcha', CaptchaController, CaptchaController.captcha],

    //登录注册接口
    ['post', '/register', LoginController, LoginController.register, { uid: 'notEmpty', password: 'notEmpty' }],
    ['post', '/forget', LoginController, LoginController.forget, { uid: 'notEmpty' }],
    ['post', '/resetPass', LoginController, LoginController.resetPass, { password: 'notEmpty', token: 'notEmpty'  }],
    ['post', '/login', LoginController, LoginController.login, { uid: 'notEmpty', password: 'notEmpty', captcha: 'notEmpty' }],
    ['post', '/activated', LoginController, LoginController.activated, { token: 'notEmpty' }],
    
    ['get', '/getUidByTicket', LoginController, LoginController.getUidByTicket],
    
    ['get', '/getLoginUid', LoginController, LoginController.getLoginUid],
    ['get', '/isLogin', LoginController, LoginController.isLogin],
    ['get', '/isEnableLogin', LoginController, LoginController.isEnableLogin],

    //需要登录
    ['post', '/modifyPass', LoginController, LoginController.modifyPass]
];

export { ssoConf };
