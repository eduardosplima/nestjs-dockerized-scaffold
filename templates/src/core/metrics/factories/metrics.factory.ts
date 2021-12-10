import type {
  PrometheusOptions,
  PrometheusOptionsFactory,
} from '@willsoto/nestjs-prometheus';

import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import metricsConfig from '../config/metrics.config';
import { MetricsController } from '../metrics.controller';

@Injectable()
export class MetricsFactory implements PrometheusOptionsFactory {
  constructor(
    @Inject(metricsConfig.KEY)
    private readonly config: ConfigType<typeof metricsConfig>,
  ) {}

  createPrometheusOptions(): PrometheusOptions | Promise<PrometheusOptions> {
    return {
      controller: MetricsController,
      path: this.config.path,
      defaultMetrics: this.config.defaultMetrics,
    };
  }
}
