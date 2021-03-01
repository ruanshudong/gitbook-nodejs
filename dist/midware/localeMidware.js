"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const stream_1 = __importDefault(require("stream"));
const path = __importStar(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const localeMap = {};
const fileNames = fs.readdirSync(path.join(__dirname, "../locale"));
fileNames.forEach((fileName) => {
    Promise.resolve().then(() => __importStar(require(path.join(__dirname, "../locale/", fileName)))).then((content) => {
        localeMap[content.localeCode] = formatJson(content);
    });
});
function formatJson(localeJson) {
    const resultJson = {};
    function setValue(localeJson, keyPart, resultJson) {
        // let args = arguments;
        lodash_1.default.each(localeJson, (value, key) => {
            const newKeyPart = keyPart ? (keyPart + "." + key) : key;
            if (!lodash_1.default.isObject(value)) {
                resultJson["#" + newKeyPart + "#"] = value;
            }
            else {
                setValue(value, newKeyPart, resultJson);
            }
        });
    }
    setValue(localeJson, "", resultJson);
    return resultJson;
}
async function LocaleMidware(ctx, next) {
    await next();
    if (ctx.body) {
        const lan = ctx.paramsObj && ctx.paramsObj.__locale || ctx.cookies.get("locale") || "cn";
        let content = "";
        let contentType = "";
        if (lodash_1.default.isString(ctx.body)) {
            content = ctx.body;
            contentType = "string";
        }
        else if (lodash_1.default.isObject(ctx.body) && !(ctx.body instanceof stream_1.default)) {
            content = JSON.stringify(ctx.body);
            contentType = "object";
        }
        else {
            return;
        }
        const matchList = content.match(/#[a-zA-Z0-9._]+#/g);
        lodash_1.default.each(matchList, (matchStr) => {
            console.log(matchStr);
            const str = localeMap[lan][matchStr];
            if (str) {
                content = content.replace(matchStr, str);
            }
        });
        if (contentType == "object") {
            ctx.body = JSON.parse(content);
        }
        else {
            ctx.body = content;
        }
    }
}
exports.default = LocaleMidware;
