"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const debt_schema_1 = require("../debts/schemas/debt.schema");
const note_schema_1 = require("../notes/schemas/note.schema");
const scheduled_payment_schema_1 = require("../scheduled-payments/schemas/scheduled-payment.schema");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
const users_module_1 = require("../users/users.module");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboard_service_1 = require("./dashboard.service");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            mongoose_1.MongooseModule.forFeature([
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
                { name: debt_schema_1.Debt.name, schema: debt_schema_1.DebtSchema },
                { name: note_schema_1.Note.name, schema: note_schema_1.NoteSchema },
                { name: scheduled_payment_schema_1.ScheduledPayment.name, schema: scheduled_payment_schema_1.ScheduledPaymentSchema }
            ])
        ],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService]
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map