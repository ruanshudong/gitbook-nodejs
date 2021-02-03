"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConf = exports.pageConf = void 0;
var PageController_1 = __importDefault(require("../controller/PageController"));
var LocaleController_1 = __importDefault(require("../controller/LocaleController"));
var TreeController_1 = __importDefault(require("../controller/TreeController"));
var ViewController_1 = __importDefault(require("../controller/ViewController"));
var pageConf = [
    //首页
    ["get", "/", PageController_1.default, PageController_1.default.index]
];
exports.pageConf = pageConf;
var apiConf = [
    ["get", "/get_locale", LocaleController_1.default, LocaleController_1.default.getLocale],
    ["get", "/tree", TreeController_1.default, TreeController_1.default.tree],
    ["get", "/view", ViewController_1.default, ViewController_1.default.view]
];
exports.apiConf = apiConf;
