import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommunityBenchmarkDocument = HydratedDocument<CommunityBenchmark>;

@Schema({
  collection: 'community_benchmarks',
  timestamps: true
})
export class CommunityBenchmark {
  @Prop({ required: true, enum: ['AM'], default: 'AM' })
  regionCode!: 'AM';

  @Prop({ required: true, trim: true, maxlength: 80 })
  categoryKey!: string;

  @Prop({ min: 0 })
  meanMinor?: number;

  @Prop({ min: 0 })
  medianMinor?: number;

  @Prop({ min: 0 })
  p75Minor?: number;

  @Prop({ required: true, min: 0 })
  sampleSize!: number;

  @Prop({ required: true, trim: true, match: /^\d{4}-(0[1-9]|1[0-2])$/ })
  periodMonth!: string;
}

export const CommunityBenchmarkSchema = SchemaFactory.createForClass(CommunityBenchmark);

CommunityBenchmarkSchema.index(
  { regionCode: 1, categoryKey: 1, periodMonth: 1 },
  { unique: true }
);
