
import PageController from "./controller/PageController";
import LocaleController from "./controller/LocaleController";
import TreeController from "./controller/TreeController";
import ViewController from "./controller/ViewController";
import { confType } from "../midware/type";

// export type confType = [string, string, Function, any?, any?];

const pageController = new PageController();
const localeController = new LocaleController();
const treeController = new TreeController();
const viewController = new ViewController();

const pageConf: Array<confType> = [
    //首页
    ["get", "/", pageController, pageController.index]
];

const apiConf: Array<confType> = [
    ["get", "/get_locale", localeController, localeController.getLocale],
    ["get", "/tree", treeController, treeController.tree],
    ["get", "/view", viewController, viewController.view]
];

export { pageConf, apiConf };