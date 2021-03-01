"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const nodejieba_1 = __importDefault(require("nodejieba"));
class SearchService {
    static load(files, func) {
        for (let i = 0; i < files.length; i++) {
            this._idMap.set(i, files[i]);
            // console.log(i, this._idMap.get(i));
            const { content } = func(files[i].href);
            const result = nodejieba_1.default.cutForSearch(content, true);
            result.forEach(words => {
                if (this._data.has(words)) {
                    this._data.get(words).push(i);
                }
                else {
                    this._data.set(words, [i]);
                }
            });
        }
        console.log('files size:', this._idMap.size, "words size:", this._data.size);
    }
    static search(query) {
        const queryWords = nodejieba_1.default.cutForSearch(query, true);
        const group = [];
        queryWords.forEach(q => {
            if (this._data.has(q)) {
                group.push(this._data.get(q));
            }
        });
        //计算并集
        const tempArray = [];
        const data = new Map();
        for (let i = 0; i < group.length; i++) {
            group[i].forEach(id => {
                if (data.has(id)) {
                    data.set(id, data.get(id) + 1);
                }
                else {
                    data.set(id, 1);
                }
            });
        }
        data.forEach((value, key) => {
            if (value == group.length) {
                tempArray.push(key);
            }
        });
        if (tempArray.length == 0) {
            for (let i = 0; i < group.length; i++) {
                tempArray.push(...new Set(group[i]));
            }
        }
        const result = [...new Set(tempArray)];
        return { queryWords, result };
    }
    static idToFile(id) {
        return this._idMap.get(parseInt(id));
    }
}
exports.SearchService = SearchService;
//fileid, filepath
SearchService._idMap = new Map();
//words, [fileid]
SearchService._data = new Map();
