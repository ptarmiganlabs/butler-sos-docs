---
outline: deep
---

# Monitoring

Butler SOS provides comprehensive monitoring capabilities for Qlik Sense Enterprise on Windows environments.

This section covers the key monitoring features:

- **[Health Metrics](./health-metrics)** - Real-time server metrics (CPU, memory, cache, app states).
- **[User Sessions](./user-sessions)** - Periodic snapshots of active sessions per virtual proxy.
- **[User Events](./user-events)** - Real-time session and connection events, including browser/OS tracking.

## Log Events

Butler SOS can capture detailed log events from Qlik Sense services:

- **[Log Events Overview](./log-events/log%20events%20overview/)** - Understanding the three levels of log event data.
- **[App Performance Monitoring](./log-events/app%20object%20performance%20monitoring/)** - Deep-dive into chart and object performance.
- **[Categorizing Log Events](./log-events/catgorising%20log%20events/)** - How to filter and categorize events.
- **[Errors & Warnings](./log-events/errors%20warnings/)** - Tracking error and warning events.

## Why monitoring matters

Monitoring a Qlik Sense environment - or any system - comes down to knowing what's going on.

If you don't know what's going on, you're guessing.  
And if you're guessing, you're not in control.

Butler SOS focuses on providing **real-time insights** into what's happening in your Sense environment, complementing the retrospective analysis provided by tools like the Operations Monitor app.

## Data destinations

Monitoring data can be sent to multiple destinations:

- **InfluxDB** - Time-series database for metrics storage and Grafana visualization
- **Prometheus** - Metrics gathering for cloud-native environments
- **New Relic** - Cloud-based observability platform
- **MQTT** - Message broker for integration with other systems

See the [Data Destinations](/docs/concepts/data-destinations/) section for more details.
