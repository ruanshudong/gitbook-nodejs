
import path from "path";

const webConf = {
    
    respository: {
        tmpPath: path.join(__dirname, "../../client/tmp"),   
    },

    config: {
        webConf: null,
        email: null,
        dbConf: null,
        enableLogin: false,
        path: null,
        repo: '',
        interval: 3600 * 1000,
        cloneOnStart: false,
    }

};

export default webConf;