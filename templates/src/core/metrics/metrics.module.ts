import { Module } from '@nestjs/common';

import { MetricsCoreModule } from './metrics-core.module';

@Module({
  imports: [MetricsCoreModule],
})
export class MetricsModule {}
