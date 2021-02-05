
import PageController from "./controller/PageController";
import LocaleController from "./controller/LocaleController";
import TreeController from "./controller/TreeController";
import ViewController from "./controller/ViewController";
import { confType } from "../midware/type";

const pageConf: Array<confType> = [
    //首页
    ["get", "/", PageController, PageController.index],
];

const apiConf: Array<confType> = [
    ["get", "/get_locale", LocaleController, LocaleController.getLocale],
    ["get", "/tree", TreeController, TreeController.tree],
    ["get", "/view", ViewController, ViewController.view]
];

export { pageConf, apiConf };