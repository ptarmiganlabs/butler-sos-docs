---
outline: deep
---

# Health Metrics

Butler SOS retrieves health metrics from each monitored Qlik Sense server at regular intervals.

These metrics provide real-time insights into the state of your Qlik Sense environment, including server resources, active apps, and cache status.

## What health metrics are available?

The health endpoint of Qlik Sense provides a wealth of information about each server:

### Server resources

- **CPU usage** - Current CPU utilization of the Sense engine
- **Memory** - Committed, allocated, and free memory
- **Total physical memory** - Available RAM on the server

### App states

Apps in Qlik Sense can be in different states:

| State              | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| **Active apps**    | Apps where a user is currently performing some action                |
| **Loaded apps**    | Apps currently loaded into memory with open sessions or connections  |
| **In-memory apps** | Apps loaded into memory but without any open sessions or connections |

Butler SOS tracks both app IDs and names for apps in each category.

### Session counts

- Total number of active sessions
- Number of sessions per virtual proxy

### Cache status

- Cache hits and misses
- Cache lookup and add operations

## How often are metrics collected?

The polling interval is configurable in Butler SOS config file:

```yaml
Butler-SOS:
  serversToMonitor:
    pollingInterval: 30000 # Milliseconds between health checks
```

A typical value is 15-30 seconds, balancing real-time visibility with server load.

## Health endpoint

Butler SOS queries the Qlik Sense health check endpoint for each monitored server:

```text
https://<sense-server>:4747/engine/healthcheck/
```

This endpoint requires proper certificate authentication, which is configured in the Butler SOS config file.

More info on the health check endpoint is available in the [Qlik help documentation](https://help.qlik.com/en-US/sense-developer/November2024/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm).

## Visualizing health metrics

Health metrics stored in InfluxDB can be visualized in Grafana dashboards. Common visualizations include:

- CPU and memory usage over time
- Number of active/loaded/in-memory apps
- Session counts across virtual proxies
- Cache hit ratios

See the [Examples](/docs/examples/) section for sample Grafana dashboards.
