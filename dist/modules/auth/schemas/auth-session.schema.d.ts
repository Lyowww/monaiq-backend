import { HydratedDocument, Types } from 'mongoose';
export type AuthSessionDocument = HydratedDocument<AuthSession>;
export declare class AuthSession {
    userId: Types.ObjectId;
    familyId: string;
    deviceName: string;
    refreshTokenHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
    lastUsedAt?: Date;
    revokedAt?: Date;
}
export declare const AuthSessionSchema: import("mongoose").Schema<AuthSession, import("mongoose").Model<AuthSession, any, any, any, any, any, AuthSession>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AuthSession, import("mongoose").Document<unknown, {}, AuthSession, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AuthSession & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AuthSession, import("mongoose").Document<unknown, {}, AuthSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuthSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    familyId?: import("mongoose").SchemaDefinitionProperty<string, AuthSession, import("mongoose").Document<unknown, {}, AuthSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuthSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deviceName?: import("mongoose").SchemaDefinitionProperty<string, AuthSession, import("mongoose").Document<unknown, {}, AuthSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuthSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    refreshTokenHash?: import("mongoose").SchemaDefinitionProperty<string, AuthSession, import("mongoose").Document<unknown, {}, AuthSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuthSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userAgent?: import("mongoose").SchemaDefinitionProperty<string | undefined, AuthSession, import("mongoose").Document<unknown, {}, AuthSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuthSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ipAddress?: import("mongoose").SchemaDefinitionProperty<string | undefined, AuthSession, import("mongoose").Document<unknown, {}, AuthSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuthSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expiresAt?: import("mongoose").SchemaDefinitionProperty<Date, AuthSession, import("mongoose").Document<unknown, {}, AuthSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuthSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastUsedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, AuthSession, import("mongoose").Document<unknown, {}, AuthSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuthSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    revokedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, AuthSession, import("mongoose").Document<unknown, {}, AuthSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AuthSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, AuthSession>;
