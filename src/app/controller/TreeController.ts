
import * as Koa from "koa";
import webConf from "../../config/webConf";
import path from 'path';
import fs from 'fs-extra';
import marked from 'marked';
import hljs from 'highlight.js';
import {SearchService, DataType} from '../service/SearchService';
class TreeController {

    protected static _id: number = 0;
    protected static _treeData = [];
    protected static _summary = null; 
    protected static _content = new Map();
    protected static _markdown: DataType[];

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

    protected static reset() {
        this._id = 0;
        this._treeData = [];
        this._content = new Map();        
        this._markdown = [] as DataType[];
    }

    protected static getToken(i) {
        const token = i.tokens[0];

        if (token.tokens && token.tokens[0].type == 'link') {
            return token.tokens[0];
        }
        return token;
    }

    protected static parseText(i) {

        const token = this.getToken(i);

        const data = {
            name: token.text,
            href: token.type == 'link' ? token.href : null,
            id: '' + this._id++,
            children: [],
        }

        // console.log(data);

        if (data.href) {
            this._markdown.push({ name: data.name,  href: '#/' + data.href });
        }

        return data;
    }

    public static loadTree() {

        this.reset();

        this. _summary = path.join(webConf.config.path, 'SUMMARY.md');

        if (fs.existsSync(this._summary)) {
            const Summary = fs.readFileSync(this._summary).toString();

            const tokens = marked.lexer(Summary);

            tokens.forEach(i => {

                if (i.type == 'heading') {
                    const item = this.parseText(i);

                    this._treeData.push(item);
                }
                else if (i.type == 'list') {
                    this.parseItem(this._treeData[this._treeData.length - 1], i.items);
                }
            })
        }

        SearchService.load(this._markdown, this.load);
    }

    protected static parseItem(data: any, items: any[]) {

        items.forEach(i => {

            const item = this.parseText(i);

            if (data) {
                if (!data.children) {
                    data.children = [];
                }
                data.children.push(item);
            } else {
                this._treeData.push(item);
            }

            if (i.type == 'list_item') {
                i.tokens.forEach(j => {
                    if (j.type == 'list') {
                        this.parseItem(item, j.items);
                    }
                })
            }
        });
    }

    public static watch() {

        fs.watchFile(this._summary, (curr: fs.Stats, prev: fs.Stats) => {
            this.loadTree();
        })
    }

    public static load(page: string) {
        const defaultPage = 'README.md';
        const prefix = '#';

        let subpath: string;

        let pos: number = page.indexOf(prefix);
        if (pos != 0) {
            subpath = defaultPage;
        } else {
            subpath = page.substring(pos + prefix.length);
        }

        const anchor: number = subpath.indexOf(prefix);
        if (anchor != -1) {
            subpath = subpath.substring(0, anchor);
        }

        const f = fs.lstatSync(path.join(webConf.config.path, subpath));
        if (!f.isFile()) {
            subpath = defaultPage;
        }

        let hrefPath = '/';
        pos = subpath.lastIndexOf('/');
        if (pos != -1) {
            hrefPath = subpath.substring(0, pos);
        }

        // console.log('subpath', subpath);

        const content = fs.readFileSync(path.join(webConf.config.path, subpath)).toString();

        return { content, hrefPath };
    }

    public static getHtml(url: string) {

        let html = '';

        const page: string = url;

        if (this._content.has(page)) {

            html = this._content.get(page);

        } else {

            const { content, hrefPath } = this.load(page);

            // Override function
            const renderer = {
                link(href, title, text) {

                    let out = '';

                    if (href.indexOf('#') == 0) {
                        //锚点
                        out = '<a href="javascript:document.getElementById(\'' + href.substring(1) + '\').scrollIntoView();"';
                    }
                    else if (href.indexOf('http://') == 0 || href.indexOf('https://') == 0) {
                        out = '<a target="_black" href="' + href + '"';
                    }
                    
                    else {
                        href = '/#' + escape(path.join(hrefPath, href));

                        out = '<a href="' + href + '"';
                    }

                    if (title) {
                        out += ' title="' + title + '"';
                    }
                    out += '>' + text + '</a>';
                    return out;
                },

                image(href, title, text) {

                    href = path.join(hrefPath, href);
                    if (href === null) {
                        return text;
                    }

                    let out = '<div class="images" v-viewer><img src="' + href + '" alt="' + text + '"';

                    out += '> </div>';

                    return out;
                }

            };

            marked.use({ renderer });

            html = marked(content);

            this._content.set(page, html);
        }

        return html;
    }

    public static async viewMarkdown(ctx: Koa.Context) {

        // console.log(ctx.request.url);

        ctx.body = this.getHtml('#' + ctx.request.url);
    }

    public static async view(ctx: Koa.Context) {

        const page: string = decodeURIComponent(ctx.paramsObj.page);

        const html = this.getHtml(page);

        ctx.makeResObj(200, "succ", { page: html });
    }

    public static async tree(ctx: Koa.Context) {
        //每次clone的时候解析一次，如果需要本地目录文件每次访问的时候，实时解析，去掉该注释
        ctx.makeResObj(200, "succ", { tree: this._treeData, title: webConf.webConf.title });
    }

    public static async search(ctx: Koa.Context) {

        const query = ctx.paramsObj.query;

        const { queryWords, result } = SearchService.search(query);

        const page = [];

        result.forEach(d => {
            page.push(SearchService.idToFile(d));
        })

        ctx.makeResObj(200, "succ", { page, queryWords });
    }

    public static async refresh(ctx: Koa.Context) {
        await this.loadTree();
        if (ctx) {
            //每次clone的时候解析一次，如果需要本地目录文件每次访问的时候，实时解析，去掉该注释
            ctx.makeResObj(200, "succ");
        }
    }

}

export default TreeController;
