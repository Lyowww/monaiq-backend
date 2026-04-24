"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceDomainModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const ai_structured_artifact_schema_1 = require("./schemas/ai-structured-artifact.schema");
const community_benchmark_schema_1 = require("./schemas/community-benchmark.schema");
const contact_ledger_schema_1 = require("./schemas/contact-ledger.schema");
const obligation_schema_1 = require("./schemas/obligation.schema");
const savings_goal_schema_1 = require("./schemas/savings-goal.schema");
const user_preference_schema_1 = require("./schemas/user-preference.schema");
let FinanceDomainModule = class FinanceDomainModule {
};
exports.FinanceDomainModule = FinanceDomainModule;
exports.FinanceDomainModule = FinanceDomainModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: obligation_schema_1.Obligation.name, schema: obligation_schema_1.ObligationSchema },
                { name: savings_goal_schema_1.SavingsGoal.name, schema: savings_goal_schema_1.SavingsGoalSchema },
                { name: user_preference_schema_1.UserPreference.name, schema: user_preference_schema_1.UserPreferenceSchema },
                { name: contact_ledger_schema_1.ContactLedger.name, schema: contact_ledger_schema_1.ContactLedgerSchema },
                { name: ai_structured_artifact_schema_1.AiStructuredArtifact.name, schema: ai_structured_artifact_schema_1.AiStructuredArtifactSchema },
                { name: community_benchmark_schema_1.CommunityBenchmark.name, schema: community_benchmark_schema_1.CommunityBenchmarkSchema }
            ])
        ],
        exports: [mongoose_1.MongooseModule]
    })
], FinanceDomainModule);
//# sourceMappingURL=finance-domain.module.js.map