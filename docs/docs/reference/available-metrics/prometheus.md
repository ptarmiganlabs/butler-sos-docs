# Prometheus Metrics

Metrics retrieved from Sense servers can be exposed on a [Prometheus](https://prometheus.io) compatible endpoint. You don't have to be a Prometheus expert to use Butler SOS, but understanding some basic concepts is helpful.

## Overview

Storing metrics in Prometheus is not mandatory, but some kind of metrics storage—either in Prometheus, [InfluxDB](./influxdb), or [New Relic](./new-relic)—is needed to take full benefit of Butler SOS' features.

Prometheus gathers metrics by "scraping" data from web pages ("endpoints") on which metrics are displayed in a well-specified format. Most metrics from Sense servers are exposed on a Prometheus-compatible endpoint, but not all.

::: info Key Difference from InfluxDB
InfluxDB is more flexible for some types of data (especially strings), while Prometheus provides more easily used features for data aggregation when data should be displayed in Grafana.
:::

## Prometheus Endpoint

Prometheus is enabled/disabled in the `Butler-SOS.prometheus` section in the config file. Prometheus metrics are available on the `/metrics` URL on the IP and port specified in the config file.

For example, if the host is `0.0.0.0` and the port is `9842`, Butler SOS will listen on port 9842 on all available network interfaces. If the Butler SOS server's IP address is `192.168.1.168`, you can view metrics in a web browser at:

```text
http://192.168.1.168:9842/metrics
```

This is the web page Prometheus will scrape and ingest into its time-series database.

## Prometheus Concepts

In contrast to InfluxDB, to which Butler SOS pushes data, Prometheus works the other way around. The Prometheus server is responsible for gathering data exposed by the systems being monitored (in this case, Butler SOS).

The basic concepts are:

- **Metrics** represent the measurements of interest (similar to "fields" in InfluxDB)
- **Labels** are used to categorize metrics (similar to "tags" in InfluxDB)

## Labels

The labels available for all Prometheus metrics are:

| Label Name           | Source                                                    | Description                                                            |
| -------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------- |
| `host`               | `Butler-SOS.serversToMonitor.servers[].host`              | Host IP or FQDN of the server from which the metric comes              |
| `server_name`        | `Butler-SOS.serversToMonitor.servers[].serverName`        | Human friendly server name                                             |
| `server_description` | `Butler-SOS.serversToMonitor.servers[].serverDescription` | Human friendly server description                                      |
| _custom labels_      | `Butler-SOS.serversToMonitor.servers[].serverTags.*`      | All tags defined in the config file will be added as Prometheus labels |

## Qlik Sense Metrics

::: warning String Data Limitation
Prometheus is designed for storing numeric measurements and doesn't offer a good way to store strings. For that reason, Butler SOS metrics involving strings (for example, list of apps loaded in memory) are **not** available on the Prometheus endpoint.

If you need string data, use [InfluxDB](./influxdb) instead.
:::

Most of the metrics come from Qlik Sense's [health check API](https://help.qlik.com/en-US/sense-developer/November2020/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm).

### Available Metrics

| Metric                              | Type  | Description                                                                                                     |
| ----------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------- |
| `butlersos_apps_calls`              | Gauge | Total number of requests made to the Qlik Sense engine                                                          |
| `butlersos_apps_selections`         | Gauge | Total number of selections made to the Qlik Sense engine                                                        |
| `butlersos_apps_activedocs_total`   | Gauge | Number of active apps. An app is active when a user is currently performing some action on it                   |
| `butlersos_apps_inmemorydocs_total` | Gauge | Number of apps currently loaded into memory, even if they do not have any open sessions or connections          |
| `butlersos_apps_loadeddocs_total`   | Gauge | Number of apps currently loaded into memory that also have open sessions or connections                         |
| `butlersos_cache_added`             | Gauge | Number of cache objects added                                                                                   |
| `butlersos_cache_hits`              | Gauge | Number of cache hits                                                                                            |
| `butlersos_cache_lookups`           | Gauge | Number of cache lookups                                                                                         |
| `butlersos_cache_replaced`          | Gauge | Number of replaced cache objects                                                                                |
| `butlersos_cache_saturated`         | Gauge | When the value is 1, the engine is running with high resource usage; otherwise 0                                |
| `butlersos_cpu_total`               | Gauge | Percentage of the CPU used by the engine, averaged over 30 seconds                                              |
| `butlersos_mem_committed`           | Gauge | Total amount of committed memory for the engine process in MB                                                   |
| `butlersos_mem_allocated`           | Gauge | Total amount of allocated memory (committed + reserved) from the OS in MB                                       |
| `butlersos_mem_free`                | Gauge | Total amount of free memory (minimum of free virtual and physical memory) in MB                                 |
| `butlersos_session_active`          | Gauge | Number of active engine sessions. A session is active when a user is currently performing some action on an app |
| `butlersos_session_total`           | Gauge | Total number of engine sessions                                                                                 |
| `butlersos_users_active`            | Gauge | Number of distinct active users. An active user is currently performing an action on an app                     |
| `butlersos_users_total`             | Gauge | Total number of distinct users within the current engine sessions                                               |
| `butlersos_engine_metadata`         | Gauge | Metadata about the Qlik Sense engine                                                                            |
| `butlersos_user_session_total`      | Gauge | Number of sessions (as reported by the proxy service)                                                           |

## Node.js Metrics

A set of Node.js-specific metrics are also available on Butler SOS' Prometheus endpoint. These provide insight into the Butler SOS process itself.

These are described in the "Default metrics" section of the [prom-client documentation](https://github.com/siimon/prom-client).

Common Node.js metrics include:

| Metric                             | Description                     |
| ---------------------------------- | ------------------------------- |
| `nodejs_eventloop_lag_seconds`     | Lag of event loop in seconds    |
| `nodejs_gc_duration_seconds`       | Garbage collection duration     |
| `nodejs_active_handles_total`      | Number of active handles        |
| `nodejs_active_requests_total`     | Number of active requests       |
| `nodejs_heap_size_total_bytes`     | Process heap size in bytes      |
| `nodejs_heap_size_used_bytes`      | Process heap size used in bytes |
| `nodejs_external_memory_bytes`     | External memory size in bytes   |
| `process_cpu_user_seconds_total`   | Total user CPU time             |
| `process_cpu_system_seconds_total` | Total system CPU time           |
| `process_start_time_seconds`       | Process start time              |
| `process_resident_memory_bytes`    | Resident memory size in bytes   |

## Example Prometheus Configuration

Add this to your `prometheus.yml` to scrape metrics from Butler SOS:

```yaml
scrape_configs:
  - job_name: "butler-sos"
    static_configs:
      - targets: ["butler-sos-server:9842"]
    scrape_interval: 30s
```

## Example Queries

Here are some useful PromQL queries for Grafana dashboards:

### CPU Usage

```txt
butlersos_cpu_total{server_name="Production Server"}
```

### Memory Usage

```txt
butlersos_mem_committed{server_name=~".*"}
```

### Active Users Over Time

```txt
rate(butlersos_users_active[5m])
```

### Session Count by Server

```txt
sum by (server_name) (butlersos_session_total)
```

### Engine Saturation Alerts

```txt
butlersos_cache_saturated == 1
```

## Comparison with InfluxDB

| Feature           | Prometheus               | InfluxDB                  |
| ----------------- | ------------------------ | ------------------------- |
| Data collection   | Pull (scraping)          | Push                      |
| String data       | Not supported            | Supported                 |
| Built-in alerting | Yes (via Alertmanager)   | Via Kapacitor             |
| Query language    | PromQL                   | InfluxQL / Flux           |
| Best for          | Kubernetes, cloud-native | Detailed time-series data |
