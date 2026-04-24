import type { AccessTokenClaims } from '../auth/auth.types';
import { CreateTransactionDto } from './create-transaction.dto';
import { TransactionsService } from './transactions.service';
import { UpdateTransactionDto } from './update-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    list(claims: AccessTokenClaims, type?: 'expense' | 'income', category?: string, q?: string, limit?: string, skip?: string): Promise<import("@ai-finance/shared-types").TransactionRecord[]>;
    create(claims: AccessTokenClaims, dto: CreateTransactionDto): Promise<import("@ai-finance/shared-types").TransactionRecord>;
    update(claims: AccessTokenClaims, id: string, dto: UpdateTransactionDto): Promise<import("@ai-finance/shared-types").TransactionRecord>;
    remove(claims: AccessTokenClaims, id: string): Promise<{
        success: true;
    }>;
}
