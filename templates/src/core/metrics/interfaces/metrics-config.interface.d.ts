import type { HeapSizeLimitMetricsOptions } from './heap-size-limit-metrics-options';
import type { HttpMetricsOptions } from './http-metrics-options.interface';

export interface MetricsConfig<
  T extends HeapSizeLimitMetricsOptions | HttpMetricsOptions,
> {
  enabled: string;

  options?: T;
}
