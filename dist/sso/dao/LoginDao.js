"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDao = void 0;
const db_1 = require("./db");
// import Sequelize from "sequelize";
// const Op = Sequelize.Op;
class LoginDao {
    constructor(config) {
        this._db = new db_1.DbManager(config);
    }
    async checkUserInfo(uid) {
        return await db_1.tUserInfo.findOne({
            where: {
                uid: uid,
            }
        });
    }
    //通过用户名密码获取用户信息
    async getUserInfo(uid, password) {
        return await db_1.tUserInfo.findOne({
            where: {
                uid: uid,
                password: password
            }
        });
    }
    async insertUserInfo(uid, password) {
        return await db_1.tUserInfo.create({
            uid: uid,
            password: password,
            activated: false,
            create_time: new Date(),
            update_time: new Date()
        });
    }
    async getUserInfoByUid(uid) {
        return await db_1.tUserInfo.findOne({
            where: {
                uid: uid
            }
        });
    }
    async modifyPass(uid, password) {
        return await db_1.tUserInfo.update({
            password: password,
            activated: true,
            update_time: new Date()
        }, {
            where: {
                uid: uid
            }
        });
    }
    async activated(uid) {
        return await db_1.tUserInfo.update({
            activated: true,
            update_time: new Date()
        }, {
            where: {
                uid: uid
            }
        });
    }
}
exports.LoginDao = LoginDao;
