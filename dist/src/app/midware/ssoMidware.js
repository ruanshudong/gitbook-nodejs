"use strict";
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
// import request from "request-promise";
var lodash_1 = __importDefault(require("lodash"));
var url_1 = __importDefault(require("url"));
// import { logger } from "../logger";
// import loginConf from "../../config/loginConf";
//带ticket参数, 验证, 登录则写cookie
//需要登录的界面, 未登录则跳转到登录界面
//需要验证的api, 验证, 未登录直接返回
function ssoMiddleware(loginConf) {
    var _this = this;
    var cookieDomainConfig = {
        domain: loginConf.cookieDomain || "",
    };
    var cookieConfig = Object.assign({
        maxAge: 365 * 24 * 60 * 60 * 1000,
    }, cookieDomainConfig);
    return function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        var ticket, uid, ticketFromQuery, _a, urlObj, redirectUrl;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(ctx.request.path === "/logout")) return [3 /*break*/, 1];
                    ctx.cookies.set("ticket", "", cookieDomainConfig);
                    ctx.cookies.set("uid", "", cookieDomainConfig);
                    toLogoutPage(ctx);
                    return [3 /*break*/, 14];
                case 1:
                    ticket = "";
                    uid = "";
                    ticketFromQuery = ctx.query["ticket"];
                    ticket = ticketFromQuery;
                    if (!ticket) return [3 /*break*/, 5];
                    return [4 /*yield*/, loginConf.getUidByTicket(ctx, ticket)];
                case 2:
                    uid = _b.sent();
                    if (!uid) return [3 /*break*/, 5];
                    return [4 /*yield*/, ctx.cookies.set("ticket", ticket, cookieConfig)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, ctx.cookies.set("uid", uid, cookieConfig)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    if (!isInPath(ctx, loginConf.apiPrefix)) return [3 /*break*/, 12];
                    // console.log('ssoMiddleware2:', ctx.request.url);
                    if (!uid) {
                        uid = ctx.cookies.get("uid") || "";
                    }
                    if (!ticket) {
                        ticket = ctx.cookies.get("ticket") || "";
                    }
                    _a = ctx;
                    return [4 /*yield*/, loginConf.validate(ctx, uid, ticket)];
                case 6:
                    _a.uid = _b.sent();
                    if (!ctx.uid) return [3 /*break*/, 10];
                    if (!ticketFromQuery) return [3 /*break*/, 7];
                    urlObj = url_1.default.parse(ctx.request.url, true);
                    delete (urlObj.query["ticket"]);
                    delete (urlObj.search);
                    redirectUrl = url_1.default.format(urlObj);
                    ctx.redirect(redirectUrl);
                    return [3 /*break*/, 9];
                case 7: 
                //从cookie过来的请求
                return [4 /*yield*/, next()];
                case 8:
                    //从cookie过来的请求
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    // console.log('ssoMiddleware3:', ctx.request.url);
                    toLoginPage(ctx);
                    _b.label = 11;
                case 11: return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, next()];
                case 13:
                    _b.sent();
                    _b.label = 14;
                case 14: return [2 /*return*/];
            }
        });
    }); };
    // 检测是否在path列表中
    function isInPath(ctx, pathList) {
        var pathname = ctx.request.path;
        var index = lodash_1.default.findIndex(pathList, function (rule) {
            if (!rule) {
                return false;
            }
            if (typeof rule === "string") {
                return pathname.indexOf(rule) === 0;
            }
            if (rule instanceof RegExp) {
                return rule.test(pathname);
            }
        });
        return index > -1;
    }
    // 控制跳转到登录页面
    function toLoginPage(ctx) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (loginConf.loginUrl.indexOf("?") === -1) {
                    ctx.redirect(loginConf.loginUrl + "?" + loginConf.redirectUrlParamName + "=" + encodeURIComponent(ctx.protocol + "://" + ctx.host + ctx.request.url));
                }
                else {
                    ctx.redirect(loginConf.loginUrl + "&" + loginConf.redirectUrlParamName + "=" + encodeURIComponent(ctx.protocol + "://" + ctx.host + ctx.request.url));
                }
                return [2 /*return*/];
            });
        });
    }
    // 控制跳转到登出页面
    function toLogoutPage(ctx) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (loginConf.logoutUrl) {
                    if (loginConf.loginUrl.indexOf("?") === -1) {
                        ctx.redirect(loginConf.logoutUrl + "?" + loginConf.logoutredirectUrlParamName + "=" + encodeURIComponent(ctx.protocol + "://" + ctx.host));
                    }
                    else {
                        ctx.redirect(loginConf.logoutUrl + "&" + loginConf.logoutredirectUrlParamName + "=" + encodeURIComponent(ctx.protocol + "://" + ctx.host));
                    }
                }
                else {
                    ctx.redirect(ctx.protocol + "://" + ctx.host);
                }
                return [2 /*return*/];
            });
        });
    }
}
exports.default = ssoMiddleware;
