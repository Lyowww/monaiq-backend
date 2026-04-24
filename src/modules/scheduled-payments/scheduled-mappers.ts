import type { ScheduledPaymentRecord } from '@ai-finance/shared-types';
import type { ScheduledPaymentDocument } from './schemas/scheduled-payment.schema';

export function mapScheduledPayment(
  p: ScheduledPaymentDocument
): ScheduledPaymentRecord {
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
