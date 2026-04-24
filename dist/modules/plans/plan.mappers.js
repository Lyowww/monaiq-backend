"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFinancialPlan = mapFinancialPlan;
function mapFinancialPlan(doc) {
    return {
        id: doc._id.toString(),
        title: doc.title,
        planType: doc.planType,
        capMinor: doc.capMinor,
        category: doc.category,
        targetMinor: doc.targetMinor,
        savedMinor: doc.savedMinor,
        notes: doc.notes
    };
}
//# sourceMappingURL=plan.mappers.js.map