---
outline: deep
---

# InfluxDB

InfluxDB is the recommended destination for Butler SOS operational metrics.

## Why InfluxDB?

- **Purpose-built for metrics** - Optimized for time-stamped data.
- **Pairs with Grafana** - Create powerful dashboards for real-time monitoring.
- **Data retention policies** - Automatically purge old data to manage disk space.
- **Aggregation** - Summarize historical data to save space while keeping long-term trends.

## Architecture Overview

Butler SOS supports three InfluxDB versions, each with a different API style:

| Version | Query language | Client library | Write style | Tag/field name reuse |
|---------|---------------|----------------|-------------|---------------------|
| **InfluxDB 1.x** | InfluxQL | `node-influx` | Plain objects, batch writes | ✅ Same name allowed |
| **InfluxDB 2.x** | Flux | `@influxdata/influxdb-client` | Builder pattern (`Point`) | ✅ Same name allowed |
| **InfluxDB 3.x** | SQL | `@influxdata/influxdb3-client` | Builder pattern (`Point3`), line protocol | ❌ Same name not allowed |

The underlying metrics stored are the same across all three versions — only the write API and query syntax differ.

## Configuration

Butler SOS uses `Butler-SOS.influxdbConfig` for storing metrics.

| Config Block            | Purpose                         | YAML Path                                     |
| ----------------------- | ------------------------------- | --------------------------------------------- |
| **Operational Metrics** | Health metrics, user/log events | `Butler-SOS.influxdbConfig`                   |

## Supported versions

| Version        | Status                                     |
| -------------- | ------------------------------------------ |
| InfluxDB 1.x   | ✅ Supported                               |
| InfluxDB 2.x   | ✅ Supported                               |
| InfluxDB Cloud | ⚠️ Reported to work, not officially tested |
| InfluxDB 3.x   | ✅ Supported                               |

::: warning InfluxDB v3 Naming Constraints
InfluxDB v3 does not allow a tag and a field to have the same name in the same measurement. Butler SOS ensures this by default, but keep this in mind if you customize the schema.
:::

::: warning v3 CPU Precision
InfluxDB v3 stores CPU percentage metrics as integers rather than floats. Values like 45.7% are truncated to 45. If you use CPU percentage thresholds in Grafana alerts, review them after switching to v3.
:::

::: warning v2 → v3 Dashboard Migration Required
If you switch from InfluxDB v2 to v3, existing Grafana dashboards and InfluxDB queries may break because several field names change:

| Data source | v2 field name | v3 field name |
|-------------|--------------|---------------|
| User events | `userFull` | `userFull_field` |
| User events | `userId` | `userId_field` |
| Scheduler log events | `app_name` | `app_name_field` |
| Scheduler log events | `app_id` | `app_id_field` |

Update all queries and dashboard panels to use the new field names before switching to v3.
:::

## Data retention

Butler SOS stores data in full detail without aggregation. Consider:

- **Storage growth** - More servers + frequent polling + long retention = lots of data.
- **Recommended retention** - 10-14 days is usually sufficient for operational monitoring. Audit data retention depends on your organization's compliance requirements.
- **Extended history** - Use InfluxDB's aggregation features for longer-term trends.

::: tip
The retention policy in the config file only applies when Butler SOS creates a new database/bucket. Existing databases keep their current settings.
:::

## Configuration: Operational Metrics

This section configures where general health metrics, user events, and log events are stored.

```yaml
Butler-SOS:
  influxdbConfig:
    enable: true
    # Items below are mandatory if influxdbConfig.enable=true
    host: influxdb.mycompany.com   # InfluxDB host, hostname, FQDN or IP address
    port: 8086                      # Port where InfluxDB is listening, usually 8086
    version: 3                      # 1, 2 or 3 — which InfluxDB version is being used
    maxBatchSize: 1000              # Max data points per batch. On failure: 1000→500→250→100→10→1. Valid range: 1-10000

    # InfluxDB 3.x settings (used when version: 3)
    v3Config:
      database: mydatabase
      description: Butler SOS metrics
      token: mytoken
      retentionDuration: 10d
      writeTimeout: 10000           # Socket timeout when writing (ms). Default: 10000
      queryTimeout: 60000            # Socket timeout when querying (ms). Default: 60000

    # InfluxDB 2.x settings (used when version: 2)
    v2Config:
      org: myorg
      bucket: mybucket
      description: Butler SOS metrics
      token: mytoken
      retentionDuration: 10d

    # InfluxDB 1.x settings (used when version: 1)
    v1Config:
      auth:
        enable: false               # Does InfluxDB require authentication?
        username: <username>        # Mandatory if auth.enable=true
        password: <password>        # Mandatory if auth.enable=true
      dbName: senseops
      retentionPolicy:
        name: 10d
        duration: 10d                # Duration units: https://docs.influxdata.com/influxdb/v1.8/query_language/spec/#durations

    # Control what data is stored
    includeFields:
      activeDocs: false            # Can generate lots of data
      loadedDocs: false             # Can generate lots of data
      inMemoryDocs: false           # Can generate lots of data
```

