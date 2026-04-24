import { HydratedDocument, Types } from 'mongoose';
export type UserPreferenceDocument = HydratedDocument<UserPreference>;
export declare class UserPreference {
    userId: Types.ObjectId;
    appLanguage: 'en' | 'hy';
    ghostModeEnabled: boolean;
    pushNotificationsEnabled: boolean;
    fcmDeviceToken?: string;
    fcmTokenUpdatedAt?: Date;
    /** Net salary / periodic income anchor for “burn rate” (minor units) */
    monthlySalaryAnchorMinor?: number;
    lastGhostGestureAt?: Date;
}
export declare const UserPreferenceSchema: import("mongoose").Schema<UserPreference, import("mongoose").Model<UserPreference, any, any, any, any, any, UserPreference>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserPreference, import("mongoose").Document<unknown, {}, UserPreference, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<UserPreference & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, UserPreference, import("mongoose").Document<unknown, {}, UserPreference, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserPreference & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    appLanguage?: import("mongoose").SchemaDefinitionProperty<"en" | "hy", UserPreference, import("mongoose").Document<unknown, {}, UserPreference, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserPreference & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ghostModeEnabled?: import("mongoose").SchemaDefinitionProperty<boolean, UserPreference, import("mongoose").Document<unknown, {}, UserPreference, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserPreference & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    pushNotificationsEnabled?: import("mongoose").SchemaDefinitionProperty<boolean, UserPreference, import("mongoose").Document<unknown, {}, UserPreference, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserPreference & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fcmDeviceToken?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserPreference, import("mongoose").Document<unknown, {}, UserPreference, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserPreference & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fcmTokenUpdatedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, UserPreference, import("mongoose").Document<unknown, {}, UserPreference, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserPreference & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    monthlySalaryAnchorMinor?: import("mongoose").SchemaDefinitionProperty<number | undefined, UserPreference, import("mongoose").Document<unknown, {}, UserPreference, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserPreference & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastGhostGestureAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, UserPreference, import("mongoose").Document<unknown, {}, UserPreference, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserPreference & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, UserPreference>;
