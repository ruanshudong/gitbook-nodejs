"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsCheckMidware = exports.paramsDealMidware = void 0;
const lodash_1 = __importDefault(require("lodash"));
const validator_1 = __importDefault(require("validator"));
function paramsDealMidware(validParams) {
    return async (ctx, next) => {
        const params = lodash_1.default.extend(ctx.query || {}, ctx.request.body || {});
        if (validParams && lodash_1.default.isArray(validParams)) {
            ctx.paramsObj = {};
            validParams.forEach(function (v) {
                if (params[v] !== undefined) {
                    ctx.paramsObj[v] = params[v];
                }
            });
        }
        else {
            ctx.paramsObj = params;
        }
        ctx.makeResObj = (retCode, errMsg, result) => {
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
exports.paramsDealMidware = paramsDealMidware;
function paramsCheckMidware(checkRule) {
    return async (ctx, next) => {
        const params = ctx.paramsObj === undefined ? ctx.paramsObj : lodash_1.default.extend(ctx.query || {}, ctx.body || {});
        checkRule = checkRule || {};
        let hasError = false;
        lodash_1.default.each(checkRule, (rules, paramName) => {
            if (rules) {
                const value = params[paramName] != undefined ? params[paramName].toString() : "";
                lodash_1.default.each(rules.split(";"), (rule) => {
                    if (rule === "notEmpty" && validator_1.default.isEmpty(value)) {
                        hasError = true;
                        ctx.makeResObj(500, paramName + "common.notEmpty");
                        return false;
                    }
                    else if (rule === "number" && !validator_1.default.isFloat(value)) {
                        hasError = true;
                        ctx.makeResObj(500, paramName + "common.needNumber");
                        return false;
                    }
                    else if (rule === "array" && (!validator_1.default.isJSON(value) || Object.prototype.toString.call(JSON.parse(value)) !== "[object Array]")) {
                        hasError = true;
                        ctx.makeResObj(500, paramName + "common.needArray");
                        return false;
                    }
                    else if (rule === "object" && (!validator_1.default.isJSON(value) || Object.prototype.toString.call(JSON.parse(value)) !== "[object Object]")) {
                        hasError = true;
                        ctx.makeResObj(500, paramName + "common.needObject");
                        return false;
                    }
                    else if (rule === "boolean" && !validator_1.default.isBoolean(value)) {
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
    };
}
exports.paramsCheckMidware = paramsCheckMidware;
