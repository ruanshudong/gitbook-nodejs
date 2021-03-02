"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginDao_1 = require("../../dao/LoginDao");
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ms_1 = __importDefault(require("ms"));
const webConf_1 = __importDefault(require("../../../config/webConf"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const secret = "d2DJ2#)84nD)92%1";
const expireTimeRegister = 7 * 24 * 60 * 60 * 1000;
const expireTimeForget = 1 * 24 * 60 * 60 * 1000;
class LoginService {
    static async initialize() {
        this._loginDao = new LoginDao_1.LoginDao(webConf_1.default.config.login.dbConf);
    }
    //登录操作
    static async login(uid, password) {
        const userInfo = await this._loginDao.getUserInfoByUid(uid);
        if (userInfo) {
            if (!userInfo.activated) {
                return { errMsg: '#login.notActivated#' };
            }
            //todo
            if (!bcrypt_nodejs_1.default.compareSync(password, userInfo.password)) {
                return { errMsg: '#login.passwordNoCorrect#' };
            }
        }
        else {
            return { errMsg: '#login.userNoExist#' };
        }
        const ticket = await this.signWebIDToken({ uid: uid }, expireTimeRegister);
        return { ticket: ticket };
    }
    static async sendEmail(uid, subject, title, html) {
        if (!this._transporter) {
            this._transporter = await nodemailer_1.default.createTransport(webConf_1.default.config.login.email.smtp);
            const info = await this._transporter.verify();
            console.log('sendmail verify:', info);
        }
        const info = await this._transporter.sendMail({
            from: webConf_1.default.config.login.email.smtp.auth.user,
            to: [uid],
            subject: subject,
            text: title,
            html: html,
        });
        console.log("Message sent: ", info, uid);
    }
    //注册操作
    static async register(host, uid, password) {
        const userInfo = await this._loginDao.getUserInfoByUid(uid);
        if (userInfo) {
            return { errMsg: '#login.hasExist#' };
        }
        else {
            await this._loginDao.insertUserInfo(uid, bcrypt_nodejs_1.default.hashSync(password));
            const claims = {
                uid
            };
            const token = await this.signWebIDToken(claims, expireTimeRegister);
            this.sendEmail(uid, "激活账户", "注册", `<a href='${webConf_1.default.config.login.email.schema}${host}/sso.html#/activated?token=${token}'>点击激活您的账户</a>, 24h小时内有效`);
            return {};
        }
    }
    static async activated(host, token) {
        const claims = await this.verifyWebIDToken(token);
        if (claims.uid) {
            const userInfo = await this._loginDao.getUserInfoByUid(claims.uid);
            if (!userInfo) {
                return { errMsg: '#login.notExist#' };
            }
            if (userInfo.activated) {
                return { errMsg: '#login.hasActivated#' };
            }
            await this._loginDao.activated(claims.uid);
        }
        else {
            return { errMsg: '#login.activatedError#' };
        }
    }
    //找回密码
    static async forget(host, uid) {
        const userInfo = await this._loginDao.getUserInfoByUid(uid);
        if (!userInfo) {
            return { errMsg: '#login.notExist#' };
        }
        const claims = {
            uid
        };
        const token = await this.signWebIDToken(claims, expireTimeForget);
        this.sendEmail(uid, "找回密码", "找回密码", `<a href='${webConf_1.default.config.login.email.schema}/sso.html#/resetPass?token=${token}'>点击重置密码</a>, 24h小时内有效`);
        return {};
    }
    static async resetPass(token, password) {
        const claims = await this.verifyWebIDToken(token);
        if (claims.uid) {
            await this._loginDao.modifyPass(claims.uid, bcrypt_nodejs_1.default.hashSync(password));
        }
        else {
            return { errMsg: '#login.resetPassError#' };
        }
        return {};
    }
    //注册操作
    static async modifyPass(uid, oldPassword, newPassword) {
        const userInfo = await this._loginDao.getUserInfoByUid(uid);
        if (!bcrypt_nodejs_1.default.compareSync(oldPassword, userInfo.password)) {
            return { errMsg: '#login.passwordError#' };
        }
        const hash = bcrypt_nodejs_1.default.hashSync(newPassword);
        await this._loginDao.modifyPass(uid, hash);
        return {};
    }
    static async getUidByTicket(ticket) {
        const data = await this.verifyWebIDToken(ticket);
        return data.uid;
    }
    static async getUserInfoByTicket(ticket) {
        const data = await this.verifyWebIDToken(ticket);
        if (data.uid) {
            return await this._loginDao.getUserInfoByUid(data.uid);
        }
        return null;
    }
    static async validate(pTicket) {
        const uid = await this.getUidByTicket(pTicket);
        if (uid) {
            return true;
        }
        else {
            return false;
        }
    }
    // 登陆成功，签发id_token
    static async signWebIDToken(claims, expireTime) {
        // // 使用claims签名jwt
        if (!claims.uid) {
            return null;
        }
        const options = {
            expiresIn: ms_1.default(expireTime)
        };
        return jsonwebtoken_1.default.sign(claims, secret, options);
    }
    // 用户请求，验证cookie里的token是否有效
    static async verifyWebIDToken(id_token) {
        // 解析id_token拿到签名算法和key，并验证该id_token是否有效
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(id_token, secret, function (err, claims) {
                if (err) {
                    // verify 3种错误：
                    // 0、是否过期(TokenExpiredError)；
                    if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                        resolve({ code: -1, uid: null });
                        return;
                    }
                    // 1、是否被篡改，是否Web下发(JsonWebTokenError)；
                    if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                        resolve({ code: -2, uid: null });
                        return;
                    }
                    // 2、是否已生效(NotBeforeError)
                    if (err instanceof jsonwebtoken_1.default.NotBeforeError) {
                        resolve({ code: -3, uid: null });
                        return;
                    }
                }
                // 能解开，表示由web签发，未被篡改，未过期。用户认证通过
                resolve(claims);
            });
        });
    }
}
exports.default = LoginService;
LoginService._loginDao = null; //new LoginDao(webConf.dbConf);
LoginService._transporter = null;
