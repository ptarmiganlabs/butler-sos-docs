---
outline: deep
---

# Uptime Monitor

Butler SOS can log its own uptime and memory usage, helping you monitor the health of Butler SOS itself.

## What it does

The uptime monitor periodically logs:

- **Uptime** - How long Butler SOS has been running
- **Memory usage** - Current RAM consumption

This data can be:

- Written to console and log files
- Stored in InfluxDB for Grafana visualization
- Sent to New Relic for cloud-based monitoring

## Use cases

- **Troubleshooting** - Identify memory leaks or unexpected restarts
- **Capacity planning** - Understand Butler SOS resource requirements
- **Monitoring dashboards** - Include Butler SOS health in your Grafana dashboards

## Configuration

```yaml
Butler-SOS:
  uptimeMonitor:
    enable: true
    frequency: every 15 minutes
    logLevel: verbose
    storeInInfluxdb:
      butlerSOSMemoryUsage: true
      instanceTag: PROD
    storeNewRelic:
      enable: false
      destinationAccount:
        - First NR account
      metric:
        dynamic:
          butlerMemoryUsage:
            enable: true
          butlerUptime:
            enable: true
      attribute:
        static:
          - name: qs_environment
            value: prod
        dynamic:
          butlerVersion:
            enable: true
```

### Core settings

| Setting | Description |
|---------|-------------|
| `enable` | Enable/disable uptime monitoring |
| `frequency` | How often to log uptime. Uses [later.js text parser](https://bunkat.github.io/later/parsers.html#text) |
| `logLevel` | Minimum log level for uptime messages (`silly`, `debug`, `verbose`, `info`, `warn`, `error`) |

### InfluxDB storage

| Setting | Description |
|---------|-------------|
| `storeInInfluxdb.butlerSOSMemoryUsage` | Store memory usage in InfluxDB |
| `storeInInfluxdb.instanceTag` | Tag to identify this Butler SOS instance (useful when running multiple instances) |

::: info
InfluxDB storage requires `Butler-SOS.influxdbConfig.enable` to be `true`.
:::

### New Relic

| Setting | Description |
|---------|-------------|
| `storeNewRelic.enable` | Send uptime metrics to New Relic |
| `storeNewRelic.destinationAccount` | Which New Relic account(s) to send data to |
| `metric.dynamic.butlerMemoryUsage` | Include memory usage |
| `metric.dynamic.butlerUptime` | Include uptime duration |

#### Attributes

Attributes are tags attached to New Relic data for filtering and grouping:

- **Static attributes** - Fixed values (e.g., environment name)
- **Dynamic attributes** - Values that change (e.g., Butler SOS version)

## Data retention

::: warning
Choose a reasonable retention policy for uptime metrics. You rarely need to know Butler SOS memory usage from a month ago.

Recommended: 1-2 weeks retention, logging every 5-15 minutes.
:::
