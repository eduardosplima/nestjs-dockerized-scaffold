import type { PrometheusDefaultMetrics } from '@willsoto/nestjs-prometheus';

import { registerAs } from '@nestjs/config';

import type { HeapSizeLimitMetricsOptions } from '../interfaces/heap-size-limit-metrics-options';
import type { HttpMetricsOptions } from '../interfaces/http-metrics-options.interface';
import type { MetricsConfig } from '../interfaces/metrics-config.interface';

export default registerAs('core-metrics-config', () => ({
  path: process.env.METRICS_PATH,

  defaultMetrics: JSON.parse(
    process.env.METRICS_DEFAULT,
  ) as PrometheusDefaultMetrics,

  heapSizeLimitMetrics: JSON.parse(
    process.env.METRICS_HEAP_SIZE_LIMIT,
  ) as MetricsConfig<HeapSizeLimitMetricsOptions>,
  httpMetrics: JSON.parse(
    process.env.METRICS_HTTP,
  ) as MetricsConfig<HttpMetricsOptions>,
}));
