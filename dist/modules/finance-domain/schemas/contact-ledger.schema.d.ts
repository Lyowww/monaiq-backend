import { HydratedDocument, Types } from 'mongoose';
export type ContactLedgerDocument = HydratedDocument<ContactLedger>;
export declare class ContactLedger {
    userId: Types.ObjectId;
    contactDisplayName: string;
    contactPhoneE164?: string;
    lastInteractionAt?: Date;
    contactFrequencyScore: number;
    amountMinor: number;
    currencyCode: 'AMD';
    direction: 'borrowed' | 'lent';
    status: 'open' | 'settled' | 'disputed';
    lastReminderAt?: Date;
    reminderCount: number;
    lastReminderMessageHy?: string;
    lastReminderMessageEn?: string;
}
export declare const ContactLedgerSchema: import("mongoose").Schema<ContactLedger, import("mongoose").Model<ContactLedger, any, any, any, any, any, ContactLedger>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contactDisplayName?: import("mongoose").SchemaDefinitionProperty<string, ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contactPhoneE164?: import("mongoose").SchemaDefinitionProperty<string | undefined, ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastInteractionAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contactFrequencyScore?: import("mongoose").SchemaDefinitionProperty<number, ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amountMinor?: import("mongoose").SchemaDefinitionProperty<number, ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currencyCode?: import("mongoose").SchemaDefinitionProperty<"AMD", ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    direction?: import("mongoose").SchemaDefinitionProperty<"borrowed" | "lent", ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"settled" | "open" | "disputed", ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastReminderAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reminderCount?: import("mongoose").SchemaDefinitionProperty<number, ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastReminderMessageHy?: import("mongoose").SchemaDefinitionProperty<string | undefined, ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastReminderMessageEn?: import("mongoose").SchemaDefinitionProperty<string | undefined, ContactLedger, import("mongoose").Document<unknown, {}, ContactLedger, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ContactLedger & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ContactLedger>;
