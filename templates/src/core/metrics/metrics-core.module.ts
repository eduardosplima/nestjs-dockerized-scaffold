import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { Module } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';
import { HttpAdapterHost, ModuleRef } from '@nestjs/core';

import metricsConfig from './config/metrics.config';
import { MetricsFactory } from './factories/metrics.factory';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  imports: [
    PrometheusModule.registerAsync({
      imports: [ConfigModule.forFeature(metricsConfig)],
      useClass: MetricsFactory,
      controller: MetricsController,
    }),
  ],
})
export class MetricsCoreModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  onModuleInit(): void {
    const config: ConfigType<typeof metricsConfig> = this.moduleRef.get(
      metricsConfig.KEY,
      { strict: false },
    );

    const hasCustomMetricsEnabled =
      config.httpMetrics.enabled || config.heapSizeLimitMetrics.enabled;

    if (hasCustomMetricsEnabled) {
      const metricsService = new MetricsService();

      if (config.httpMetrics.enabled) {
        metricsService.setupHttpMetricsHistogram(config.httpMetrics.options);
        metricsService.collectHttpMetrics(
          this.adapterHost,
          config.httpMetrics.options.ignorePaths,
        );
      }

      if (config.heapSizeLimitMetrics.enabled) {
        metricsService.setupHeapSizeLimitMetricsGauge(
          config.heapSizeLimitMetrics.options,
        );
        metricsService.collectHeapSizeLimit();
      }
    }
  }
}
