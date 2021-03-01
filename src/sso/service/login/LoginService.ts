import { LoginDao } from '../../dao/LoginDao';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import webConf from '../../../config/webConf';
import nodemailer from "nodemailer";

const secret = "d2DJ2#)84nD)92%1";

const expireTimeRegister : number = 7 * 24 *60 * 60 * 1000;
const expireTimeForget: number = 1 * 24 * 60 * 60 * 1000;

export default class LoginService {

    private static _loginDao: LoginDao = null; //new LoginDao(webConf.dbConf);

    private static _transporter = null;

    public static async initialize() {

        console.log('LoginService', webConf.config);
        
        this._loginDao = new LoginDao(webConf.config.dbConf);
    }


    //登录操作
    public static async login(uid: string, password: string) {

        const userInfo = await this._loginDao.getUserInfoByUid(uid);

        if (userInfo) {
            if (!userInfo.activated) {
                return { errMsg: '#login.notActivated#' };
            }

            //todo
            if (!bcrypt.compareSync(password, userInfo.password)) {
                return { errMsg: '#login.passwordNoCorrect#' };
            }

        } else {
            return { errMsg: '#login.userNoExist#' };
        }

        const ticket = await this.signWebIDToken({ uid: uid }, expireTimeRegister);

        return { ticket: ticket };
    }

    protected static async sendEmail(uid: string, subject: string, title: string, html: string) {

        if (!this._transporter) {
            this._transporter = await nodemailer.createTransport(webConf.email.smtp);

            const info = await this._transporter.verify();

            console.log('sendmail verify:', info);
        }

        const info = await this._transporter.sendMail({
            from: webConf.email.smtp.auth.user,
            to: [uid],
            subject: subject, 
            text: title, 
            html: html, 
        });
        
        console.log("Message sent: ", info, uid);

    }
    //注册操作
    public static async register(host: string, uid: string, password: string) {

        const userInfo = await this._loginDao.getUserInfoByUid(uid);
        if (userInfo) {
            return { errMsg: '#login.hasExist#' };
        } else {

            await this._loginDao.insertUserInfo(uid, bcrypt.hashSync(password));

            const claims = {
                uid
            }
            const token = await this.signWebIDToken(claims, expireTimeRegister);

            this.sendEmail(uid, "激活账户", "注册", `<a href='${webConf.email.schema}${host}/sso.html#/activated?token=${token}'>点击激活您的账户</a>, 24h小时内有效`);

            return {};
        }
    }

    public static async activated(host: string, token: string) {

        const claims: any = await this.verifyWebIDToken(token);

        if (claims.uid) {

            const userInfo = await this._loginDao.getUserInfoByUid(claims.uid);
            if (!userInfo) {
                return { errMsg: '#login.notExist#' };
            } 

            if (userInfo.activated) {
                return { errMsg: '#login.hasActivated#' };
            }
            
            await this._loginDao.activated(claims.uid);

        } else {
            return { errMsg: '#login.activatedError#' };
        }
    }

    
    //找回密码
    public static async forget(host: string, uid: string) {

        const userInfo = await this._loginDao.getUserInfoByUid(uid);
        if (!userInfo) {
            return { errMsg: '#login.notExist#' };
        } 

        const claims = {
            uid
        }
        const token = await this.signWebIDToken(claims, expireTimeForget);

        this.sendEmail(uid, "找回密码", "找回密码", `<a href='${webConf.email.schema}${host}/sso.html#/resetPass?token=${token}'>点击重置密码</a>, 24h小时内有效`);

        return {};
        
    }
  
    public static async resetPass(token: string, password: string) {

        const claims : any = await this.verifyWebIDToken(token);

        if (claims.uid) {

            await this._loginDao.modifyPass(claims.uid, bcrypt.hashSync(password));

        } else {
            return { errMsg: '#login.resetPassError#' };
        }

        return {};

    }
   
    //注册操作
    public static async modifyPass(uid: string, oldPassword: string, newPassword: string) {

        const userInfo = await this._loginDao.getUserInfoByUid(uid);

        if (!bcrypt.compareSync(oldPassword, userInfo.password)) {
            return { errMsg: '#login.passwordError#' };
        }

        const hash = bcrypt.hashSync(newPassword);

        await this._loginDao.modifyPass(uid, hash);

        return { };
        
    }

    public static async getUidByTicket(ticket: string) {

        const data : any = await this.verifyWebIDToken(ticket);

        return data.uid;
    }

    public static async getUserInfoByTicket(ticket: string) {

        const data: any = await this.verifyWebIDToken(ticket);

        if (data.uid) {
            return await this._loginDao.getUserInfoByUid(data.uid);
        }
        return null;
    }

    public static async validate(pTicket: string) {
        const uid = await this.getUidByTicket(pTicket);
        if (uid) {
            return true;
        } else {
            return false;
        }
    }

    // 登陆成功，签发id_token
    protected static async signWebIDToken(claims: any, expireTime: number) {
        // // 使用claims签名jwt
        if (!claims.uid) {
            return null
        }
        const options = {
            expiresIn: ms(expireTime)
        }
        return jwt.sign(claims, secret, options);
    }

    // 用户请求，验证cookie里的token是否有效
    protected static async verifyWebIDToken(id_token: string) {
        // 解析id_token拿到签名算法和key，并验证该id_token是否有效
        return new Promise( (resolve, reject) => {
            jwt.verify(id_token, secret, function (err: any, claims: any) {
                if (err) {
                    // verify 3种错误：
                    // 0、是否过期(TokenExpiredError)；
                    if (err instanceof jwt.TokenExpiredError) {
                        resolve({ code: -1, uid: null })
                        return
                    }
                    // 1、是否被篡改，是否Web下发(JsonWebTokenError)；
                    if (err instanceof jwt.JsonWebTokenError) {
                        resolve({ code: -2, uid: null })
                        return
                    }
                    // 2、是否已生效(NotBeforeError)
                    if (err instanceof jwt.NotBeforeError) {
                        resolve({ code: -3, uid: null })
                        return
                    }
                }
                // 能解开，表示由web签发，未被篡改，未过期。用户认证通过
                resolve(claims)
            })
        })
    }
}

