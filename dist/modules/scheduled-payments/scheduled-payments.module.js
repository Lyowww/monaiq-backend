"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledPaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
const scheduled_payment_schema_1 = require("./schemas/scheduled-payment.schema");
const scheduled_payments_controller_1 = require("./scheduled-payments.controller");
const scheduled_payments_service_1 = require("./scheduled-payments.service");
let ScheduledPaymentsModule = class ScheduledPaymentsModule {
};
exports.ScheduledPaymentsModule = ScheduledPaymentsModule;
exports.ScheduledPaymentsModule = ScheduledPaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: scheduled_payment_schema_1.ScheduledPayment.name, schema: scheduled_payment_schema_1.ScheduledPaymentSchema },
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema }
            ])
        ],
        controllers: [scheduled_payments_controller_1.ScheduledPaymentsController],
        providers: [scheduled_payments_service_1.ScheduledPaymentsService],
        exports: [scheduled_payments_service_1.ScheduledPaymentsService, mongoose_1.MongooseModule]
    })
], ScheduledPaymentsModule);
//# sourceMappingURL=scheduled-payments.module.js.map