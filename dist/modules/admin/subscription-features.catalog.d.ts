/** Canonical feature ids for subscription plans (admin UI + API validation). */
export declare const SUBSCRIPTION_FEATURES: readonly [{
    readonly id: "ai_assistant_extended";
    readonly title: "Extended AI assistant";
    readonly description: "Higher daily limits and longer context for finance Q&A.";
    readonly icon: "sparkles";
}, {
    readonly id: "advanced_analytics";
    readonly title: "Advanced analytics";
    readonly description: "Trends, category breakdowns, and custom date ranges.";
    readonly icon: "line-chart";
}, {
    readonly id: "smart_insights";
    readonly title: "Smart insights";
    readonly description: "Automated summaries and unusual-spending detection.";
    readonly icon: "lightbulb";
}, {
    readonly id: "debt_tools_pro";
    readonly title: "Pro debt tools";
    readonly description: "Snowball / avalanche planners and payoff simulations.";
    readonly icon: "layers";
}, {
    readonly id: "scheduled_payments_sync";
    readonly title: "Scheduled payments";
    readonly description: "Reminders and calendar sync for bills & subscriptions.";
    readonly icon: "calendar-clock";
}, {
    readonly id: "export_reports";
    readonly title: "Exports & reports";
    readonly description: "CSV / PDF exports for transactions and tax prep.";
    readonly icon: "file-down";
}, {
    readonly id: "multi_currency";
    readonly title: "Multi-currency";
    readonly description: "Hold and convert AMD, USD, and EUR with live rates.";
    readonly icon: "coins";
}, {
    readonly id: "custom_categories";
    readonly title: "Custom categories & rules";
    readonly description: "Unlimited categories and auto-tagging rules.";
    readonly icon: "tags";
}, {
    readonly id: "priority_support";
    readonly title: "Priority support";
    readonly description: "Faster responses from the MonAIQ team.";
    readonly icon: "headphones";
}, {
    readonly id: "early_access";
    readonly title: "Early access";
    readonly description: "Try new assistant models and beta features first.";
    readonly icon: "rocket";
}];
export type SubscriptionFeatureId = (typeof SUBSCRIPTION_FEATURES)[number]['id'];
/** Every signed-in user gets these without a paid plan (add-on features require a plan). */
export declare const BASE_FREE_SUBSCRIPTION_FEATURE_IDS: ReadonlyArray<SubscriptionFeatureId>;
export declare function isValidFeatureId(id: string): boolean;
export declare function assertFeatureIds(ids: string[]): void;
