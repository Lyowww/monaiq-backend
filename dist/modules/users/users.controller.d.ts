import type { AccessTokenClaims } from '../auth/auth.types';
import { RegisterPushTokenDto, UpdateUserProfileDto } from './user.dto';
import { SubscriptionPlansService } from '../admin/subscription-plans.service';
import { UserPreferencesService } from './user-preferences.service';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    private readonly userPreferencesService;
    private readonly subscriptionPlans;
    constructor(usersService: UsersService, userPreferencesService: UserPreferencesService, subscriptionPlans: SubscriptionPlansService);
    me(claims: AccessTokenClaims): Promise<{
        entitledFeatureIds: string[];
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        currencyCode: import("@ai-finance/shared-types").CurrencyCode;
        locale: string;
        dateOfBirth: string;
        isEmailVerified: boolean;
        isAdmin?: boolean;
        settings?: import("@ai-finance/shared-types").UserSettings;
    }>;
    patchMe(claims: AccessTokenClaims, dto: UpdateUserProfileDto): Promise<{
        entitledFeatureIds: string[];
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        currencyCode: import("@ai-finance/shared-types").CurrencyCode;
        locale: string;
        dateOfBirth: string;
        isEmailVerified: boolean;
        isAdmin?: boolean;
        settings?: import("@ai-finance/shared-types").UserSettings;
    }>;
    registerPushToken(claims: AccessTokenClaims, dto: RegisterPushTokenDto): Promise<void>;
}
