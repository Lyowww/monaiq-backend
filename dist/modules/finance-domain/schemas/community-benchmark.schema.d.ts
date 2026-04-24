import { HydratedDocument } from 'mongoose';
export type CommunityBenchmarkDocument = HydratedDocument<CommunityBenchmark>;
export declare class CommunityBenchmark {
    regionCode: 'AM';
    categoryKey: string;
    meanMinor?: number;
    medianMinor?: number;
    p75Minor?: number;
    sampleSize: number;
    periodMonth: string;
}
export declare const CommunityBenchmarkSchema: import("mongoose").Schema<CommunityBenchmark, import("mongoose").Model<CommunityBenchmark, any, any, any, any, any, CommunityBenchmark>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CommunityBenchmark, import("mongoose").Document<unknown, {}, CommunityBenchmark, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CommunityBenchmark & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    regionCode?: import("mongoose").SchemaDefinitionProperty<"AM", CommunityBenchmark, import("mongoose").Document<unknown, {}, CommunityBenchmark, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CommunityBenchmark & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    categoryKey?: import("mongoose").SchemaDefinitionProperty<string, CommunityBenchmark, import("mongoose").Document<unknown, {}, CommunityBenchmark, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CommunityBenchmark & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    meanMinor?: import("mongoose").SchemaDefinitionProperty<number | undefined, CommunityBenchmark, import("mongoose").Document<unknown, {}, CommunityBenchmark, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CommunityBenchmark & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    medianMinor?: import("mongoose").SchemaDefinitionProperty<number | undefined, CommunityBenchmark, import("mongoose").Document<unknown, {}, CommunityBenchmark, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CommunityBenchmark & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    p75Minor?: import("mongoose").SchemaDefinitionProperty<number | undefined, CommunityBenchmark, import("mongoose").Document<unknown, {}, CommunityBenchmark, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CommunityBenchmark & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sampleSize?: import("mongoose").SchemaDefinitionProperty<number, CommunityBenchmark, import("mongoose").Document<unknown, {}, CommunityBenchmark, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CommunityBenchmark & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    periodMonth?: import("mongoose").SchemaDefinitionProperty<string, CommunityBenchmark, import("mongoose").Document<unknown, {}, CommunityBenchmark, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CommunityBenchmark & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CommunityBenchmark>;
