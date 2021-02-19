"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webConf_1 = __importDefault(require("../../config/webConf"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const marked_1 = __importDefault(require("marked"));
class TreeController {
    // public constructor() {
    //     this.loadTree();
    // }
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
            id: '' + this._id,
            children: []
        };
        return data;
    }
    static loadTree() {
        this._id = 0;
        const Summary = fs_extra_1.default.readFileSync(path_1.default.join(webConf_1.default.respository.path, 'SUMMARY.md')).toString();
        const tokens = marked_1.default.lexer(Summary);
        tokens.forEach(i => {
            ++this._id;
            if (i.type == 'heading') {
                const item = this.parseText(i);
                this._treeData.push(item);
            }
            else if (i.type == 'list') {
                this.parseItem(this._treeData[this._treeData.length - 1], i.items);
            }
        });
    }
    static parseItem(data, items) {
        items.forEach(i => {
            const item = this.parseText(i);
            if (data) {
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
    static async tree(ctx) {
        //每次clone的时候解析一次，如果需要本地目录文件每次访问的时候，实时解析，去掉该注释
        /*
        this._treeData=[];
        this.loadTree();
        */
        ctx.makeResObj(200, "succ", { tree: this._treeData, title: webConf_1.default.webConf.title });
    }
}
TreeController._id = 0;
TreeController._treeData = [];
TreeController.loadTree();
exports.default = TreeController;
