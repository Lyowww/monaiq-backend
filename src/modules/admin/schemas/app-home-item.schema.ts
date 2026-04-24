import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppHomeItemDocument = HydratedDocument<AppHomeItem>;

@Schema({ collection: 'app_home_items', timestamps: true })
export class AppHomeItem {
  @Prop({ required: true, unique: true, trim: true, index: true })
  key!: string;

  @Prop({ required: true, trim: true })
  titleHy!: string;

  @Prop({ required: true, trim: true })
  titleEn!: string;

  @Prop({ required: true, trim: true })
  subtitleHy!: string;

  @Prop({ required: true, trim: true })
  subtitleEn!: string;

  /** Expo-router path, e.g. /stats or /(app)/(tabs)/stats */
  @Prop({ required: true, trim: true })
  route!: string;

  @Prop({ default: 'sparkles' })
  iconName!: string;

  @Prop({ default: 0 })
  sortOrder!: number;

  @Prop({ default: true, index: true })
  enabled!: boolean;
}

export const AppHomeItemSchema = SchemaFactory.createForClass(AppHomeItem);
