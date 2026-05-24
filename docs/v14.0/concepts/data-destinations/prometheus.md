---
outline: deep
---

# Prometheus

Prometheus is an open-source monitoring system that's become the standard for cloud-native observability. Butler SOS can expose metrics on a Prometheus-compatible endpoint for scraping.

## Why Prometheus?

- **Cloud-native** - Native support in Kubernetes and modern platforms
- **Pull-based** - Prometheus scrapes Butler SOS (no push configuration needed)
- **PromQL** - Powerful query language for dimensional analysis
- **Alerting** - Built-in alertmanager integration
- **Grafana** - Excellent integration with Grafana dashboards

## How it works

Unlike InfluxDB (where Butler SOS pushes data), Prometheus works by pulling metrics:

1. Butler SOS exposes metrics on an HTTP endpoint
2. Prometheus periodically scrapes that endpoint
3. Metrics are stored in Prometheus' time-series database
4. Grafana (or other tools) query Prometheus for visualization

```text
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ Butler SOS  │ ──────► │ Prometheus  │ ──────► │  Grafana    │
│  :9842      │  scrape │             │  query  │             │
└─────────────┘         └─────────────┘         └─────────────┘
```

## Configuration

### Butler SOS config

```yaml
Butler-SOS:
  prometheus:
    enable: true
    host: butler-sos.mycompany.net # IP/FQDN to expose metrics on
    port: 9842 # Port for Prometheus endpoint
```

| Setting  | Description                                                                                                |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| `enable` | Enable/disable the Prometheus endpoint                                                                     |
| `host`   | IP address or hostname to bind to. Use `butler-sos.mycompany.net` or `0.0.0.0` to listen on all interfaces |
| `port`   | Port number for the metrics endpoint                                                                       |

### Prometheus scrape config

Add Butler SOS as a scrape target in your Prometheus configuration:

```yaml
scrape_configs:
  - job_name: "butler-sos"
    static_configs:
      - targets: ["butler-sos-host:9842"]
    scrape_interval: 30s
```

## Metrics endpoint

Once enabled, metrics are available at:

```text
http://<butler-sos-host>:9842/metrics
```

The endpoint returns metrics in Prometheus format:

```text
# HELP butler_sos_engine_cpu_total Engine CPU usage
# TYPE butler_sos_engine_cpu_total gauge
butler_sos_engine_cpu_total{server="sense1.company.com"} 15.2

# HELP butler_sos_engine_memory_committed Engine committed memory
# TYPE butler_sos_engine_memory_committed gauge
butler_sos_engine_memory_committed{server="sense1.company.com"} 8589934592
```

## Prometheus vs InfluxDB

| Aspect          | Prometheus               | InfluxDB                      |
| --------------- | ------------------------ | ----------------------------- |
| Data collection | Pull (scrape)            | Push                          |
| Query language  | PromQL                   | InfluxQL / Flux               |
| Best for        | Cloud-native, Kubernetes | Traditional deployments       |
| Alerting        | Built-in alertmanager    | Requires Grafana or Kapacitor |
| Retention       | Limited (usually weeks)  | Flexible (days to years)      |

Both integrate well with Grafana - choose based on your existing infrastructure.
