---
outline: deep
---

# Engine Performance Monitoring

The combination of Butler SOS and Grafana provides a powerful combo for monitoring the performance of your Qlik Sense engines.

Here are some recipes for how to set up Butler SOS to implement various specific monitoring scenarios.

## Available Tutorials

### Track App Open Times

Monitor how long it takes to open apps on your Qlik Sense server. This is useful for:

- Establishing a baseline for normal app opening times
- Identifying apps that are slow to open
- Setting up alerts when app opening times exceed thresholds
- Verifying user complaints about slow performance

[Learn how to track app open times →](/docs/examples/engine-performance/app-open-time)

### Find Slow Updating Charts

Identify which app objects (charts, tables, etc.) are slow to update. This is useful for:

- Identifying misbehaving charts in important apps
- Establishing baselines for object update times
- Setting up alerts for slow-updating objects
- Troubleshooting end user performance complaints

[Learn how to find slow updating charts →](/docs/examples/engine-performance/find-slow-charts)

## Prerequisites

All engine performance monitoring tutorials require:

- Butler SOS 11.0 or later
- InfluxDB v1 or v2 database for storing metrics
- XML appender files deployed on Sense servers
- Grafana for visualization
- Data connections configured between Grafana and InfluxDB

## A Word of Caution

::: warning Data volume
Enabling detailed performance monitoring can generate a lot of data, especially if enabled for many apps.

This can lead to:

- Large amounts of data stored in InfluxDB
- Performance issues in InfluxDB and Grafana

It is therefore recommended to:

- Only enable detailed monitoring for a limited number of apps
- Consider enabling monitoring only for limited time periods
- Start by monitoring all objects, then narrow down to specific ones of interest
- Limit monitoring to certain object types (e.g., charts and tables only)
  :::

## Configuration Overview

Engine performance monitoring uses the `enginePerformanceMonitor` section in the Butler SOS config file:

```yaml
logEvents:
  enginePerformanceMonitor:
    enable: true
    appNameLookup:
      enable: true
    trackRejectedEvents:
      enable: true
    monitorFilter:
      allApps:
        enable: false # Monitor all apps, or...
      appSpecific:
        enable: true # ...monitor specific apps only
        app:
          - include:
              - appName: "Your App Name"
            objectType:
              allObjectTypes: true
            appObject:
              allAppObjects: true
            method:
              allMethods: true
```

## Related Topics

- [Count User/Log Events](/docs/examples/count-user-log-events) - Event counting fundamentals
- [Grafana Dashboards](/docs/examples/grafana/) - Visualization examples
- [Log Events Overview](/docs/concepts/monitoring/log-events/log%20events%20overview/) - Understanding log events
