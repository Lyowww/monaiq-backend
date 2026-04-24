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
exports.AiStructuredArtifactSchema = exports.AiStructuredArtifact = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let AiStructuredArtifact = class AiStructuredArtifact {
    userId;
    kind;
    schemaVersion;
    /** Strict JSON from the LLM; versioned with schemaVersion. */
    payload;
    idempotencyKey;
};
exports.AiStructuredArtifact = AiStructuredArtifact;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AiStructuredArtifact.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: [
            'income_nudge',
            'cash_runway',
            'savings_coach',
            'utility_benchmark',
            'debt_sms_draft',
            'general'
        ],
        index: true
    }),
    __metadata("design:type", String)
], AiStructuredArtifact.prototype, "kind", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], AiStructuredArtifact.prototype, "schemaVersion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed, required: true })
    /** Strict JSON from the LLM; versioned with schemaVersion. */
    ,
    __metadata("design:type", Object)
], AiStructuredArtifact.prototype, "payload", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AiStructuredArtifact.prototype, "idempotencyKey", void 0);
exports.AiStructuredArtifact = AiStructuredArtifact = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'ai_structured_artifacts',
        timestamps: true
    })
], AiStructuredArtifact);
exports.AiStructuredArtifactSchema = mongoose_1.SchemaFactory.createForClass(AiStructuredArtifact);
exports.AiStructuredArtifactSchema.index({ userId: 1, kind: 1, createdAt: -1 });
exports.AiStructuredArtifactSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
//# sourceMappingURL=ai-structured-artifact.schema.js.map