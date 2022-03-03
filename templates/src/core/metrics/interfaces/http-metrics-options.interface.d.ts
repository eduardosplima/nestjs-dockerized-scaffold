export interface HttpMetricsOptions {
  /**
   * Metric name. Default name is `http_request_duration_seconds`.
   */
  name?: string;

  /**
   * Custom buckets for HTTP requests duration histogram.
   * Default buckets are `[0.005,0.01,0.025,0.05,0.1,0.25,0.5,1,2.5,5,10]` (in seconds).
   */
  buckets?: number[];

  /**
   * List of paths to ignore when collecting metrics.
   */
  ignorePaths?: string[];
}
