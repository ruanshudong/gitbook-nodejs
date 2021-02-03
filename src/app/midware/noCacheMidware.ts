

import * as Koa from "koa";

export default async function NoCacheMidware (ctx: Koa.Context, next: Koa.Next) {
    if (ctx.set) {
        ctx.set("Surrogate-Control", "no-store");
        ctx.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        ctx.set("Pragma", "no-cache");
        ctx.set("Expires", "0");
    }
    await next();
}
