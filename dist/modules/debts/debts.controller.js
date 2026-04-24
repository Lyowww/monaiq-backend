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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebtsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const debt_mappers_1 = require("./debt.mappers");
const debt_dto_1 = require("./debt.dto");
const debts_service_1 = require("./debts.service");
let DebtsController = class DebtsController {
    debtsService;
    constructor(debtsService) {
        this.debtsService = debtsService;
    }
    list(claims, debtType) {
        return this.debtsService
            .listForUser(claims.sub, debtType)
            .then((rows) => rows.map((d) => (0, debt_mappers_1.mapDebt)(d)));
    }
    getOne(claims, id) {
        return this.debtsService.getById(claims.sub, id).then((d) => (0, debt_mappers_1.mapDebt)(d));
    }
    create(claims, dto) {
        return this.debtsService.create(claims.sub, dto).then((d) => (0, debt_mappers_1.mapDebt)(d));
    }
    update(claims, id, dto) {
        return this.debtsService.update(claims.sub, id, dto).then((d) => (0, debt_mappers_1.mapDebt)(d));
    }
    remove(claims, id) {
        return this.debtsService.remove(claims.sub, id).then(() => ({ success: true }));
    }
};
exports.DebtsController = DebtsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List debts, optionally by I_OWE / THEY_OWE' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('debtType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DebtsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single debt' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DebtsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a debt' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, debt_dto_1.CreateDebtDto]),
    __metadata("design:returntype", void 0)
], DebtsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a debt' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, debt_dto_1.UpdateDebtDto]),
    __metadata("design:returntype", void 0)
], DebtsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a debt' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DebtsController.prototype, "remove", null);
exports.DebtsController = DebtsController = __decorate([
    (0, swagger_1.ApiTags)('Debts'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.Controller)('debts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [debts_service_1.DebtsService])
], DebtsController);
//# sourceMappingURL=debts.controller.js.map