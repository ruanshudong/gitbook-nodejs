"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs-extra"));
var stream_1 = __importDefault(require("stream"));
var path = __importStar(require("path"));
var lodash_1 = __importDefault(require("lodash"));
var localeMap = {};
var fileNames = fs.readdirSync(path.join(__dirname, "../../locale"));
fileNames.forEach(function (fileName) {
    Promise.resolve().then(function () { return __importStar(require(path.join(__dirname, "../../locale/", fileName))); }).then(function (content) {
        localeMap[content.localeCode] = formatJson(content);
    });
});
function formatJson(localeJson) {
    var resultJson = {};
    function setValue(localeJson, keyPart, resultJson) {
        // let args = arguments;
        lodash_1.default.each(localeJson, function (value, key) {
            var newKeyPart = keyPart ? (keyPart + "." + key) : key;
            if (!lodash_1.default.isObject(value)) {
                resultJson["#" + newKeyPart + "#"] = value;
            }
            else {
                setValue(value, newKeyPart, resultJson);
            }
        });
    }
    setValue(localeJson, "", resultJson);
    return resultJson;
}
function LocaleMidware(ctx, next) {
    return __awaiter(this, void 0, void 0, function () {
        var lan_1, content_1, contentType, matchList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, next()];
                case 1:
                    _a.sent();
                    if (!ctx.body) {
                        lan_1 = ctx.paramsObj && ctx.paramsObj.__locale || ctx.cookies.get("locale") || "cn";
                        content_1 = "";
                        contentType = "";
                        if (lodash_1.default.isString(ctx.body)) {
                            content_1 = ctx.body;
                            contentType = "string";
                        }
                        else if (lodash_1.default.isObject(ctx.body) && !(ctx.body instanceof stream_1.default)) {
                            content_1 = JSON.stringify(ctx.body);
                            contentType = "object";
                        }
                        else {
                            return [2 /*return*/];
                        }
                        matchList = content_1.match(/#[a-zA-Z0-9._]+#/g);
                        lodash_1.default.each(matchList, function (matchStr) {
                            var str = localeMap[lan_1][matchStr];
                            if (str) {
                                content_1 = content_1.replace(matchStr, str);
                            }
                        });
                        if (contentType == "object") {
                            ctx.body = JSON.parse(content_1);
                        }
                        else {
                            ctx.body = content_1;
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = LocaleMidware;
