import { Model } from 'mongoose';
import { CreateFinancialPlanDto, UpdateFinancialPlanDto } from './plan.dto';
import { FinancialPlan } from './schemas/financial-plan.schema';
export declare class PlansService {
    private readonly planModel;
    constructor(planModel: Model<FinancialPlan>);
    listForUser(userId: string, status?: 'active' | 'archived'): Promise<import("@ai-finance/shared-types").FinancePlanRecord[]>;
    listActiveForAssistant(userId: string): Promise<import("@ai-finance/shared-types").FinancePlanRecord[]>;
    create(userId: string, dto: CreateFinancialPlanDto): Promise<import("@ai-finance/shared-types").FinancePlanRecord>;
    update(userId: string, id: string, dto: UpdateFinancialPlanDto): Promise<import("@ai-finance/shared-types").FinancePlanRecord>;
    remove(userId: string, id: string): Promise<{
        success: true;
    }>;
    private validateCreate;
}