### Document lists

The `includeFields` settings in `influxdbConfig` control whether lists of active, loaded, and in-memory documents are stored:

::: warning Caution
Enabling `activeDocs`, `loadedDocs`, or `inMemoryDocs` can generate significant data volume, especially in environments with many apps.
:::

- **activeDocs** - Apps where users are currently working.
- **loadedDocs** - Apps loaded in memory with active sessions.
- **inMemoryDocs** - Apps in memory but without active sessions.

## Understanding InfluxDB Write Log Messages

When Butler SOS writes data to InfluxDB, you may see log messages like:

```
2026-05-01T05:07:50.412Z info: INFLUXDB V3 RETRY: Health metrics for 192.168.100.109:4747 (chunk 1/1, points 0-7) - Write succeeded on attempt 2/4
2026-05-01T05:24:46.942Z warn: INFLUXDB V3 RETRY: Health metrics for 192.168.100.109:4747 (chunk 1/1, points 0-7) - Retryable error (r) on attempt 1/4, retrying in 1000ms...
```

The chunk and points notation applies to **all InfluxDB versions** (1.x, 2.x, 3.x). The only difference is the log prefix:

| InfluxDB Version | Log Prefix |
|-----------------|-------------|
| InfluxDB 1.x | `INFLUXDB V1 BATCH` / `INFLUXDB V1 RETRY` |
| InfluxDB 2.x | `INFLUXDB V2 BATCH` / `INFLUXDB V2 RETRY` |
| InfluxDB 3.x | `INFLUXDB V3 BATCH` / `INFLUXDB V3 RETRY` |

### What are "points"?

Points are individual data measurements being written to InfluxDB. Each point represents a single metric (e.g., CPU usage, memory, session count, log event).

`points 0-7` refers to the **array index range** within the current chunk — here, 8 data points at indices 0 through 7.

### What are "chunks"?

Butler SOS batches points for efficient writing. The `maxBatchSize` setting (default: 1000) controls the maximum points per batch.

When there are more points than `maxBatchSize`, the array is split into **chunks**:
- `chunk 1/3` = chunk 1 of 3 total chunks
- If all points fit in `maxBatchSize`, you'll see `chunk 1/1`

### Retry Logic

The `RETRY` tag means the initial write failed and Butler SOS is retrying. There is a two-level retry system:

1. **Per-chunk retry**: Each chunk retries on retryable errors (timeout, network issues) up to 3 times with exponential backoff (1000ms initial, doubling up to 10s max).
2. **Progressive batch size reduction**: If a chunk fails after all retries, the batch size reduces: `maxBatchSize` → 500 → 250 → 100 → 10 → 1.

### Example Log Messages

| Log Message | Meaning |
|-------------|---------|
| `INFLUXDB V3 RETRY: ... (chunk 1/1, points 0-7) - Write succeeded on attempt 2/4` | Write succeeded on 2nd retry (v3) |
| `INFLUXDB V2 RETRY: ... (chunk 1/3, points 0-999) - Retryable error on attempt 1/4, retrying...` | First retry after timeout (v2) |
| `INFLUXDB V1 BATCH: ... - Successfully wrote all data using batch size 500 (reduced from 1000)` | Batch size reduced and succeeded (v1) |
| `INFLUXDB V3 RETRY: ... (chunk 1/1, points 0-0) - Write succeeded on attempt 2/4` | Empty or single-point chunk (v3) |

::: tip
`points 0-0` in logs means the chunk contained either no data points or a single point at index 0. This is normal for event queues (user events, log events) that may have no new events during a polling interval.
:::

::: warning
The retry logic only applies to retryable errors (timeouts, `ETIMEDOUT`, `ECONNREFUSED`, `ENOTFOUND`, `ECONNRESET`). Non-retryable errors (e.g., authentication failures) fail immediately without retries.
:::
