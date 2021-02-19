"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webConf_1 = __importDefault(require("../../config/webConf"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const marked_1 = __importDefault(require("marked"));
const highlight_js_1 = __importDefault(require("highlight.js"));
class ViewController {
    static initialize() {
        marked_1.default.setOptions({
            renderer: new marked_1.default.Renderer(),
            highlight: function (code, language) {
                const validLanguage = highlight_js_1.default.getLanguage(language) ? language : 'plaintext';
                return highlight_js_1.default.highlight(validLanguage, code).value;
            },
            pedantic: false,
            gfm: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });
    }
    static async view(ctx) {
        const defaultPage = 'README.md';
        const prefix = '#';
        const page = decodeURIComponent(ctx.paramsObj.page);
        let subpath;
        const pos = page.indexOf(prefix);
        if (pos != 0) {
            subpath = defaultPage;
        }
        else {
            subpath = page.substring(pos + prefix.length);
        }
        const anchor = subpath.indexOf(prefix);
        if (anchor != -1) {
            subpath = subpath.substring(0, anchor);
        }
        const f = fs_extra_1.default.lstatSync(path_1.default.join(webConf_1.default.respository.path, subpath));
        if (!f.isFile()) {
            subpath = defaultPage;
        }
        const content = fs_extra_1.default.readFileSync(path_1.default.join(webConf_1.default.respository.path, subpath)).toString();
        const html = marked_1.default(content);
        ctx.makeResObj(200, "succ", { data: html });
    }
}
ViewController.initialize();
exports.default = ViewController;
