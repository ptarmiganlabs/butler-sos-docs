# Reference

This section provides detailed technical reference documentation for Butler SOS configuration, HTTP and UDP interfaces, and available metrics.

## Configuration

- **[Command Line Options](./command-line-options)** - All available CLI flags and options for running Butler SOS
- **[Config File Format](./config-file-format)** - Comprehensive documentation of the YAML configuration file

## Protocols And APIs

- **[Audit Events API](./audit-events-api)** - HTTP endpoints, status codes, authentication rules, and retry behavior for Audit.qs ingestion
- **[Audit Events Rate Limiting](./audit-events-rate-limiting)** - Per-IP request limits, `429` handling, and rate-limit headers
- **[Audit.qs Version Compatibility](./audit-qs-version-compatibility)** - Version matrix, `X-Audit-QS-Version`, and compatibility-driven behavior
- **[Audit Event Destinations](./audit-destinations/)** - Destination overview and current behavior for InfluxDB, JSON, Parquet, PNG, and QVD audit outputs
- **[UDP Payload Format](./udp-payload-format)** - Detailed reference for Butler SOS UDP message formats

::: tip
Different event types use different destination configs:

- **User events**: `Butler-SOS.userEvents.sendToInfluxdb.*` and `Butler-SOS.userEvents.sendToNewRelic.*`
- **Log events**: `Butler-SOS.logEvents.sendToInfluxdb.*` and `Butler-SOS.logEvents.sendToNewRelic.*`

These are separate from the **metrics** destination configs such as `Butler-SOS.influxdbConfig`.
:::

## Available Metrics

Butler SOS collects metrics from Qlik Sense and can store them in various destinations. Each destination has its own metric structure:

- **[InfluxDB Metrics](./available-metrics/)** - Complete reference of InfluxDB measurements, tags, and fields
- **[Prometheus Metrics](./available-metrics/prometheus)** - Prometheus endpoint metrics and labels
- **[New Relic](./available-metrics/new-relic)** - New Relic integration overview

## Quick Links

| Topic                                                | Description                                           |
| ---------------------------------------------------- | ----------------------------------------------------- |
| [Config File](./config-file-format)                  | Full configuration file reference with all parameters |
| [CLI Options](./command-line-options)                | Command line arguments and their usage                |
| [Audit Events API](./audit-events-api)               | HTTP contract for Audit.qs event ingestion            |
| [Audit Events Rate Limiting](./audit-events-rate-limiting) | Per-IP limits and `429` response handling       |
| [Audit.qs Version Compatibility](./audit-qs-version-compatibility) | Compatibility checks between Butler SOS and Audit.qs |
| [Audit Event Destinations](./audit-destinations/)    | Destination overview for audit metadata and artifacts |
| [JSON Object Data](./audit-destinations/json/object-data) | Dedicated JSON output for visualization object data |
| [Screenshot Downloads](./audit-destinations/png/downloads) | Screenshot auth, redirects, and allowed hosts   |
| [InfluxDB Metrics](./available-metrics/)             | Detailed InfluxDB measurement schemas                 |
| [Prometheus Metrics](./available-metrics/prometheus) | Prometheus metric names and labels                    |
