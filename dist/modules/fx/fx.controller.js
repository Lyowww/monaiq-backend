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
exports.FxController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fx_service_1 = require("./fx.service");
let FxController = class FxController {
    fxService;
    constructor(fxService) {
        this.fxService = fxService;
    }
    bankRates() {
        return this.fxService.getBankFxRates();
    }
};
exports.FxController = FxController;
__decorate([
    (0, common_1.Get)('bank-rates'),
    (0, swagger_1.ApiOperation)({
        summary: 'Indicative AMD exchange rates (aggregated bank middle for USD/EUR/RUB, scaled official refs for other majors)'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FxController.prototype, "bankRates", null);
exports.FxController = FxController = __decorate([
    (0, swagger_1.ApiTags)('FX'),
    (0, common_1.Controller)('fx'),
    __metadata("design:paramtypes", [fx_service_1.FxService])
], FxController);
//# sourceMappingURL=fx.controller.js.map