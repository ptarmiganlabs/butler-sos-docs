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
| InfluxDB 3.x   | ✅ Supported                               |
| InfluxDB Cloud | ⚠️ Reported to work, not officially tested |

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
    version: 1 # 1, 2, or 3

    # InfluxDB 3.x settings
    v3Config:
      database: butlersos
      token: mytoken
      description: Butler SOS metrics
      retentionDuration: 10d
      timeout: 10000 # Optional: Socket timeout in ms (default: 10000)
      queryTimeout: 60000 # Optional: Query timeout in ms (default: 60000)

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

| Setting         | Description                                          |
| --------------- | ---------------------------------------------------- |
| `enable`        | Enable/disable InfluxDB storage                      |
| `host`          | InfluxDB hostname or IP address                      |
| `port`          | InfluxDB port (usually 8086)                         |
| `version`       | Set to `1` for InfluxDB 1.x, `2` for 2.x, `3` for v3 |
| `includeFields` | Control which document lists are stored              |

### InfluxDB 3.x specific

| Setting             | Description                                                |
| ------------------- | ---------------------------------------------------------- |
| `database`          | Database name                                              |
| `token`             | Authentication token                                       |
| `description`       | Optional description of the database                       |
| `retentionDuration` | How long to keep data (e.g., 10d, 30d, 365d)               |
| `timeout`           | Socket timeout for write operations in ms (default: 10000) |
| `queryTimeout`      | gRPC timeout for query operations in ms (default: 60000)   |

::: tip Timeout Configuration in InfluxDB 3.x
If you experience timeout errors, you can increase the `timeout` value. The default of 10 seconds (10000ms) should work for most environments, but slow networks or overloaded InfluxDB instances may require higher values (e.g., 30000ms = 30 seconds).

Butler SOS automatically retries failed writes with exponential backoff (up to 3 retry attempts).
:::

::: warning InfluxDB v3 Architecture
InfluxDB 3.x uses a different client library (`@influxdata/influxdb3-client`) and writes data using line protocol directly to databases instead of the organization/bucket model used in v2.x.
:::

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

## InfluxDB v3 Schema Differences

InfluxDB 3 Core has a different internal architecture compared to v1/v2. It stores both tags and fields as columns in a table structure, which means **tags and fields cannot have the same name** within a measurement.

### Field Name Changes

To comply with this requirement, Butler SOS uses the `_field` suffix for certain field names in InfluxDB v3 that would otherwise conflict with tag names:

#### User Events (`user_event` measurement)

| v1/v2 Field Name | v3 Field Name    | Reason                        |
| ---------------- | ---------------- | ----------------------------- |
| `userId`         | `userId_field`   | Conflicts with `userId` tag   |
| `userFull`       | `userFull_field` | Conflicts with `userFull` tag |
| `appId`          | `appId_field`    | Conflicts with `appId` tag    |
| `appName`        | `appName_field`  | Conflicts with `appName` tag  |

#### Log Events (`log_event` measurement)

Different log event sources have different field/tag conflicts:

**Engine logs:**

| v1/v2 Field Name | v3 Field Name       | Reason                                       |
| ---------------- | ------------------- | -------------------------------------------- |
| `result_code`    | `result_code_field` | Conflicts with conditional `result_code` tag |

**Proxy logs:**

| v1/v2 Field Name | v3 Field Name       | Reason                                       |
| ---------------- | ------------------- | -------------------------------------------- |
| `result_code`    | `result_code_field` | Conflicts with conditional `result_code` tag |

**Scheduler logs:**

| v1/v2 Field Name | v3 Field Name    | Reason                                    |
| ---------------- | ---------------- | ----------------------------------------- |
| `app_id`         | `app_id_field`   | Conflicts with conditional `app_id` tag   |
| `app_name`       | `app_name_field` | Conflicts with conditional `app_name` tag |

**Repository logs:**

| v1/v2 Field Name | v3 Field Name       | Reason                                       |
| ---------------- | ------------------- | -------------------------------------------- |
| `result_code`    | `result_code_field` | Conflicts with conditional `result_code` tag |

**QIX Performance logs:**

| v1/v2 Field Name | v3 Field Name  | Reason                                  |
| ---------------- | -------------- | --------------------------------------- |
| `app_id`         | `app_id_field` | Conflicts with conditional `app_id` tag |

### Migration Considerations

::: tip Query Updates Required
If you're migrating from InfluxDB v1/v2 to v3, you'll need to update:

- Grafana dashboard queries
- Any custom queries or scripts
- Alerting rules that reference these fields

:::

**Example query migration:**

```sql
-- InfluxDB v1/v2 query
SELECT userId, appName FROM user_event WHERE userId = 'tom'

-- InfluxDB v3 query
SELECT userId_field, appName_field FROM user_event WHERE userId = 'tom'
```

Note that **tags remain unchanged** - only field names are affected. You can still filter using tag names like `userId`, `appName`, `result_code`, etc.

### Measurements Not Affected

The following measurements have NO schema differences between v1/v2 and v3:

- Health metrics (`sense_server`, `mem`, `apps`, `cpu`, `session`, `users`, `cache`, `saturated`)
- Session metrics (`user_session_summary`, `user_session_list`, `user_session_details`)
- Butler SOS memory usage (`butlersos_memory_usage`)
- Event counts (event count measurements)
- Queue metrics (queue metric measurements)
