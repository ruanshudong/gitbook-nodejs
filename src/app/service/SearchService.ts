
import nodejieba from "nodejieba";

type DataType = {name: string, href: string};

class SearchService {

    //fileid, filepath
    protected static _idMap = new Map<number, DataType>();

    //words, [fileid]
    protected static _data = new Map();

    public static load(files: DataType[], func: Function) {

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

    public static idToFile(id: string) {
        return this._idMap.get(parseInt(id));
    }

}

export { SearchService, DataType };