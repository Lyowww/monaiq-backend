import { HydratedDocument } from 'mongoose';
export type AppHomeItemDocument = HydratedDocument<AppHomeItem>;
export declare class AppHomeItem {
    key: string;
    titleHy: string;
    titleEn: string;
    subtitleHy: string;
    subtitleEn: string;
    /** Expo-router path, e.g. /stats or /(app)/(tabs)/stats */
    route: string;
    iconName: string;
    sortOrder: number;
    enabled: boolean;
}
export declare const AppHomeItemSchema: import("mongoose").Schema<AppHomeItem, import("mongoose").Model<AppHomeItem, any, any, any, any, any, AppHomeItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AppHomeItem, import("mongoose").Document<unknown, {}, AppHomeItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AppHomeItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    key?: import("mongoose").SchemaDefinitionProperty<string, AppHomeItem, import("mongoose").Document<unknown, {}, AppHomeItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    titleHy?: import("mongoose").SchemaDefinitionProperty<string, AppHomeItem, import("mongoose").Document<unknown, {}, AppHomeItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    titleEn?: import("mongoose").SchemaDefinitionProperty<string, AppHomeItem, import("mongoose").Document<unknown, {}, AppHomeItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subtitleHy?: import("mongoose").SchemaDefinitionProperty<string, AppHomeItem, import("mongoose").Document<unknown, {}, AppHomeItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subtitleEn?: import("mongoose").SchemaDefinitionProperty<string, AppHomeItem, import("mongoose").Document<unknown, {}, AppHomeItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    route?: import("mongoose").SchemaDefinitionProperty<string, AppHomeItem, import("mongoose").Document<unknown, {}, AppHomeItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    iconName?: import("mongoose").SchemaDefinitionProperty<string, AppHomeItem, import("mongoose").Document<unknown, {}, AppHomeItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sortOrder?: import("mongoose").SchemaDefinitionProperty<number, AppHomeItem, import("mongoose").Document<unknown, {}, AppHomeItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    enabled?: import("mongoose").SchemaDefinitionProperty<boolean, AppHomeItem, import("mongoose").Document<unknown, {}, AppHomeItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AppHomeItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, AppHomeItem>;
