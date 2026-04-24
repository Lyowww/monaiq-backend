"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDebt = mapDebt;
function mapDebt(debt) {
    const name = (debt.personName?.trim() || debt.lenderName).trim();
    return {
        id: debt._id.toString(),
        userId: debt.userId.toString(),
        lenderName: debt.lenderName,
        personName: name,
        debtType: debt.debtType ?? 'I_OWE',
        principalMinor: debt.principalMinor,
        outstandingMinor: debt.outstandingMinor,
        minimumDueMinor: debt.minimumDueMinor,
        aprPercent: debt.aprPercent,
        dueDate: debt.dueDate.toISOString(),
        relationship: debt.relationship,
        status: debt.status,
        reason: debt.reason,
        reminderEnabled: debt.reminderEnabled ?? true
    };
}
//# sourceMappingURL=debt.mappers.js.map