import type { TransactionRecord } from '@ai-finance/shared-types';
import type { TransactionDocument } from './schemas/transaction.schema';
export declare function mapTransaction(transaction: TransactionDocument): TransactionRecord;
