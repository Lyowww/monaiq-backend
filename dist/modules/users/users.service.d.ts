import { ClientSession, Model } from 'mongoose';
import { SubscriptionPlansService } from '../admin/subscription-plans.service';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserProfileDto } from './user.dto';
export interface CreateUserInput {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    isAdmin?: boolean;
}
export declare class UsersService {
    private readonly userModel;
    private readonly subscriptionPlans;
    constructor(userModel: Model<User>, subscriptionPlans: SubscriptionPlansService);
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    updateProfile(userId: string, dto: UpdateUserProfileDto): Promise<UserDocument>;
    create(input: CreateUserInput, session?: ClientSession): Promise<UserDocument>;
}
