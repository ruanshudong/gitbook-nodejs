
import * as Koa from "koa";
import webConf from "../../config/webConf";
import path from 'path';
import fs from 'fs-extra';
import marked from 'marked';

class TreeController {

    protected _id: number = 0;
    protected _treeData = [];
    protected _info = '';

    public constructor() {
        this.loadTree();
    }

    protected getToken(i) {
        const token = i.tokens[0];

        if (token.tokens && token.tokens[0].type == 'link') {
            return token.tokens[0];
        }
        return token;
    }

    protected parseText(i) {

        const token = this.getToken(i);

        const data = {
            name: token.text,
            href: token.type == 'link' ? token.href : null,
            id: '' + this._id,
            children: []
        }

        return data;
    }

    public loadTree() {

        this._id = 0;

        const Summary = fs.readFileSync(path.join(webConf.respository.path, 'SUMMARY.md')).toString();

        const tokens = marked.lexer(Summary);

        tokens.forEach(i => {
            ++this._id;

            if (i.type == 'heading') {
                const item = this.parseText(i);

                this._treeData.push(item);
            } 
            else if (i.type == 'list') {
                this.parseItem(this._treeData[this._treeData.length - 1], i.items);
            }
        })
    }

    protected parseItem(data: any, items: any[]) {

        items.forEach(i => {

            const item = this.parseText(i);

            if (data) {
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

    public async tree(ctx: Koa.Context) {
        //每次clone的时候解析一次，如果需要本地目录文件每次访问的时候，实时解析，去掉该注释
        /*
        this._treeData=[];
        this.loadTree();
        */

        ctx.makeResObj(200, "succ", { tree: this._treeData, title: webConf.webConf.title });
    }
}

// TreeController.loadTree();

export default TreeController;
