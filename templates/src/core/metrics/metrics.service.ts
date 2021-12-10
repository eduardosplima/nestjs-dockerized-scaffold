import { getOrCreateMetric } from '@willsoto/nestjs-prometheus';
import type { FastifyInstance } from 'fastify';
import type { Gauge, Histogram } from 'prom-client';
import { getHeapStatistics } from 'v8';

import type { HttpAdapterHost } from '@nestjs/core';

import type { HeapSizeLimitMetricsOptions } from './interfaces/heap-size-limit-metrics-options';
import type { HttpMetricsOptions } from './interfaces/http-metrics-options.interface';

export class MetricsService {
  private httpMetricsHistogram: Histogram<'status'>;

  private heapSizeLimitMetricsGauge: Gauge<never>;

  private static normalizeStatusCode(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return '2xx';
    if (statusCode >= 300 && statusCode < 400) return '3xx';
    if (statusCode >= 400 && statusCode < 500) return '4xx';

    return '5xx';
  }

  setupHttpMetricsHistogram(config: HttpMetricsOptions): void {
    const name = config?.name || 'http_request_duration_seconds';

    const buckets = config?.buckets || [
      0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10,
    ];

    this.httpMetricsHistogram = getOrCreateMetric('Histogram', {
      name,
      help: 'HTTP requests duration (s) by status',
      labelNames: ['status'],
      buckets,
    }) as Histogram<'status'>;
  }

  collectHttpMetrics(
    adapterHost: HttpAdapterHost,
    ignorePaths: Array<string>,
  ): void {
    const fastify = adapterHost.httpAdapter.getInstance<FastifyInstance>();
    fastify.addHook('onResponse', (request, reply, done) => {
      if (!ignorePaths.some((path) => request.url.startsWith(path))) {
        this.httpMetricsHistogram.observe(
          {
            status: MetricsService.normalizeStatusCode(reply.statusCode),
          },
          reply.getResponseTime() / 1000,
        );
      }
      done();
    });
  }

  setupHeapSizeLimitMetricsGauge(config: HeapSizeLimitMetricsOptions): void {
    const name = config?.name || 'v8_heap_size_limit';

    this.heapSizeLimitMetricsGauge = getOrCreateMetric('Gauge', {
      name,
      help: 'V8 heap size limit in bytes',
    }) as Gauge<never>;
  }

  collectHeapSizeLimit(): void {
    this.heapSizeLimitMetricsGauge.set({}, getHeapStatistics().heap_size_limit);
  }
}
