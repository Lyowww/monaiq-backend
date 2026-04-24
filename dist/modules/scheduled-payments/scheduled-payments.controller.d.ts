import type { AccessTokenClaims } from '../auth/auth.types';
import { CreateScheduledPaymentDto, MarkPaymentPaidDto, UpdateScheduledPaymentDto } from './payment.dto';
import { ScheduledPaymentsService } from './scheduled-payments.service';
export declare class ScheduledPaymentsController {
    private readonly scheduledPaymentsService;
    constructor(scheduledPaymentsService: ScheduledPaymentsService);
    list(claims: AccessTokenClaims): Promise<import("@ai-finance/shared-types").ScheduledPaymentRecord[]>;
    getOne(claims: AccessTokenClaims, id: string): Promise<import("@ai-finance/shared-types").ScheduledPaymentRecord>;
    create(claims: AccessTokenClaims, dto: CreateScheduledPaymentDto): Promise<import("@ai-finance/shared-types").ScheduledPaymentRecord>;
    update(claims: AccessTokenClaims, id: string, dto: UpdateScheduledPaymentDto): Promise<import("@ai-finance/shared-types").ScheduledPaymentRecord>;
    markPaid(claims: AccessTokenClaims, id: string, dto: MarkPaymentPaidDto): Promise<import("@ai-finance/shared-types").ScheduledPaymentRecord>;
    remove(claims: AccessTokenClaims, id: string): Promise<{
        success: true;
    }>;
}
