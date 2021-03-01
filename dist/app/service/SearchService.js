"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
class SearchService {
    static load(files, func) {
        // for (let i = 0; i < files.length; i++) {
        //     this._idMap.set(i, files[i]);
        //     console.log(i, this._idMap.get(i));
        //     const { content } = func(files[i].href);
        //     const result = nodejieba.cut(content) as string[];
        //     result.forEach(words => {
        //         if (this._data.has(words)) {
        //             this._data.get(words).push(i);
        //         } else {
        //             this._data.set(words, [i]);
        //         }
        //     });
        // }
        console.log('files size:', this._idMap.size, "words size:", this._data.size);
    }
    // public static search(query: string) {
    //     const queryWords = nodejieba.cut(query) as string[];
    //     const group = [];
    //     queryWords.forEach(q => {
    //         if (this._data.has(q)) {
    //             group.push(this._data.get(q));
    //         } 
    //     });
    //     //计算并集
    //     const tempArray = [];
    //     for (let i = 0; i < group.length;i++){
    //         tempArray.push(...new Set(group[i]))
    //     }
    //     const result = [... new Set(tempArray)]
    //     return result;
    // }
    static idToFile(id) {
        return this._idMap.get(parseInt(id));
    }
}
exports.SearchService = SearchService;
//fileid, filepath
SearchService._idMap = new Map();
//words, [fileid]
SearchService._data = new Map();
