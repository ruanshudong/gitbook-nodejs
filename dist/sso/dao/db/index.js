"use strict";
// import _ from "lodash";
// import fs from 'fs-extra';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tUserInfo = exports.DbManager = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const t_user_info_1 = __importDefault(require("./db_gitbook_models/t_user_info"));
exports.tUserInfo = t_user_info_1.default;
class DbManager {
    constructor(config) {
        const s = new sequelize_typescript_1.Sequelize("", config.user, config.password, {
            host: config.host,
            port: config.port,
            dialect: "mysql",
            dialectOptions: {
                charset: config.charset
            },
        });
        s.query(`CREATE DATABASE IF NOT EXISTS ${config.database};`).then(() => {
            // console.log('---------');
            //初始化sequelize
            this._sequelize = new sequelize_typescript_1.Sequelize(config.database, config.user, config.password, {
                host: config.host,
                port: config.port,
                dialect: "mysql",
                dialectOptions: {
                    charset: config.charset
                },
                logging(sqlText) {
                    console.debug(sqlText);
                    // logger.debug(sqlText);
                },
                pool: {
                    max: config.pool.max || 10,
                    min: config.pool.min || 0,
                    idle: config.pool.idle || 10000
                },
                modelPaths: [__dirname + "/" + config.database + "_models"],
                timezone: (() => {
                    const timezone = String(0 - new Date().getTimezoneOffset() / 60);
                    return "+" + (timezone.length < 2 ? ("0" + timezone) : timezone) + ":00";
                })() //获取当前时区并做转换
            });
            this._sequelize.authenticate().then(() => {
                console.log("Connection has been established successfully.");
            });
            this._sequelize.models.tUserInfo.sync({ alter: true });
        });
    }
    get sequelize() {
        return this._sequelize;
    }
}
exports.DbManager = DbManager;
