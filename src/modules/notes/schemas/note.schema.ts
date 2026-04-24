import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type NoteDocument = HydratedDocument<Note>;

@Schema({
  collection: 'notes',
  timestamps: true
})
export class Note {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop()
  body?: string;

  @Prop({ required: true, min: 0 })
  totalObligationMinor!: number;

  @Prop({ required: true, min: 0 })
  projectedBalanceMinor!: number;

  @Prop({ required: true })
  dueDate!: Date;

  @Prop({ required: true, default: 'scheduled', enum: ['scheduled', 'done', 'cancelled'] })
  status!: 'scheduled' | 'done' | 'cancelled';

  @Prop({ required: true, default: false })
  aiWarningTriggered!: boolean;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

NoteSchema.index({ userId: 1, dueDate: 1 });
