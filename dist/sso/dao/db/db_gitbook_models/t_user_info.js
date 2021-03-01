"use strict";
/* jshint indent: 1 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
let tUserInfo = class tUserInfo extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.STRING, field: "uid" }),
    __metadata("design:type", String)
], tUserInfo.prototype, "uid", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.STRING, field: "password" }),
    __metadata("design:type", String)
], tUserInfo.prototype, "password", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.TINYINT, field: "activated" }),
    __metadata("design:type", Boolean)
], tUserInfo.prototype, "activated", void 0);
__decorate([
    sequelize_typescript_1.Index({ name: "idx_create_time" }),
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.DATE, field: "create_time" }),
    __metadata("design:type", Date)
], tUserInfo.prototype, "create_time", void 0);
__decorate([
    sequelize_typescript_1.Index({ name: "idx_update_time" }),
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.DATE, field: "update_time" }),
    __metadata("design:type", Date)
], tUserInfo.prototype, "update_time", void 0);
tUserInfo = __decorate([
    sequelize_typescript_1.Table({ tableName: "t_user_info", freezeTableName: true, timestamps: false, })
], tUserInfo);
exports.default = tUserInfo;
