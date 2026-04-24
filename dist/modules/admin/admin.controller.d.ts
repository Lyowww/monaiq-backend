import type { AccessTokenClaims } from '../auth/auth.types';
import { AdminService } from './admin.service';
import { SubscriptionPlansService } from './subscription-plans.service';
export declare class AdminController {
    private readonly admin;
    private readonly subscriptionPlans;
    constructor(admin: AdminService, subscriptionPlans: SubscriptionPlansService);
    summary(): Promise<{
        users: number;
        transactions: number;
        aiChatMessages: number;
        aiChatMessagesToday: number;
        lastActivityAt: string | null;
    }>;
    aiLogs(limit?: string): Promise<{
        id: string;
        userId: string;
        messagePreview: string;
        charCount: number;
        createdAt: string;
    }[]>;
    listHome(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/app-home-item.schema").AppHomeItem, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/app-home-item.schema").AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    createHome(_claims: AccessTokenClaims, body: {
        key: string;
        titleHy: string;
        titleEn: string;
        subtitleHy: string;
        subtitleEn: string;
        route: string;
        iconName?: string;
        sortOrder?: number;
        enabled?: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/app-home-item.schema").AppHomeItem, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/app-home-item.schema").AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/app-home-item.schema").AppHomeItem, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/app-home-item.schema").AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    patchHome(id: string, body: {
        titleHy?: string;
        titleEn?: string;
        subtitleHy?: string;
        subtitleEn?: string;
        route?: string;
        iconName?: string;
        sortOrder?: number;
        enabled?: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/app-home-item.schema").AppHomeItem, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/app-home-item.schema").AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/app-home-item.schema").AppHomeItem, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/app-home-item.schema").AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    deleteHome(id: string): Promise<{
        success: true;
    }>;
    subscriptionFeatures(): ({
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
    listSubscriptionPlans(): Promise<{
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
    createSubscriptionPlan(body: {
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
    patchSubscriptionPlan(id: string, body: Partial<{
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
    deleteSubscriptionPlan(id: string): Promise<{
        success: true;
    }>;
}
