import type { AccessTokenClaims } from '../auth/auth.types';
import { AdminService } from './admin.service';
/** Authenticated users — resolved list for clients (DB + built-in fallbacks) */
export declare class AppHomeController {
    private readonly admin;
    constructor(admin: AdminService);
    items(_user: AccessTokenClaims): Promise<{
        id: string;
        key: string;
        titleHy: string;
        titleEn: string;
        subtitleHy: string;
        subtitleEn: string;
        route: string;
        iconName: string;
        sortOrder: number;
        enabled: boolean;
    }[]>;
}
