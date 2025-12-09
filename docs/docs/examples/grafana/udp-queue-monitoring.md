---
outline: deep
---

# UDP Queue Monitoring in Grafana

::: tip New in v13.1
UDP queue metrics were introduced in Butler SOS v13.1.
:::

This page provides example Flux queries for monitoring Butler SOS UDP queue health in Grafana dashboards.

## Prerequisites

1. Butler SOS v13.1 or later
2. Queue metrics enabled in configuration:

```yaml
Butler-SOS:
  userEvents:
    udpServerConfig:
      queueMetrics:
        influxdb:
          enable: true
          measurementName: user_events_queue

  logEvents:
    udpServerConfig:
      queueMetrics:
        influxdb:
          enable: true
          measurementName: log_events_queue
```

3. InfluxDB v2 (the queries below use Flux query language)

## Example Queries

### Queue Utilization Over Time

Monitor how full the queues are. High utilization (>80%) indicates potential message processing issues.

```flux
from(bucket: "butler-sos")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "user_events_queue" or r["_measurement"] == "log_events_queue")
  |> filter(fn: (r) => r["_field"] == "queue_utilization_pct")
  |> aggregateWindow(every: 1m, fn: mean)
```

### Messages Dropped by Reason

Track why messages are being dropped. Useful for identifying rate limiting, queue capacity, or message size issues.

```flux
from(bucket: "butler-sos")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "user_events_queue")
  |> filter(fn: (r) => r["_field"] == "messages_dropped_rate_limit"
    or r["_field"] == "messages_dropped_queue_full"
    or r["_field"] == "messages_dropped_size")
  |> aggregateWindow(every: 1m, fn: sum)
```

### Processing Time Percentiles

Monitor message processing performance. High processing times may indicate downstream system issues.

```flux
from(bucket: "butler-sos")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "log_events_queue")
  |> filter(fn: (r) => r["_field"] == "processing_time_avg_ms"
    or r["_field"] == "processing_time_p95_ms"
    or r["_field"] == "processing_time_max_ms")
  |> aggregateWindow(every: 1m, fn: mean)
```

### Backpressure Events

Identify when backpressure was active (queue utilization exceeded threshold).

```flux
from(bucket: "butler-sos")
  |> range(start: -24h)
  |> filter(fn: (r) => r["_measurement"] == "user_events_queue" or r["_measurement"] == "log_events_queue")
  |> filter(fn: (r) => r["_field"] == "backpressure_active")
  |> filter(fn: (r) => r["_value"] == 1)
```

### Message Throughput

Compare received vs processed messages to see if the queue is keeping up.

```flux
from(bucket: "butler-sos")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "user_events_queue")
  |> filter(fn: (r) => r["_field"] == "messages_received" or r["_field"] == "messages_processed")
  |> aggregateWindow(every: 1m, fn: sum)
```

### Current Queue Size

Real-time view of how many messages are waiting in the queue.

```flux
from(bucket: "butler-sos")
  |> range(start: -5m)
  |> filter(fn: (r) => r["_measurement"] == "user_events_queue" or r["_measurement"] == "log_events_queue")
  |> filter(fn: (r) => r["_field"] == "queue_size")
  |> last()
```

### Rate Limit Status

Monitor current message rate when rate limiting is enabled.

```flux
from(bucket: "butler-sos")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "log_events_queue")
  |> filter(fn: (r) => r["_field"] == "rate_limit_current")
  |> aggregateWindow(every: 1m, fn: max)
```

## Recommended Dashboard Panels

Create a comprehensive UDP queue monitoring dashboard with these panels:

| Panel Type         | Metric                                    | Description                            |
| ------------------ | ----------------------------------------- | -------------------------------------- |
| **Gauge**          | `queue_utilization_pct`                   | Current queue utilization (0-100%)     |
| **Stat**           | `queue_size`                              | Current messages waiting in queue      |
| **Time series**    | `queue_utilization_pct`                   | Queue utilization trend over time      |
| **Time series**    | `messages_received`, `messages_processed` | Throughput comparison                  |
| **Stacked area**   | `messages_dropped_*`                      | Dropped messages by reason             |
| **Time series**    | `processing_time_*`                       | Processing time trends (avg, p95, max) |
| **State timeline** | `backpressure_active`                     | When backpressure was triggered        |

## Alerting Recommendations

Consider creating alerts for:

1. **Queue Full Alert**: Trigger when `queue_utilization_pct > 90` for more than 5 minutes
2. **Dropped Messages Alert**: Trigger when `messages_dropped_total > 100` per minute
3. **Backpressure Alert**: Trigger when `backpressure_active = 1` for more than 10 minutes
4. **Processing Degradation**: Trigger when `processing_time_p95_ms > 2000` consistently

## Related Documentation

- [UDP Queue Metrics Concept](/docs/concepts/monitoring/udp-queue-metrics) - Understanding queue metrics
- [InfluxDB Metrics Reference](/docs/reference/available-metrics/influxdb#udp-queue-metrics) - Complete field reference
- [User Events Setup](/docs/getting-started/setup/qlik-sense-events/user-events) - Queue configuration
- [Log Events Setup](/docs/getting-started/setup/qlik-sense-events/log-events) - Queue configuration
