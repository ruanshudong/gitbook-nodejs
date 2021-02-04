import { DbManager, tUserInfo } from "./db";
// import { Base } from "../User";
import Sequelize from "sequelize";
const Op = Sequelize.Op;

export class LoginDao {

    private _db: DbManager;

    public constructor(config: any) {
        this._db = new DbManager(config);
    }

    public async checkUserInfo(uid: string) {
        return await tUserInfo.findOne({
            where: {
                uid: uid,
            }
        });
    }

    //通过用户名密码获取用户信息
    public async getUserInfo(uid: string, password: string) {
        return await tUserInfo.findOne({
            where: {
                uid: uid,
                password: password
            }
        });
    }

    public async insertUserInfo(uid: string, password: string) {
        // tUserInfo.upsert
        return await tUserInfo.upsert({
            uid: uid,
            password: password,
            create_time: new Date(),
            update_time: new Date()
        });
    }

    public async getUserInfoByUid(uid: string) {
        return await tUserInfo.findOne({
            where: {
                uid: uid
            }
        });
    }

    public async modifyPass(uid: string, password: string) {
        return await tUserInfo.update({
            password: password
        }, {
            where: {
                uid: uid
            }
        });
    };

    

    // public async insertWxUserInfo(openId: string, unionId: string, wxInfo: Base.UserInfo) {

    //     return await tUserInfo.create({
    //         uid: wxInfo.uid,
    //         type: 1,
    //         wx_openid: openId,
    //         wx_unionid: unionId,
    //         nickname: wxInfo.nickname || "",
    //         sex: wxInfo.sex || 1,
    //         headimgurl: wxInfo.headimgurl || "",
    //         language: wxInfo.language || "zh_CN",
    //         city: wxInfo.city || "",
    //         province: wxInfo.province || "",
    //         country: wxInfo.country || "China",
    //         f_create_time: new Date(),
    //         f_update_time: new Date()
    //     });
    // };


    // public async replaceWxUserInfo(openId: string, unionId: string, wxInfo: Base.UserInfo) {

    //     return await tUserInfo.upsert({
    //         uid: wxInfo.uid,
    //         type: 1,
    //         wx_openid: openId,
    //         wx_unionid: unionId,
    //         nickname: wxInfo.nickname || "",
    //         sex: wxInfo.sex || 1,
    //         headimgurl: wxInfo.headimgurl || "",
    //         language: wxInfo.language || "zh_CN",
    //         city: wxInfo.city || "",
    //         province: wxInfo.province || "",
    //         country: wxInfo.country || "China",
    //         f_update_time: new Date()
    //     });
    // };

    // public async getUserInfoByWxUnionId(uid: string) {
    //     return await tUserInfo.findOne({
    //         where: {
    //             wx_unionid: uid
    //         }
    //     });
    // };

    // public async getUserInfoByUid(uid: string) {
    //     return await tUserInfo.findOne({
    //         where: {
    //             uid: uid
    //         }
    //     });
    // };
}

// export default LoginDao ;
// module.exports = LoginDao;