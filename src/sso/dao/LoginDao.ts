import { DbManager, tUserInfo } from "./db";
// import Sequelize from "sequelize";
// const Op = Sequelize.Op;
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

        return await tUserInfo.create({
            uid: uid,
            password: password,
            activated: false,
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
            password: password,
            update_time: new Date()
        }, {
            where: {
                uid: uid
            }
        });
    }


    public async activated(uid: string) {
        return await tUserInfo.update({
            activated: true,
            update_time: new Date()
        }, {
            where: {
                uid: uid
            }
        });
    }
}
