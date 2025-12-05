---
outline: deep
---

# InfluxDB

InfluxDB is the most commonly used destination for Butler SOS metrics. It's a time-series database optimized for storing measurements and metrics.

## Why InfluxDB?

- **Purpose-built for metrics** - Optimized for time-stamped data
- **Pairs with Grafana** - Create powerful dashboards
- **Data retention policies** - Automatically purge old data
- **Aggregation** - Summarize historical data to save space

## Supported versions

| Version        | Status                                     |
| -------------- | ------------------------------------------ |
| InfluxDB 1.x   | ✅ Supported                               |
| InfluxDB 2.x   | ✅ Supported                               |
| InfluxDB Cloud | ⚠️ Reported to work, not officially tested |
| InfluxDB 3.x   | ❌ Not supported                           |

## Data retention

Butler SOS stores data in full detail without aggregation. Consider:

- **Storage growth** - More servers + frequent polling + long retention = lots of data
- **Recommended retention** - 10-14 days is usually sufficient for operational monitoring
- **Extended history** - Use InfluxDB's aggregation features for longer-term trends

::: tip
The retention policy in the config file only applies when Butler SOS creates a new database. Existing databases keep their current settings.
:::

## Configuration

```yaml
Butler-SOS:
  influxdbConfig:
    enable: true
    host: influxdb.mycompany.com
    port: 8086
    version: 1 # 1 or 2

    # InfluxDB 2.x settings
    v2Config:
      org: myorg
      bucket: mybucket
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

### Key settings

| Setting         | Description                                       |
| --------------- | ------------------------------------------------- |
| `enable`        | Enable/disable InfluxDB storage                   |
| `host`          | InfluxDB hostname or IP address                   |
| `port`          | InfluxDB port (usually 8086)                      |
| `version`       | Set to `1` for InfluxDB 1.x, `2` for InfluxDB 2.x |
| `includeFields` | Control which document lists are stored           |

### InfluxDB 2.x specific

| Setting             | Description                |
| ------------------- | -------------------------- |
| `org`               | Your InfluxDB organization |
| `bucket`            | Bucket to store data in    |
| `token`             | Authentication token       |
| `retentionDuration` | How long to keep data      |

### InfluxDB 1.x specific

| Setting           | Description                                |
| ----------------- | ------------------------------------------ |
| `dbName`          | Database name                              |
| `auth.enable`     | Whether authentication is required         |
| `retentionPolicy` | Default retention policy for new databases |

## Document lists

The `includeFields` settings control whether lists of active, loaded, and in-memory documents are stored:

::: warning Caution
Enabling `activeDocs`, `loadedDocs`, or `inMemoryDocs` can generate significant data volume, especially in environments with many apps.
:::

- **activeDocs** - Apps where users are currently working
- **loadedDocs** - Apps loaded in memory with active sessions
- **inMemoryDocs** - Apps in memory but without active sessions
