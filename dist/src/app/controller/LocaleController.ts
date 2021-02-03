import fs from "fs-extra";
import path from "path";
import Koa from "koa";

const fileNames = fs.readdirSync(path.join(__dirname, "../../locale"));
const locale : any = {};
fileNames.forEach((fileName) => {
    
    import(path.join(__dirname, "../../locale/", fileName)).then((content)=>{
        locale[content.localeCode] = content; 
    });
});
    
export default class LocaleController {

    public static async getLocale(ctx: Koa.Context) {
        ctx.makeResObj(200, "", locale || {});
    }
}
