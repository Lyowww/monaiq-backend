import { AdminDataService } from './admin-data.service';
export declare class AdminDataController {
    private readonly adminData;
    constructor(adminData: AdminDataService);
    listCollections(): {
        collections: import("./admin-data.service").AdminCollectionMeta[];
    };
    list(collection: string, page?: string, pageSize?: string): Promise<{
        collection: string;
        page: number;
        pageSize: number;
        total: number;
        items: unknown[];
    }>;
    getOne(collection: string, id: string): Promise<unknown>;
    create(collection: string, body: Record<string, unknown>): Promise<unknown>;
    patch(collection: string, id: string, body: Record<string, unknown>): Promise<unknown>;
    remove(collection: string, id: string): Promise<{
        success: true;
    }>;
}
