"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PageController {
    static async index(ctx) {
        await ctx.redirect("/index.html");
    }
}
exports.default = PageController;
