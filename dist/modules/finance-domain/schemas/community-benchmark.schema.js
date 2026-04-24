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
exports.CommunityBenchmarkSchema = exports.CommunityBenchmark = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let CommunityBenchmark = class CommunityBenchmark {
    regionCode;
    categoryKey;
    meanMinor;
    medianMinor;
    p75Minor;
    sampleSize;
    periodMonth;
};
exports.CommunityBenchmark = CommunityBenchmark;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['AM'], default: 'AM' }),
    __metadata("design:type", String)
], CommunityBenchmark.prototype, "regionCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 80 }),
    __metadata("design:type", String)
], CommunityBenchmark.prototype, "categoryKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], CommunityBenchmark.prototype, "meanMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], CommunityBenchmark.prototype, "medianMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], CommunityBenchmark.prototype, "p75Minor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], CommunityBenchmark.prototype, "sampleSize", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, match: /^\d{4}-(0[1-9]|1[0-2])$/ }),
    __metadata("design:type", String)
], CommunityBenchmark.prototype, "periodMonth", void 0);
exports.CommunityBenchmark = CommunityBenchmark = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'community_benchmarks',
        timestamps: true
    })
], CommunityBenchmark);
exports.CommunityBenchmarkSchema = mongoose_1.SchemaFactory.createForClass(CommunityBenchmark);
exports.CommunityBenchmarkSchema.index({ regionCode: 1, categoryKey: 1, periodMonth: 1 }, { unique: true });
//# sourceMappingURL=community-benchmark.schema.js.map