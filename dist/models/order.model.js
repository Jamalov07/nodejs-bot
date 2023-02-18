"use strict";
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
exports.Order = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const service_type_model_1 = require("./service_type.model");
const master_model_1 = require("./master.model");
let Order = class Order extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Order.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => master_model_1.Master),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Order.prototype, "master_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => master_model_1.Master),
    __metadata("design:type", master_model_1.Master)
], Order.prototype, "master", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => service_type_model_1.Service_type),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Order.prototype, "service_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => service_type_model_1.Service_type),
    __metadata("design:type", service_type_model_1.Service_type)
], Order.prototype, "serviceType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Order.prototype, "date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Order.prototype, "time", void 0);
Order = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "order" })
], Order);
exports.Order = Order;
//# sourceMappingURL=order.model.js.map