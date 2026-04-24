import { DashboardService } from './dashboard.service';
import type { AccessTokenClaims } from '../auth/auth.types';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    summary(claims: AccessTokenClaims): Promise<import("@ai-finance/shared-types").DashboardSummary>;
}
