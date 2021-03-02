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
const SearchService_1 = require("../service/SearchService");
class TreeController {
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
    static reset() {
        this._id = 0;
        this._treeData = [];
        this._content = new Map();
        this._markdown = [];
    }
    static getToken(i) {
        const token = i.tokens[0];
        if (token.tokens && token.tokens[0].type == 'link') {
            return token.tokens[0];
        }
        return token;
    }
    static parseText(i) {
        const token = this.getToken(i);
        const data = {
            name: token.text,
            href: token.type == 'link' ? token.href : null,
            id: '' + this._id++,
            children: [],
        };
        // console.log(data);
        if (data.href) {
            this._markdown.push({ name: data.name, href: '#/' + data.href });
        }
        return data;
    }
    static loadTree() {
        this.reset();
        this._summary = path_1.default.join(webConf_1.default.config.git.path, 'SUMMARY.md');
        if (fs_extra_1.default.existsSync(this._summary)) {
            const Summary = fs_extra_1.default.readFileSync(this._summary).toString();
            const tokens = marked_1.default.lexer(Summary);
            tokens.forEach(i => {
                if (i.type == 'heading') {
                    const item = this.parseText(i);
                    this._treeData.push(item);
                }
                else if (i.type == 'list') {
                    this.parseItem(this._treeData[this._treeData.length - 1], i.items);
                }
            });
        }
        SearchService_1.SearchService.load(this._markdown, this.load);
    }
    static parseItem(data, items) {
        items.forEach(i => {
            const item = this.parseText(i);
            if (data) {
                if (!data.children) {
                    data.children = [];
                }
                data.children.push(item);
            }
            else {
                this._treeData.push(item);
            }
            if (i.type == 'list_item') {
                i.tokens.forEach(j => {
                    if (j.type == 'list') {
                        this.parseItem(item, j.items);
                    }
                });
            }
        });
    }
    static watch() {
        fs_extra_1.default.watchFile(this._summary, (curr, prev) => {
            this.loadTree();
        });
    }
    static load(page) {
        const defaultPage = 'README.md';
        const prefix = '#';
        let subpath;
        let pos = page.indexOf(prefix);
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
        const f = fs_extra_1.default.lstatSync(path_1.default.join(webConf_1.default.config.git.path, subpath));
        if (!f.isFile()) {
            subpath = defaultPage;
        }
        let hrefPath = '/';
        pos = subpath.lastIndexOf('/');
        if (pos != -1) {
            hrefPath = subpath.substring(0, pos);
        }
        // console.log('subpath', subpath);
        const content = fs_extra_1.default.readFileSync(path_1.default.join(webConf_1.default.config.git.path, subpath)).toString();
        return { content, hrefPath };
    }
    static getHtml(url) {
        let html = '';
        const page = url;
        if (this._content.has(page)) {
            html = this._content.get(page);
        }
        else {
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
                        href = '/#' + escape(path_1.default.join(hrefPath, href));
                        out = '<a href="' + href + '"';
                    }
                    if (title) {
                        out += ' title="' + title + '"';
                    }
                    out += '>' + text + '</a>';
                    return out;
                },
                image(href, title, text) {
                    href = path_1.default.join(hrefPath, href);
                    if (href === null) {
                        return text;
                    }
                    let out = '<div class="images" v-viewer><img src="' + href + '" alt="' + text + '"';
                    out += '> </div>';
                    return out;
                }
            };
            marked_1.default.use({ renderer });
            html = marked_1.default(content);
            this._content.set(page, html);
        }
        return html;
    }
    static async viewMarkdown(ctx) {
        // console.log(ctx.request.url);
        ctx.body = this.getHtml('#' + ctx.request.url);
    }
    static async view(ctx) {
        const page = decodeURIComponent(ctx.paramsObj.page);
        const html = this.getHtml(page);
        ctx.makeResObj(200, "succ", { page: html });
    }
    static async tree(ctx) {
        //每次clone的时候解析一次，如果需要本地目录文件每次访问的时候，实时解析，去掉该注释
        ctx.makeResObj(200, "succ", { tree: this._treeData, title: webConf_1.default.config.webConf.title });
    }
    static async search(ctx) {
        const query = ctx.paramsObj.query;
        const { queryWords, result } = SearchService_1.SearchService.search(query);
        const page = [];
        result.forEach(d => {
            page.push(SearchService_1.SearchService.idToFile(d));
        });
        ctx.makeResObj(200, "succ", { page, queryWords });
    }
    static async refresh(ctx) {
        await this.loadTree();
        if (ctx) {
            //每次clone的时候解析一次，如果需要本地目录文件每次访问的时候，实时解析，去掉该注释
            ctx.makeResObj(200, "succ");
        }
    }
}
TreeController._id = 0;
TreeController._treeData = [];
TreeController._summary = null;
TreeController._content = new Map();
exports.default = TreeController;
