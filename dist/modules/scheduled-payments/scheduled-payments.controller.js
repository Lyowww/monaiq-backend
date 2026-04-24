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
exports.ScheduledPaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const payment_dto_1 = require("./payment.dto");
const scheduled_mappers_1 = require("./scheduled-mappers");
const scheduled_payments_service_1 = require("./scheduled-payments.service");
let ScheduledPaymentsController = class ScheduledPaymentsController {
    scheduledPaymentsService;
    constructor(scheduledPaymentsService) {
        this.scheduledPaymentsService = scheduledPaymentsService;
    }
    list(claims) {
        return this.scheduledPaymentsService
            .listForUser(claims.sub)
            .then((rows) => rows.map((p) => (0, scheduled_mappers_1.mapScheduledPayment)(p)));
    }
    getOne(claims, id) {
        return this.scheduledPaymentsService
            .getById(claims.sub, id)
            .then((p) => (0, scheduled_mappers_1.mapScheduledPayment)(p));
    }
    create(claims, dto) {
        return this.scheduledPaymentsService
            .create(claims.sub, dto)
            .then((p) => (0, scheduled_mappers_1.mapScheduledPayment)(p));
    }
    update(claims, id, dto) {
        return this.scheduledPaymentsService
            .update(claims.sub, id, dto)
            .then((p) => (0, scheduled_mappers_1.mapScheduledPayment)(p));
    }
    markPaid(claims, id, dto) {
        return this.scheduledPaymentsService
            .markPaid(claims.sub, id, dto)
            .then((p) => (0, scheduled_mappers_1.mapScheduledPayment)(p));
    }
    remove(claims, id) {
        return this.scheduledPaymentsService.remove(claims.sub, id).then(() => ({ success: true }));
    }
};
exports.ScheduledPaymentsController = ScheduledPaymentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all scheduled / recurring payments' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ScheduledPaymentsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ScheduledPaymentsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payment_dto_1.CreateScheduledPaymentDto]),
    __metadata("design:returntype", void 0)
], ScheduledPaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, payment_dto_1.UpdateScheduledPaymentDto]),
    __metadata("design:returntype", void 0)
], ScheduledPaymentsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/mark-paid'),
    (0, swagger_1.ApiOperation)({ summary: 'Record expense, advance recurring if applicable' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, payment_dto_1.MarkPaymentPaidDto]),
    __metadata("design:returntype", void 0)
], ScheduledPaymentsController.prototype, "markPaid", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ScheduledPaymentsController.prototype, "remove", null);
exports.ScheduledPaymentsController = ScheduledPaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Scheduled payments'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.Controller)('scheduled-payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [scheduled_payments_service_1.ScheduledPaymentsService])
], ScheduledPaymentsController);
//# sourceMappingURL=scheduled-payments.controller.js.map