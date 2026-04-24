import { Connection, Model } from 'mongoose';
import { Debt } from '../debts/schemas/debt.schema';
import { CreateTransactionDto } from './create-transaction.dto';
import { UpdateTransactionDto } from './update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
export declare class TransactionsService {
    private readonly transactionModel;
    private readonly debtModel;
    private readonly connection;
    constructor(transactionModel: Model<Transaction>, debtModel: Model<Debt>, connection: Connection);
    createTransaction(userId: string, dto: CreateTransactionDto): Promise<TransactionDocument>;
    listRecent(userId: string, limit?: number): Promise<TransactionDocument[]>;
    listFiltered(userId: string, options: {
        type?: 'expense' | 'income';
        category?: string;
        q?: string;
        limit: number;
        skip: number;
    }): Promise<TransactionDocument[]>;
    updateTransaction(userId: string, id: string, dto: UpdateTransactionDto): Promise<TransactionDocument>;
    deleteTransaction(userId: string, id: string): Promise<void>;
}
