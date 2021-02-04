
import * as Koa from "koa";
import webConf from "../../config/webConf";
import path from 'path';
import fs from 'fs-extra';
import marked from 'marked';
import hljs from 'highlight.js';

class ViewController {

    public static initialize() {
        marked.setOptions({
            renderer: new marked.Renderer(),
            highlight: function (code: string, language: string) {
                const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
                return hljs.highlight(validLanguage, code).value;
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

    public static async view(ctx: Koa.Context) {

        const defaultPage = 'README.md';
        const prefix = '#';

        const page : string = ctx.paramsObj.page;

        let subpath: string;
        const pos: number = page.indexOf(prefix);
        if (pos != 0) {
            subpath = defaultPage;
        } else {
            subpath = page.substring(pos + prefix.length);
        }

        const anchor: number = subpath.indexOf(prefix);
        if (anchor != -1) {
            subpath = subpath.substring(0, anchor);
        }

        const f = fs.lstatSync(path.join(webConf.respository.path, subpath));
        if (!f.isFile()) {
            subpath = defaultPage;
        }

        const content = fs.readFileSync(path.join(webConf.respository.path, subpath)).toString();

        const html = marked(content);

        ctx.makeResObj(200, "succ", {data: html});
    }
}

ViewController.initialize();

export default ViewController;
