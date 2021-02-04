

import _ from "lodash";
import { Sequelize, Table, Column, Model } from "sequelize-typescript";

import tUserInfo from "./db_gitbook_models/t_user_info";

class DbManager {

    private _sequelize: Sequelize;

    public get sequelize() {
        return this._sequelize;
    }

    public constructor(config: any) {

        const s = new Sequelize("", config.user, config.password, {
            host: config.host,
            port: config.port,
            dialect: "mysql",
            dialectOptions: {
                charset: config.charset
            },
        });

        s.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`).then(()=> {

            //初始化sequelize
            this._sequelize = new Sequelize(config.database, config.user, config.password, {
                host: config.host,
                port: config.port,
                dialect: "mysql",
                dialectOptions: {
                    charset: config.charset
                },
                logging(sqlText) {
                    // console.debug(sqlText);
                    // logger.debug(sqlText);
                },
                pool: {
                    max: config.pool.max || 10,
                    min: config.pool.min || 0,
                    idle: config.pool.idle || 10000
                },
                modelPaths: [__dirname + "/" + config.database + "_models"],
                timezone: (() => {
                    let timezone = String(0 - new Date().getTimezoneOffset() / 60);
                    return "+" + (timezone.length < 2 ? ("0" + timezone) : timezone) + ":00";
                })()  //获取当前时区并做转换
            });

            this._sequelize.authenticate().then(() => {
                console.log("Connection has been established successfully.");
            });
        })
    }
}

export { DbManager, tUserInfo };

