import LoginController from './controller/login/LoginController';
import { confType } from "../midware/type";

const _controller = new LoginController();

const ssoConf: Array<confType> = [
    //登录注册接口
    ['post', '/register', _controller, _controller.register],
    ['post', '/login', _controller, _controller.login],
    ['get', '/logout', _controller, _controller.logout],
    ['get', '/getUidByTicket', _controller, _controller.getUidByTicket],
    ['get', '/validate', _controller, _controller.validate],
    
    ['get', '/getLoginUid', _controller, _controller.getLoginUid],
    ['get', '/isEnableLogin', _controller, _controller.isEnableLogin],

    // ['post', '/ModifyPass', DemoUserController.adminModifyPass],
    // ['get', '/isAdmin', DemoAuthController.isAdmin],

    // 是否启用LDAP
    // ['get', '/isEnableLdap', DemoLdapController.isEnableLdap],

    //需要登录
    ['post', '/modifyPass', _controller, _controller.modifyPass]
    // ['get', '/getMyAuthList', DemoAuthController.getMyAuthList],

    // //权限相关接口(从tars-web请求过来的, localhost默认开权限)
    // ['get', '/auth/isAdmin', DemoAuthController.isAdmin],
    // ['post', '/auth/addAuth', DemoAuthController.addAuth],
    // ['post', '/auth/deleteAuth', DemoAuthController.deleteAuth],
    // ['post', '/auth/updateAuth', DemoAuthController.updateAuth],
    // ['get', '/auth/getAuthListByUid', DemoAuthController.getAuthListByUid],
    // ['get', '/auth/getAuth', DemoAuthController.getAuth],
    // ['get', '/auth/getAuthListByFlag', DemoAuthController.getAuthListByFlag],

    // ['get', '/auth/getTokenList', DemoTokenController.getTokenList],
    // ['post', '/auth/addToken', DemoTokenController.addToken],
    // ['post', '/auth/deleteToken', DemoTokenController.deleteToken],
    // ['post', '/auth/setTokenValid', DemoTokenController.setTokenValid],

    // //sso的页面请求(必须是admin权限才可以操作, authMiddleware里面限制了)
    // ['get', '/auth/page/getUserIdList', DemoUserController.getUserAuthList],
    // ['get', '/auth/page/getAuthList', DemoAuthController.getAuthList],
    // ['post', '/auth/page/addAuth', DemoAuthController.addAuth],
    // ['post', '/auth/page/pageDeleteAuth', DemoAuthController.pageDeleteAuth],
    // ['post', '/auth/page/addUser', DemoUserController.addUser],
    // ['post', '/auth/page/pageDeleteUser', DemoUserController.pageDeleteUser],

    // ['get', '/auth/page/getSetList', DemoSetController.getSetList],
    // ['post', '/auth/page/updateSet', DemoSetController.updateSet],
    // ['post', '/auth/page/setSetValid', DemoSetController.setSetValid]

];

export { ssoConf };
