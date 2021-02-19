"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function NoCacheMidware(ctx, next) {
    if (ctx.set) {
        ctx.set("Surrogate-Control", "no-store");
        ctx.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        ctx.set("Pragma", "no-cache");
        ctx.set("Expires", "0");
    }
    await next();
}
exports.default = NoCacheMidware;
