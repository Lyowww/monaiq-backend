"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapTransaction = mapTransaction;
function mapTransaction(transaction) {
    return {
        id: transaction._id.toString(),
        userId: transaction.userId.toString(),
        debtId: transaction.debtId?.toString(),
        obligationId: transaction.obligationId?.toString(),
        scheduledPaymentId: transaction.scheduledPaymentId?.toString(),
        source: transaction.source,
        category: transaction.category,
        subcategory: transaction.subcategory,
        direction: transaction.direction,
        amountMinor: transaction.amountMinor,
        currencyCode: transaction.currencyCode,
        bookedAt: transaction.bookedAt.toISOString(),
        merchantName: transaction.merchantName,
        notes: transaction.notes,
        isTransfer: transaction.isTransfer,
        incomeSource: transaction.incomeSource,
        recurring: transaction.recurring,
        recurrenceType: transaction.recurrenceType,
        pocket: transaction.pocket
    };
}
//# sourceMappingURL=transaction.mappers.js.map