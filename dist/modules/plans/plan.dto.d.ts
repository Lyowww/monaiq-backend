export declare class CreateFinancialPlanDto {
    title: string;
    planType: 'monthly_spend_cap' | 'category_spend_cap' | 'savings_target';
    capMinor?: number;
    category?: string;
    targetMinor?: number;
    savedMinor?: number;
    notes?: string;
}
export declare class UpdateFinancialPlanDto {
    title?: string;
    capMinor?: number;
    category?: string;
    targetMinor?: number;
    savedMinor?: number;
    notes?: string;
    status?: 'active' | 'archived';
}
