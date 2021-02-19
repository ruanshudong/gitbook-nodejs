"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConf = exports.pageConf = void 0;
const PageController_1 = __importDefault(require("./controller/PageController"));
const LocaleController_1 = __importDefault(require("./controller/LocaleController"));
const TreeController_1 = __importDefault(require("./controller/TreeController"));
const ViewController_1 = __importDefault(require("./controller/ViewController"));
const pageConf = [
    //首页
    ["get", "/", PageController_1.default, PageController_1.default.index],
];
exports.pageConf = pageConf;
const apiConf = [
    ["get", "/get_locale", LocaleController_1.default, LocaleController_1.default.getLocale],
    ["get", "/tree", TreeController_1.default, TreeController_1.default.tree],
    ["get", "/view", ViewController_1.default, ViewController_1.default.view]
];
exports.apiConf = apiConf;
