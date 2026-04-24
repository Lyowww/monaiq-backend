import type { AccessTokenClaims } from '../auth/auth.types';
import { CreateFinancialPlanDto, UpdateFinancialPlanDto } from './plan.dto';
import { PlansService } from './plans.service';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    list(claims: AccessTokenClaims, status?: 'active' | 'archived'): Promise<import("@ai-finance/shared-types").FinancePlanRecord[]>;
    create(claims: AccessTokenClaims, dto: CreateFinancialPlanDto): Promise<import("@ai-finance/shared-types").FinancePlanRecord>;
    update(claims: AccessTokenClaims, id: string, dto: UpdateFinancialPlanDto): Promise<import("@ai-finance/shared-types").FinancePlanRecord>;
    remove(claims: AccessTokenClaims, id: string): Promise<{
        success: true;
    }>;
}
