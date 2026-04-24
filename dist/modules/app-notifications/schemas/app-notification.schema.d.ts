import { HydratedDocument, Types } from 'mongoose';
export type AppNotificationDocument = HydratedDocument<AppNotification>;
export declare class AppNotification {
    userId: Types.ObjectId;
    type: 'payment_due' | 'debt_due' | 'low_balance' | 'unusual_spending' | 'insight' | 'general';
    title: string;
    message: string;
    scheduledAt: Date;
    isRead: boolean;
}
export declare const AppNotificationSchema: import("mongoose").Schema<AppNotification, import("mongoose").Model<AppNotification, any, any, any, any, any, AppNotification>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AppNotification, import("mongoose").Document<unknown, {}, AppNotification, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AppNotification & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AppNotification, import("mongoose").Document<unknown, {}, AppNotification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppNotification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<"general" | "payment_due" | "debt_due" | "low_balance" | "unusual_spending" | "insight", AppNotification, import("mongoose").Document<unknown, {}, AppNotification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppNotification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, AppNotification, import("mongoose").Document<unknown, {}, AppNotification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppNotification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    message?: import("mongoose").SchemaDefinitionProperty<string, AppNotification, import("mongoose").Document<unknown, {}, AppNotification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppNotification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scheduledAt?: import("mongoose").SchemaDefinitionProperty<Date, AppNotification, import("mongoose").Document<unknown, {}, AppNotification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppNotification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isRead?: import("mongoose").SchemaDefinitionProperty<boolean, AppNotification, import("mongoose").Document<unknown, {}, AppNotification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppNotification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, AppNotification>;
