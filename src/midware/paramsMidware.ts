
import * as Koa from "koa";
import _ from "lodash";
import validator from "validator";

function paramsDealMidware(validParams: any) {

    return async (ctx: Koa.Context, next: Koa.Next) => {

        const params = _.extend(ctx.query || {}, ctx.request.body || {});

        if (validParams && _.isArray(validParams)) {
            ctx.paramsObj = {};
            validParams.forEach(function (v) {
                if (params[v] !== undefined) {
                    ctx.paramsObj[v] = params[v];
                }
            });
        } else {
            ctx.paramsObj = params;
        }

        ctx.makeResObj = (retCode: number, errMsg: string, result: any) => {
            result = result == undefined ? {} : result;
            ctx.body = { data: result, ret_code: retCode, err_msg: errMsg };
        };
        // ctx.makeMsgResObj = (ret: number) => {
        //     ctx.body = { data: {}, ret_code: 500, err_msg: "common.error." + ret };
        // };
        ctx.makeErrResObj = () => {
            ctx.body = { data: {}, ret_code: 500, err_msg: "common.systemError" };
        };
        ctx.makeNotAuthResObj = () => {
            ctx.body = { data: {}, ret_code: 500, err_msg: "common.noPrivilage" };
        };
        await next();
    };
}

function paramsCheckMidware(checkRule: any) {
    return async (ctx: Koa.Context, next: Koa.Next) => {
        const params = ctx.paramsObj === undefined ? ctx.paramsObj : _.extend(ctx.query || {}, ctx.body || {});
        checkRule = checkRule || {};
        let hasError = false;
        _.each(checkRule, (rules: string, paramName: string) => {
            if (rules) {
                const value = params[paramName] != undefined ? params[paramName].toString() : "";
                _.each(rules.split(";"), (rule: string) => {
                    if (rule === "notEmpty" && validator.isEmpty(value)) {
                        hasError = true;
                        ctx.makeResObj(500, paramName + "common.notEmpty");
                        return false;
                    } else if (rule === "number" && !validator.isFloat(value)) {
                        hasError = true;
                        ctx.makeResObj(500, paramName + "common.needNumber");
                        return false;
                    } else if (rule === "array" && (!validator.isJSON(value) || Object.prototype.toString.call(JSON.parse(value)) !== "[object Array]")) {
                        hasError = true;
                        ctx.makeResObj(500, paramName + "common.needArray");
                        return false;
                    } else if (rule === "object" && (!validator.isJSON(value) || Object.prototype.toString.call(JSON.parse(value)) !== "[object Object]")) {
                        hasError = true;
                        ctx.makeResObj(500, paramName + "common.needObject");
                        return false;
                    } else if (rule === "boolean" && !validator.isBoolean(value)) {
                        hasError = true;
                        ctx.makeResObj(500, paramName + "common.needBoolean");
                        return false;
                    }
                });
                if (hasError) {
                    return false;
                }
            }
        });
        if (!hasError) {
            await next();
        }
    }
}

export { paramsDealMidware, paramsCheckMidware };