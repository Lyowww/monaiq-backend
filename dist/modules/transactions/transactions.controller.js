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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const swagger_models_1 = require("../../common/swagger/swagger.models");
const create_transaction_dto_1 = require("./create-transaction.dto");
const transaction_mappers_1 = require("./transaction.mappers");
const transactions_service_1 = require("./transactions.service");
const update_transaction_dto_1 = require("./update-transaction.dto");
let TransactionsController = class TransactionsController {
    transactionsService;
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    list(claims, type, category, q, limit = '50', skip = '0') {
        return this.transactionsService
            .listFiltered(claims.sub, {
            type,
            category,
            q,
            limit: Math.min(200, Math.max(1, Number(limit) || 50)),
            skip: Math.max(0, Number(skip) || 0)
        })
            .then((rows) => rows.map((r) => (0, transaction_mappers_1.mapTransaction)(r)));
    }
    create(claims, dto) {
        return this.transactionsService.createTransaction(claims.sub, dto).then((r) => (0, transaction_mappers_1.mapTransaction)(r));
    }
    update(claims, id, dto) {
        return this.transactionsService.updateTransaction(claims.sub, id, dto).then((r) => (0, transaction_mappers_1.mapTransaction)(r));
    }
    remove(claims, id) {
        return this.transactionsService.deleteTransaction(claims.sub, id).then(() => ({ success: true }));
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List transactions (history) with optional filters' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('category')),
    __param(3, (0, common_1.Query)('q')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('skip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new transaction and atomically update linked debt' }),
    (0, swagger_1.ApiCreatedResponse)({ type: swagger_models_1.TransactionResponseDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_transaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "remove", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, swagger_1.ApiTags)('Transactions'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.Controller)('transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map