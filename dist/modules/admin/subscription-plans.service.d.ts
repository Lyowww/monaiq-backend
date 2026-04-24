import { Model } from 'mongoose';
import type { UserDocument } from '../users/schemas/user.schema';
import { type SubscriptionPlanDocument } from './schemas/subscription-plan.schema';
export declare class SubscriptionPlansService {
    private readonly planModel;
    constructor(planModel: Model<SubscriptionPlanDocument>);
    listFeatureCatalog(): ({
        id: "ai_assistant_extended";
        title: "Extended AI assistant";
        description: "Higher daily limits and longer context for finance Q&A.";
        icon: "sparkles";
    } | {
        id: "advanced_analytics";
        title: "Advanced analytics";
        description: "Trends, category breakdowns, and custom date ranges.";
        icon: "line-chart";
    } | {
        id: "smart_insights";
        title: "Smart insights";
        description: "Automated summaries and unusual-spending detection.";
        icon: "lightbulb";
    } | {
        id: "debt_tools_pro";
        title: "Pro debt tools";
        description: "Snowball / avalanche planners and payoff simulations.";
        icon: "layers";
    } | {
        id: "scheduled_payments_sync";
        title: "Scheduled payments";
        description: "Reminders and calendar sync for bills & subscriptions.";
        icon: "calendar-clock";
    } | {
        id: "export_reports";
        title: "Exports & reports";
        description: "CSV / PDF exports for transactions and tax prep.";
        icon: "file-down";
    } | {
        id: "multi_currency";
        title: "Multi-currency";
        description: "Hold and convert AMD, USD, and EUR with live rates.";
        icon: "coins";
    } | {
        id: "custom_categories";
        title: "Custom categories & rules";
        description: "Unlimited categories and auto-tagging rules.";
        icon: "tags";
    } | {
        id: "priority_support";
        title: "Priority support";
        description: "Faster responses from the MonAIQ team.";
        icon: "headphones";
    } | {
        id: "early_access";
        title: "Early access";
        description: "Try new assistant models and beta features first.";
        icon: "rocket";
    })[];
    listPlans(): Promise<{
        id: string;
        key: string;
        name: string;
        description: string | null;
        priceMinor: number;
        currencyCode: string;
        billingPeriod: string;
        featureIds: string[];
        sortOrder: number;
        isActive: boolean;
        highlightTag: string | null;
        createdAt: string | null;
        updatedAt: string | null;
    }[]>;
    /** Active plans for store / mobile (no auth). */
    listPublicPlans(): Promise<{
        id: string;
        key: string;
        name: string;
        description: string | null;
        priceMinor: number;
        currencyCode: string;
        billingPeriod: string;
        featureIds: string[];
        sortOrder: number;
        isActive: boolean;
        highlightTag: string | null;
        createdAt: string | null;
        updatedAt: string | null;
    }[]>;
    assertActivePlanKey(key: string): Promise<void>;
    /**
     * Resolves feature ids for API responses and mobile gating.
     * Paid plan features are unioned with {@link BASE_FREE_SUBSCRIPTION_FEATURE_IDS}.
     * Legacy `subscription: premium` without a plan key = full catalog.
     */
    getEntitledFeatureIdsForUser(user: UserDocument): Promise<string[]>;
    createPlan(body: {
        key: string;
        name: string;
        description?: string;
        priceMinor: number;
        currencyCode: 'AMD' | 'USD' | 'EUR';
        billingPeriod: 'month' | 'year';
        featureIds: string[];
        sortOrder?: number;
        isActive?: boolean;
        highlightTag?: string;
    }): Promise<{
        id: string;
        key: string;
        name: string;
        description: string | null;
        priceMinor: number;
        currencyCode: string;
        billingPeriod: string;
        featureIds: string[];
        sortOrder: number;
        isActive: boolean;
        highlightTag: string | null;
        createdAt: string | null;
        updatedAt: string | null;
    }>;
    patchPlan(id: string, patch: Partial<{
        name: string;
        description: string | null;
        priceMinor: number;
        currencyCode: 'AMD' | 'USD' | 'EUR';
        billingPeriod: 'month' | 'year';
        featureIds: string[];
        sortOrder: number;
        isActive: boolean;
        highlightTag: string | null;
    }>): Promise<{
        id: string;
        key: string;
        name: string;
        description: string | null;
        priceMinor: number;
        currencyCode: string;
        billingPeriod: string;
        featureIds: string[];
        sortOrder: number;
        isActive: boolean;
        highlightTag: string | null;
        createdAt: string | null;
        updatedAt: string | null;
    }>;
    deletePlan(id: string): Promise<{
        success: true;
    }>;
    private toDto;
}
