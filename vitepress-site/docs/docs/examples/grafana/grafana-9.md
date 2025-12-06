---
outline: deep
---

# Grafana 9 Dashboard

Grafana 9 adds some interesting features around alerting as well as several new and improved chart types.

## Dashboard File

A sample Grafana 9 dashboard is [available in the Github repository](https://github.com/ptarmiganlabs/butler-sos/tree/master/docs/grafana).

The visual appearance is quite similar to previous versions, but line charts, tables etc have been replaced with the updated variants that arrived with Grafana 9.

## Key Features in Grafana 9

- **Improved alerting** - New unified alerting system
- **Updated visualizations** - Modern chart components
- **Better performance** - Optimized rendering

## Installation

1. Create a Grafana data source called "senseops" pointing to your InfluxDB database
2. Download the dashboard JSON from the repository
3. Import the dashboard in Grafana (Dashboards → Import)
4. The dashboard should automatically connect to your data source

## Related Topics

- [Grafana Dashboards Overview](/docs/examples/grafana/)
- [InfluxDB Metrics Reference](/docs/reference/available-metrics/influxdb)
