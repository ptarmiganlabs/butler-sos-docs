# Available Metrics

Butler SOS collects metrics from Qlik Sense Enterprise on Windows and can store them in multiple destinations. Understanding the available metrics and how they are structured is essential for creating effective dashboards and monitoring solutions.

## Metrics Destinations

Butler SOS supports three metrics destinations, each with its own data structure:

| Destination                | Description                                                | Best For                                        |
| -------------------------- | ---------------------------------------------------------- | ----------------------------------------------- |
| [InfluxDB](./influxdb)     | Time-series database with rich measurement/tag/field model | Detailed metrics storage, string data support   |
| [Prometheus](./prometheus) | Metrics exposed via HTTP endpoint for scraping             | Kubernetes environments, aggregation queries    |
| [New Relic](./new-relic)   | SaaS observability platform                                | Cloud-native monitoring, minimal infrastructure |

## Metrics Categories

Butler SOS collects several categories of metrics from Qlik Sense:

### Health Metrics

Real-time health status from the Sense health check API:

- **Engine metrics** - CPU, memory, cache, saturation status
- **Session metrics** - Active and total sessions
- **User metrics** - Active and total users
- **App metrics** - Active, loaded, and in-memory documents

### User Session Details

Per-virtual-proxy user session information:

- Session summaries (counts by virtual proxy)
- Individual session details (user, app, duration)

### User Events

Real-time user activity events (requires log appender):

- Session start/stop
- Connection open/close
- User directory and ID

### Log Events

Real-time log events from Sense services (requires log appender):

- Engine service errors/warnings
- Proxy service events
- Repository service events
- Scheduler service events
- Performance log events

### Butler SOS Metrics

Metrics about Butler SOS itself:

- Memory usage (heap, process)
- Uptime information

## Data Model Comparison

Each destination has a slightly different data model:

### InfluxDB

- **Measurements** - Named containers for related data points
- **Tags** - Indexed metadata for filtering (strings only)
- **Fields** - Actual metric values (strings, numbers, booleans)

### Prometheus

- **Metrics** - Named measurements with optional labels
- **Labels** - Key-value pairs for dimensionality
- **Values** - Numeric values only (no string support)

### New Relic

- **Metrics** - Numeric measurements
- **Events** - Log events and user activity
- **Attributes** - Metadata attached to metrics/events

## Common Tags/Labels

All destinations share some common identifying information:

| Tag/Label            | Description                         |
| -------------------- | ----------------------------------- |
| `host`               | Host name or IP of the Sense server |
| `server_name`        | Human-friendly server name          |
| `server_description` | Server description                  |

Custom tags defined in the config file are also added to all metrics.

## Next Steps

- [InfluxDB Metrics](./influxdb) - Complete InfluxDB measurement reference
- [Prometheus Metrics](./prometheus) - Prometheus endpoint metrics
- [New Relic](./new-relic) - New Relic integration details
