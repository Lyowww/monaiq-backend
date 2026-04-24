import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type AuthSessionDocument = HydratedDocument<AuthSession>;

@Schema({
  collection: 'auth_sessions',
  timestamps: true
})
export class AuthSession {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, index: true })
  familyId!: string;

  @Prop({ required: true })
  deviceName!: string;

  @Prop({ required: true })
  refreshTokenHash!: string;

  @Prop()
  userAgent?: string;

  @Prop()
  ipAddress?: string;

  @Prop({ required: true, index: true })
  expiresAt!: Date;

  @Prop()
  lastUsedAt?: Date;

  @Prop()
  revokedAt?: Date;
}

export const AuthSessionSchema = SchemaFactory.createForClass(AuthSession);

AuthSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
AuthSessionSchema.index({ userId: 1, familyId: 1 });
