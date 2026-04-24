"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_FREE_SUBSCRIPTION_FEATURE_IDS = exports.SUBSCRIPTION_FEATURES = void 0;
exports.isValidFeatureId = isValidFeatureId;
exports.assertFeatureIds = assertFeatureIds;
/** Canonical feature ids for subscription plans (admin UI + API validation). */
exports.SUBSCRIPTION_FEATURES = [
    {
        id: 'ai_assistant_extended',
        title: 'Extended AI assistant',
        description: 'Higher daily limits and longer context for finance Q&A.',
        icon: 'sparkles'
    },
    {
        id: 'advanced_analytics',
        title: 'Advanced analytics',
        description: 'Trends, category breakdowns, and custom date ranges.',
        icon: 'line-chart'
    },
    {
        id: 'smart_insights',
        title: 'Smart insights',
        description: 'Automated summaries and unusual-spending detection.',
        icon: 'lightbulb'
    },
    {
        id: 'debt_tools_pro',
        title: 'Pro debt tools',
        description: 'Snowball / avalanche planners and payoff simulations.',
        icon: 'layers'
    },
    {
        id: 'scheduled_payments_sync',
        title: 'Scheduled payments',
        description: 'Reminders and calendar sync for bills & subscriptions.',
        icon: 'calendar-clock'
    },
    {
        id: 'export_reports',
        title: 'Exports & reports',
        description: 'CSV / PDF exports for transactions and tax prep.',
        icon: 'file-down'
    },
    {
        id: 'multi_currency',
        title: 'Multi-currency',
        description: 'Hold and convert AMD, USD, and EUR with live rates.',
        icon: 'coins'
    },
    {
        id: 'custom_categories',
        title: 'Custom categories & rules',
        description: 'Unlimited categories and auto-tagging rules.',
        icon: 'tags'
    },
    {
        id: 'priority_support',
        title: 'Priority support',
        description: 'Faster responses from the MonAIQ team.',
        icon: 'headphones'
    },
    {
        id: 'early_access',
        title: 'Early access',
        description: 'Try new assistant models and beta features first.',
        icon: 'rocket'
    }
];
/** Every signed-in user gets these without a paid plan (add-on features require a plan). */
exports.BASE_FREE_SUBSCRIPTION_FEATURE_IDS = [
    'ai_assistant_extended',
    'smart_insights'
];
const FEATURE_ID_SET = new Set(exports.SUBSCRIPTION_FEATURES.map((f) => f.id));
function isValidFeatureId(id) {
    return FEATURE_ID_SET.has(id);
}
function assertFeatureIds(ids) {
    const bad = ids.filter((id) => !isValidFeatureId(id));
    if (bad.length > 0) {
        throw new Error(`Unknown feature ids: ${bad.join(', ')}`);
    }
}
//# sourceMappingURL=subscription-features.catalog.js.map