import { HydratedDocument, Types } from 'mongoose';
export type NoteDocument = HydratedDocument<Note>;
export declare class Note {
    userId: Types.ObjectId;
    title: string;
    body?: string;
    totalObligationMinor: number;
    projectedBalanceMinor: number;
    dueDate: Date;
    status: 'scheduled' | 'done' | 'cancelled';
    aiWarningTriggered: boolean;
}
export declare const NoteSchema: import("mongoose").Schema<Note, import("mongoose").Model<Note, any, any, any, any, any, Note>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Note, import("mongoose").Document<unknown, {}, Note, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Note & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    body?: import("mongoose").SchemaDefinitionProperty<string | undefined, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalObligationMinor?: import("mongoose").SchemaDefinitionProperty<number, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    projectedBalanceMinor?: import("mongoose").SchemaDefinitionProperty<number, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dueDate?: import("mongoose").SchemaDefinitionProperty<Date, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"scheduled" | "done" | "cancelled", Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    aiWarningTriggered?: import("mongoose").SchemaDefinitionProperty<boolean, Note, import("mongoose").Document<unknown, {}, Note, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Note & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Note>;
