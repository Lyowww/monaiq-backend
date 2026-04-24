import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly subscriptionPlans: SubscriptionPlansService
  ) {}

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async updateProfile(userId: string, dto: UpdateUserProfileDto): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (dto.firstName !== undefined) {
      user.firstName = dto.firstName;
    }
    if (dto.lastName !== undefined) {
      user.lastName = dto.lastName;
    }
    if (dto.currencyCode !== undefined) {
      user.currencyCode = dto.currencyCode;
    }
    if (dto.settings) {
      let nextSubscription = dto.settings.subscription ?? user.settings?.subscription ?? 'free';
      let nextPlanKey = user.settings?.subscriptionPlanKey;

      if (dto.settings.subscriptionPlanKey !== undefined) {
        const v = dto.settings.subscriptionPlanKey;
        if (v === null || (typeof v === 'string' && v.trim() === '')) {
          nextPlanKey = undefined;
          nextSubscription = 'free';
        } else {
          await this.subscriptionPlans.assertActivePlanKey(v);
          nextPlanKey = v.trim().toLowerCase();
          nextSubscription = 'premium';
        }
      } else if (dto.settings.subscription === 'free') {
        nextPlanKey = undefined;
        nextSubscription = 'free';
      }

      user.settings = {
        lowBalanceThresholdMinor:
          dto.settings.lowBalanceThresholdMinor ?? user.settings?.lowBalanceThresholdMinor ?? 0,
        notificationPayments:
          dto.settings.notificationPayments ?? user.settings?.notificationPayments ?? true,
        notificationDebts: dto.settings.notificationDebts ?? user.settings?.notificationDebts ?? true,
        notificationLowBalance:
          dto.settings.notificationLowBalance ?? user.settings?.notificationLowBalance ?? true,
        notificationUnusualSpending:
          dto.settings.notificationUnusualSpending ?? user.settings?.notificationUnusualSpending ?? true,
        subscription: nextSubscription,
        subscriptionPlanKey: nextPlanKey
      };
    }
    return user.save();
  }

  async create(input: CreateUserInput, session?: ClientSession): Promise<UserDocument> {
    const createdUsers = await this.userModel.create(
      [
        {
          email: input.email,
          passwordHash: input.passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          dateOfBirth: input.dateOfBirth,
          isAdmin: input.isAdmin === true,
          currencyCode: 'AMD',
          locale: 'hy-AM',
          isEmailVerified: false
        }
      ],
      { session }
    );

    const createdUser = createdUsers[0];
    if (!createdUser) {
      throw new Error('Failed to create user');
    }

    return createdUser;
  }
}
