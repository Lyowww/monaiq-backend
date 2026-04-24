import { Model } from 'mongoose';
import { Debt, DebtDocument } from './schemas/debt.schema';
import { CreateDebtDto, UpdateDebtDto } from './debt.dto';
export declare class DebtsService {
    private readonly debtModel;
    constructor(debtModel: Model<Debt>);
    listForUser(userId: string, debtType?: 'I_OWE' | 'THEY_OWE'): Promise<DebtDocument[]>;
    getById(userId: string, id: string): Promise<DebtDocument>;
    create(userId: string, dto: CreateDebtDto): Promise<DebtDocument>;
    update(userId: string, id: string, dto: UpdateDebtDto): Promise<DebtDocument>;
    remove(userId: string, id: string): Promise<void>;
}
