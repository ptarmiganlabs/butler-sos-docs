---
outline: deep
---

# Grafana Dashboards

Grafana is a powerful tool for creating dashboards that visualize data from various sources.

This page shows examples of Grafana dashboards that visualize data from Butler SOS.

## Dashboard Availability

Sample dashboards are available in the [Butler SOS Git repository](https://github.com/ptarmiganlabs/butler-sos/tree/master/docs/grafana).

Before importing these to Grafana you should create a Grafana data source called "SenseOps" (or "senseops"), and point it to your InfluxDB database. When you then import the dashboards they should find your database straight away.

::: tip Version recommendation
You are **strongly** recommended to use the latest version of Grafana with the latest version of Butler SOS.

That said, earlier Butler SOS versions included some nice demo dashboards too. These are documented below as inspiration for what can be done.
:::

## Dashboard Concepts

A concept that has proven useful many times is to use an **overview dashboard** to monitor high-level metrics for the entire Sense cluster. A separate, **parameterized dashboard** then drills into the details for each server.

Grafana variables make this both easy to set up, scalable, and very powerful.

## Version-Specific Dashboards

### Grafana 9+

The Grafana 9 dashboard takes advantage of new alerting features and improved chart types.

A sample Grafana 9 dashboard is [available in the Github repository](https://github.com/ptarmiganlabs/butler-sos/tree/master/docs/grafana).

The visual appearance is quite similar to previous versions, but line charts, tables etc have been replaced with the updated variants that arrived with Grafana 9.

[View Grafana 9 Dashboard Details](/docs/examples/grafana/grafana-9)

### Grafana 8

Grafana 8 further establishes its position as the leading open source platform for observability and real-time dashboards. Butler SOS takes advantage of this with comprehensive monitoring dashboards.

[View Grafana 8 Dashboard Details](/docs/examples/grafana/grafana-8)

### Grafana 7

Grafana 7 brought significant improvements to visualizations, taking them to a new level compared to version 6.

[View Grafana 7 Dashboard Details](/docs/examples/grafana/grafana-7)

### Grafana 6

The classic dashboard showing Qlik Sense and Windows operational metrics in Grafana.

[View Grafana 6 Dashboard Details](/docs/examples/grafana/grafana-6)

## Common Dashboard Components

Across all versions, Butler SOS dashboards typically include:

### Overview Metrics

High-level insights into virtual proxies, users, and sessions:

- CPU load per server
- RAM memory availability
- Total session counts
- Engine cache success rate
- Number of loaded apps

### Apps in Memory

Understanding which apps are loaded into memory on each Sense server helps identify:

- Memory-intensive apps
- Apps that may not be well designed
- Root causes when RAM drops suddenly

### Users & Sessions

Track connected users to:

- Detect sudden drops in user count (potential issues)
- Plan maintenance windows
- Send notifications to affected users

### Warnings & Errors

Real-time access to log events allows you to:

- Spot developing issues quickly
- Act on problems as they occur
- Investigate incidents with detailed log data

### Butler SOS Metrics

Track Butler SOS's own health:

- Memory usage trends
- Potential memory leaks
- Overall stability

## Related Topics

- [InfluxDB Metrics](/docs/reference/available-metrics/influxdb) - Understand what metrics are available
- [Count User/Log Events](/docs/examples/count-user-log-events) - Set up event counting
- [Engine Performance Monitoring](/docs/examples/engine-performance/) - Detailed app-level monitoring
