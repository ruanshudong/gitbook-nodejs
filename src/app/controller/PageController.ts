
import * as Koa from "koa";

export default class PageController {

    public async index(ctx: Koa.Context) {
        await ctx.redirect("/index.html");
    }
}
