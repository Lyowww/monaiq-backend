import { Model } from 'mongoose';
import { UserPreferenceDocument } from '../finance-domain/schemas/user-preference.schema';
export declare class UserPreferencesService {
    private readonly prefModel;
    constructor(prefModel: Model<UserPreferenceDocument>);
    setFcmToken(userId: string, token: string, pushEnabled?: boolean): Promise<void>;
    getPushTarget(userId: string): Promise<{
        token: string;
    } | null>;
    clearFcmDeviceToken(userId: string): Promise<void>;
}
