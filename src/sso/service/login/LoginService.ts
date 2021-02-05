import { LoginDao } from '../../dao/LoginDao';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import webConf from '../../../config/webConf';
let secret = "d2DJ2#)84nD)92%1";

const expireTime : number = 7 * 24 *60 * 60 * 1000;

export default class LoginService {

    private static _loginDao: LoginDao = new LoginDao(webConf.dbConf);

    // public constructor(config: any) {

    //     this._loginDao = new LoginDao(config);
    // }

    //登录操作
    public static async login(uid: string, password: string) {

        let userInfo = await this._loginDao.getUserInfoByUid(uid);

        if (userInfo) {
            //todo
            if (!bcrypt.compareSync(password, userInfo.password)) {
                return { errMsg: '#login.passwordNoCorrect#' };
            }

        } else {
            return { errMsg: '#login.userNoExist#' };
        }

        const ticket = this.signWebIDToken({ uid: uid }, expireTime);

        return { ticket: ticket };
    }


    //注册操作
    public static async register(uid: string, password: string, email: string) {
        let userInfo = await this._loginDao.getUserInfoByUid(uid);
        if (userInfo) {
            return { errMsg: '#login.hasExist#' };
        } else {
            await this._loginDao.insertUserInfo(uid, bcrypt.hashSync(password), email);
            return {};
        }
    }

    //注册操作
    public static async modifyPass(uid: string, password: string) {

        await this._loginDao.modifyPass(uid, bcrypt.hashSync(password));
        return {};
    };

    public static async getUidByTicket(ticket: string) {

        let data : any = await this.verifyWebIDToken(ticket);

        return data.uid;
    }

    public static async getUserInfoByTicket(ticket: string) {

        let data: any = await this.verifyWebIDToken(ticket);

        if (data.uid) {
            return await this._loginDao.getUserInfoByUid(data.uid);
        }
        return null;
    }

    public static async validate(pUid: string, pTicket: string) {
        let uid = await this.getUidByTicket(pTicket);
        if (uid && uid === pUid) {
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
        let options = {
            expiresIn: ms(expireTime)
        }
        return jwt.sign(claims, secret, options);
    }

    // 用户请求，验证cookie里的token是否有效
    protected static async verifyWebIDToken(id_token: string) {
        // 解析id_token拿到签名算法和key，并验证该id_token是否有效
        return new Promise(async (resolve, reject) => {
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


// //重启服务的时候，从数据库清理掉已经过期的数据
// LoginServer.removeExpiresTgt = async()=> {
//     return await LoginDao.deleteTgtByExpireTime(new Date());
// };

// //从数据库获取缓存TGT数据
// LoginServer.initLoginTgtCache = async() => {
//     let tgtMap = {};
//     let tgts = await LoginDao.getAllTgt();
//     tgts.forEach((tgt)=> {
//         tgt = tgt.dataValues;
//         tgtMap[tgt.ticket] = {uid: tgt.uid, expireTime: tgt.expire_time};
//     });

//     tgts = await TokenDao.getAllToken();
//     tgts.forEach((tgt)=> {
//         tgt = tgt.dataValues;
//         tgtMap[tgt.ticket] = {uid: tgt.uid, expireTime: tgt.expire_time};
//     });
//     cache.del('tgtMap');
//     cache.put('tgtMap', tgtMap, 1 * 60 * 1000, ()=> {
//         LoginServer.removeExpiresTgt();
//         LoginServer.initLoginTgtCache();
//     });
// };

// LoginServer.getUidByTicket = async(ticket) => {

//     let tgtMap = cache.get('tgtMap') || {};
//     let tgt = tgtMap[ticket];

//     if (!tgt) {
//         let tgtInDb = await LoginDao.getTgtByTicket(ticket);

//         // console.log(tgtInDb);

//         if (tgtInDb) {
//             tgtInDb = tgtInDb.dataValues;
//             tgt = tgtMap[ticket] = {uid: tgtInDb.uid, expireTime: tgtInDb.expire_time};
//         } else {
//             let token = await TokenDao.getToken(ticket);

//             if(token) {
//                 tgt = tgtMap[ticket] = {uid: token.uid, expireTime: token.expire_time}; 
//             }
//         }
//     }
//     if (tgt) {
//         if (new Date().getTime() - new Date(tgt.expire_time).getTime() > 0) {
//             delete tgtMap[ticket];
//             LoginDao.deleteTgt(ticket);
//             return null
//         } else {
//             return tgt.uid;
//         }
//     } else {
//         return null;
//     }
// };


// LoginServer.validate = async(pUid, pTicket) => {
//     let uid = await LoginServer.getUidByTicket(pTicket);
//     if (uid && uid === pUid) {
//         return true;
//     } else {
//         return false;
//     }
// };

// LoginServer.removeExpiresTgt();
// LoginServer.initLoginTgtCache();

// }

// module.exports = LoginServer;