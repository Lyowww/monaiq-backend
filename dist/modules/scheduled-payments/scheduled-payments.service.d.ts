import { Connection, Model } from 'mongoose';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { CreateScheduledPaymentDto, MarkPaymentPaidDto, UpdateScheduledPaymentDto } from './payment.dto';
import { ScheduledPayment, ScheduledPaymentDocument } from './schemas/scheduled-payment.schema';
export declare class ScheduledPaymentsService {
    private readonly paymentModel;
    private readonly transactionModel;
    private readonly connection;
    constructor(paymentModel: Model<ScheduledPayment>, transactionModel: Model<Transaction>, connection: Connection);
    listForUser(userId: string): Promise<ScheduledPaymentDocument[]>;
    getById(userId: string, id: string): Promise<ScheduledPaymentDocument>;
    create(userId: string, dto: CreateScheduledPaymentDto): Promise<ScheduledPaymentDocument>;
    update(userId: string, id: string, dto: UpdateScheduledPaymentDto): Promise<ScheduledPaymentDocument>;
    remove(userId: string, id: string): Promise<void>;
    markPaid(userId: string, id: string, dto: MarkPaymentPaidDto): Promise<ScheduledPaymentDocument>;
}
