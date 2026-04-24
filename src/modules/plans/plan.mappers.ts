import type { FinancePlanRecord } from '@ai-finance/shared-types';
import { FinancialPlanDocument } from './schemas/financial-plan.schema';

export function mapFinancialPlan(doc: FinancialPlanDocument): FinancePlanRecord {
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
