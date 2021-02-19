
import * as Koa from "koa";

import * as fs from "fs-extra";

import stream from "stream";
import * as path from "path";
import _ from "lodash";

const localeMap: any = {};

const fileNames = fs.readdirSync(path.join(__dirname, "../locale"));

fileNames.forEach((fileName) => {

    import(path.join(__dirname, "../locale/", fileName)).then((content) => {
        localeMap[content.localeCode] = formatJson(content);
    });
});

function formatJson(localeJson: any) {
    const resultJson: any = {};
    function setValue(localeJson: any, keyPart: string, resultJson: any) {
        // let args = arguments;
        _.each(localeJson, (value: any, key: any) => {
            const newKeyPart = keyPart ? (keyPart + "." + key) : key;
            if (!_.isObject(value)) {
                resultJson["#" + newKeyPart + "#"] = value;
            } else {
                setValue(value, newKeyPart, resultJson);
            }
        });
    }

    setValue(localeJson, "", resultJson);

    return resultJson;
}

export default async function LocaleMidware(ctx: Koa.Context, next: Koa.Next) {
    await next();

    if (ctx.body) {
        const lan = ctx.paramsObj && ctx.paramsObj.__locale || ctx.cookies.get("locale") || "cn";
        let content = "";
        let contentType = "";
        if (_.isString(ctx.body)) {
            content = ctx.body;
            contentType = "string";
        } else if (_.isObject(ctx.body) && !(ctx.body instanceof stream)) {
            content = JSON.stringify(ctx.body);
            contentType = "object";
        } else {
            return;
        }

        const matchList = content.match(/#[a-zA-Z0-9._]+#/g);

        _.each(matchList, (matchStr: any) => {

            console.log(matchStr);
            const str = localeMap[lan][matchStr];
            if (str) {
                content = content.replace(matchStr, str);
            }
        });
        if (contentType == "object") {
            ctx.body = JSON.parse(content);
        } else {
            ctx.body = content;
        }
    }
}

