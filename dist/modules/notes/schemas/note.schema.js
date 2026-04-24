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
exports.NoteSchema = exports.Note = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let Note = class Note {
    userId;
    title;
    body;
    totalObligationMinor;
    projectedBalanceMinor;
    dueDate;
    status;
    aiWarningTriggered;
};
exports.Note = Note;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Note.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Note.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Note.prototype, "body", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Note.prototype, "totalObligationMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Note.prototype, "projectedBalanceMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Note.prototype, "dueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'scheduled', enum: ['scheduled', 'done', 'cancelled'] }),
    __metadata("design:type", String)
], Note.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], Note.prototype, "aiWarningTriggered", void 0);
exports.Note = Note = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'notes',
        timestamps: true
    })
], Note);
exports.NoteSchema = mongoose_1.SchemaFactory.createForClass(Note);
exports.NoteSchema.index({ userId: 1, dueDate: 1 });
//# sourceMappingURL=note.schema.js.map