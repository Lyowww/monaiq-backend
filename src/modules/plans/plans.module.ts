import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FinancialPlan, FinancialPlanSchema } from './schemas/financial-plan.schema';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: FinancialPlan.name, schema: FinancialPlanSchema }])],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService]
})
export class PlansModule {}
