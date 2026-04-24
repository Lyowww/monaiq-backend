import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WaitlistEntryDocument = HydratedDocument<WaitlistEntry>;

@Schema({ timestamps: true, collection: 'waitlist_entries' })
export class WaitlistEntry {
  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email!: string;
}

export const WaitlistEntrySchema = SchemaFactory.createForClass(WaitlistEntry);
