import { Model, Types } from 'mongoose';
import { type UserDocument } from '../users/schemas/user.schema';
import { type TransactionDocument } from '../transactions/schemas/transaction.schema';
import { type AiChatLogDocument } from '../ai/ai-chat-log.schema';
import { AppHomeItem, type AppHomeItemDocument } from './schemas/app-home-item.schema';
export declare class AdminService {
    private readonly userModel;
    private readonly txModel;
    private readonly aiLogModel;
    private readonly homeItemModel;
    constructor(userModel: Model<UserDocument>, txModel: Model<TransactionDocument>, aiLogModel: Model<AiChatLogDocument>, homeItemModel: Model<AppHomeItemDocument>);
    dashboardSummary(): Promise<{
        users: number;
        transactions: number;
        aiChatMessages: number;
        aiChatMessagesToday: number;
        lastActivityAt: string | null;
    }>;
    listAiLogs(limit: number): Promise<{
        id: string;
        userId: string;
        messagePreview: string;
        charCount: number;
        createdAt: string;
    }[]>;
    listHomeItemsResolved(): Promise<{
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
    private mergedHomeItems;
    adminListHome(): Promise<(import("mongoose").Document<unknown, {}, AppHomeItem, {}, import("mongoose").DefaultSchemaOptions> & AppHomeItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    createHomeItem(body: {
        key: string;
        titleHy: string;
        titleEn: string;
        subtitleHy: string;
        subtitleEn: string;
        route: string;
        iconName?: string;
        sortOrder?: number;
        enabled?: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppHomeItem, {}, import("mongoose").DefaultSchemaOptions> & AppHomeItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, AppHomeItem, {}, import("mongoose").DefaultSchemaOptions> & AppHomeItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    patchHomeItem(id: string, patch: Partial<{
        titleHy: string;
        titleEn: string;
        subtitleHy: string;
        subtitleEn: string;
        route: string;
        iconName: string;
        sortOrder: number;
        enabled: boolean;
    }>): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppHomeItem, {}, import("mongoose").DefaultSchemaOptions> & AppHomeItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, AppHomeItem, {}, import("mongoose").DefaultSchemaOptions> & AppHomeItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    deleteHomeItem(id: string): Promise<{
        success: true;
    }>;
}
