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
    host: influxdb.mycompany.com
    port: 8086
    version: 2 # 1, 2 or 3
    maxBatchSize: 1000 # Max points per write batch

    # InfluxDB 3.x settings
    v3Config:
      database: butler-metrics
      token: mytoken
      retentionDuration: 10d

    # InfluxDB 2.x settings
    v2Config:
      org: myorg
      bucket: butler-metrics
      description: Butler SOS metrics
      token: mytoken
      retentionDuration: 10d

    # InfluxDB 1.x settings
    v1Config:
      auth:
        enable: false
        username: <username>
        password: <password>
      dbName: SenseOps
      retentionPolicy:
        name: 10d
        duration: 10d

    # Control what data is stored
    includeFields:
      activeDocs: false # Can generate lots of data
      loadedDocs: false # Can generate lots of data
      inMemoryDocs: false # Can generate lots of data
```

### Document lists

The `includeFields` settings in `influxdbConfig` control whether lists of active, loaded, and in-memory documents are stored:

::: warning Caution
Enabling `activeDocs`, `loadedDocs`, or `inMemoryDocs` can generate significant data volume, especially in environments with many apps.
:::

- **activeDocs** - Apps where users are currently working.
- **loadedDocs** - Apps loaded in memory with active sessions.
- **inMemoryDocs** - Apps in memory but without active sessions.
```

## Key Settings
