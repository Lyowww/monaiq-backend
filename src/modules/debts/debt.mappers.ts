import type { DebtRecord } from '@ai-finance/shared-types';
import type { DebtDocument } from './schemas/debt.schema';

export function mapDebt(debt: DebtDocument): DebtRecord {
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
