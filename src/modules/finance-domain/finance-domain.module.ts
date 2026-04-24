import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiStructuredArtifact, AiStructuredArtifactSchema } from './schemas/ai-structured-artifact.schema';
import { CommunityBenchmark, CommunityBenchmarkSchema } from './schemas/community-benchmark.schema';
import { ContactLedger, ContactLedgerSchema } from './schemas/contact-ledger.schema';
import { Obligation, ObligationSchema } from './schemas/obligation.schema';
import { SavingsGoal, SavingsGoalSchema } from './schemas/savings-goal.schema';
import { UserPreference, UserPreferenceSchema } from './schemas/user-preference.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Obligation.name, schema: ObligationSchema },
      { name: SavingsGoal.name, schema: SavingsGoalSchema },
      { name: UserPreference.name, schema: UserPreferenceSchema },
      { name: ContactLedger.name, schema: ContactLedgerSchema },
      { name: AiStructuredArtifact.name, schema: AiStructuredArtifactSchema },
      { name: CommunityBenchmark.name, schema: CommunityBenchmarkSchema }
    ])
  ],
  exports: [MongooseModule]
})
export class FinanceDomainModule {}
