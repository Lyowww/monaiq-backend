import type { AccessTokenClaims } from '../auth/auth.types';
import { CreateDebtDto, UpdateDebtDto } from './debt.dto';
import { DebtsService } from './debts.service';
export declare class DebtsController {
    private readonly debtsService;
    constructor(debtsService: DebtsService);
    list(claims: AccessTokenClaims, debtType?: 'I_OWE' | 'THEY_OWE'): Promise<import("@ai-finance/shared-types").DebtRecord[]>;
    getOne(claims: AccessTokenClaims, id: string): Promise<import("@ai-finance/shared-types").DebtRecord>;
    create(claims: AccessTokenClaims, dto: CreateDebtDto): Promise<import("@ai-finance/shared-types").DebtRecord>;
    update(claims: AccessTokenClaims, id: string, dto: UpdateDebtDto): Promise<import("@ai-finance/shared-types").DebtRecord>;
    remove(claims: AccessTokenClaims, id: string): Promise<{
        success: true;
    }>;
}
