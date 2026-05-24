---
outline: deep
---

# Failed Polls

Butler SOS polls Qlik Sense servers for health metrics, proxy session snapshots, and optionally app names. When one of those polls fails, Butler SOS can write an explicit error event to InfluxDB.

This matters because missing metrics do not tell you whether a server was idle, healthy, unreachable, or rejecting requests. Failed-poll tracking gives you a positive signal that the poll itself failed.

## What counts as a failed poll?

Butler SOS writes one InfluxDB point per failed polling attempt for these sources:

- `HEALTH_API`: Failed calls to the Qlik Sense health check API at `/engine/healthcheck`
- `PROXY_API`: Failed calls to the Qlik Sense proxy session API used for session snapshots
- `APP_NAMES_EXTRACT`: Failed app-name extraction from the Qlik Sense Repository Service (QRS)

These events are written through the shared error-tracking pipeline, but they represent a specific monitoring use case: Butler SOS could not collect data it expected to poll from a Qlik Sense server.

## How it is stored

Failed polls are stored in the InfluxDB measurement configured by `Butler-SOS.errorTracking.influxdb.measurementName`.

By default that measurement is:

```text
butler_sos_errors
```

To isolate failed polls from other Butler SOS errors, filter on the `error_type` tag:

- `HEALTH_API`
- `PROXY_API`
- `APP_NAMES_EXTRACT`

For proxy-session failures, Butler SOS also includes the `virtual_proxy` tag.

## Configuration

There is no separate `failedPolls` config section. Failed-poll tracking is enabled by turning on InfluxDB-backed error tracking:

```yaml
Butler-SOS:
  errorTracking:
    enable: true
    influxdb:
      enable: true
      measurementName: butler_sos_errors
```

The poll frequency still comes from each source feature:

- `Butler-SOS.serversToMonitor.pollingInterval` for health checks
- `Butler-SOS.userSessions.pollingInterval` for proxy-session snapshots
- `Butler-SOS.appNames.extractInterval` for app-name extraction

If `errorTracking.enable` or `errorTracking.influxdb.enable` is `false`, failed polls are still logged locally but no InfluxDB points are written.

## Typical use cases

- Alert when a specific Qlik Sense server stops responding to health checks
- Identify which virtual proxy is failing when session polling breaks
- Separate connectivity failures from destination-write failures such as InfluxDB or New Relic outages
- Confirm that missing app-name enrichment is caused by QRS polling failures rather than empty metadata

## Example queries

### Failed polls by server over the last hour

```text
from(bucket: "mybucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "butler_sos_errors")
  |> filter(fn: (r) => r._field == "error_count")
  |> filter(fn: (r) => r.error_type == "HEALTH_API" or r.error_type == "PROXY_API" or r.error_type == "APP_NAMES_EXTRACT")
  |> aggregateWindow(every: 5m, fn: sum, createEmpty: false)
  |> group(columns: ["server_name", "error_type"])
```

### Proxy-session poll failures by virtual proxy

```text
from(bucket: "mybucket")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "butler_sos_errors")
  |> filter(fn: (r) => r._field == "error_count")
  |> filter(fn: (r) => r.error_type == "PROXY_API")
  |> group(columns: ["server_name", "virtual_proxy"])
  |> sum()
```

## Related docs

- [Failed Poll Metrics](/v14.0/reference/available-metrics/failed-polls) for the exact InfluxDB schema used by these events
- [Error Tracking](/v14.0/concepts/features/error-tracking) for the broader Butler SOS error-tracking model