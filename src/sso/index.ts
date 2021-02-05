import LoginController from './controller/login/LoginController';
import { confType } from "../midware/type";

// const LoginController = new LoginController();

const ssoConf: Array<confType> = [
    //登录注册接口
    ['post', '/register', LoginController, LoginController.register],
    ['post', '/login', LoginController, LoginController.login],
    ['get', '/logout', LoginController, LoginController.logout],
    ['get', '/getUidByTicket', LoginController, LoginController.getUidByTicket],
    ['get', '/validate', LoginController, LoginController.validate],
    
    ['get', '/getLoginUid', LoginController, LoginController.getLoginUid],
    ['get', '/isLogin', LoginController, LoginController.isLogin],
    ['get', '/isEnableLogin', LoginController, LoginController.isEnableLogin],

    // ['post', '/ModifyPass', DemoUserController.adminModifyPass],
    // ['get', '/isAdmin', DemoAuthController.isAdmin],

    // 是否启用LDAP
    // ['get', '/isEnableLdap', DemoLdapController.isEnableLdap],

    //需要登录
    ['post', '/modifyPass', LoginController, LoginController.modifyPass]
];

export { ssoConf };
