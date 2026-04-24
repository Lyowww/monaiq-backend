"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapScheduledPayment = mapScheduledPayment;
function mapScheduledPayment(p) {
    return {
        id: p._id.toString(),
        userId: p.userId.toString(),
        title: p.title,
        description: p.description,
        amountMinor: p.amountMinor,
        dueDate: p.dueDate.toISOString(),
        recurring: p.recurring,
        recurrenceType: p.recurrenceType,
        category: p.category,
        status: p.status,
        reminderEnabled: p.reminderEnabled
    };
}
//# sourceMappingURL=scheduled-mappers.js.map