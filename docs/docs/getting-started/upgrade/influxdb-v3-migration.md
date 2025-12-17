---
outline: deep
---

# Migrating to InfluxDB v3

This guide covers migration from InfluxDB v1 or v2 to InfluxDB v3 for Butler SOS.

## What's New in v3

InfluxDB 3.x represents a major architectural change:

- **New storage engine** - Apache Arrow-based columnar storage
- **Enhanced performance** - Improved query and write performance
- **Cloud-native design** - Better scalability and resource efficiency
- **New client library** - Uses `@influxdata/influxdb3-client`
- **Database model** - Uses databases instead of buckets (v2) or just database names (v1)

## Breaking Changes

### Data Types

**CPU Metrics:** In InfluxDB v3, CPU metrics are stored as integers (0-100) rather than floats. No significant loss of precision, but saving some bytes and gaining some performance. Negligible precision loss compared to v1/v2.

### Tag/Field Name Conflicts

**Critical:** InfluxDB v3 does not allow the same name to be used for both tags and fields within a measurement. Butler SOS automatically handles this by using the `_field` suffix for conflicting field names when saving data to InfluxDB v3.

Described below are the specific field name changes.

#### User Events

In the `user_events` measurement:

| v1/v2 Field Name | v3 Field Name    | Notes                  |
| ---------------- | ---------------- | ---------------------- |
| `userId`         | `userId_field`   | Tag `userId` remains   |
| `userFull`       | `userFull_field` | Tag `userFull` remains |
| `appId`          | `appId_field`    | Tag `appId` remains    |
| `appName`        | `appName_field`  | Tag `appName` remains  |

#### Log Events

In the `log_event` measurement (varies by source):

**Engine logs:**

- `result_code` → `result_code_field`

**Proxy logs:**

- `result_code` → `result_code_field`

**Scheduler logs:**

- `app_id` → `app_id_field`
- `app_name` → `app_name_field`

**Repository logs:**

- `result_code` → `result_code_field`

**QIX Performance logs:**

- `app_id` → `app_id_field`

::: tip Important
Tags remain unchanged. Only field names are affected. You can still filter by tags using the original names (e.g., `WHERE userId = 'tom'`).
:::

### Configuration Changes

InfluxDB v3 uses `v3Config` instead of `v2Config` or `v1Config`:

**v1 Config:**

```yaml
version: 1
v1Config:
  dbName: SenseOps
  auth:
    enable: true
    username: myuser
    password: mypass
  retentionPolicy:
    name: 10d
    duration: 10d
```

**v3 Config:**

```yaml
version: 3
v3Config:
  database: butler-sos
  token: mytoken
  description: Butler SOS metrics
  retentionDuration: 10d
  timeout: 10000 # Optional
  queryTimeout: 60000 # Optional
```

Key differences:

- Uses `database` instead of `dbName` (v1) or `bucket` (v2)
- Requires token-based authentication (no username/password)
- Different retention policy syntax
- Added optional timeout configurations

## Migration Steps

### Step 1: Install InfluxDB v3

You can use Docker Compose to quickly set up InfluxDB v3:

```bash
# Navigate to Butler SOS directory
cd butler-sos

# Start InfluxDB v3 with Docker Compose
docker-compose -f docker-compose_fullstack_influxdb_v3.yml up -d
```

This starts:

- InfluxDB v3 Community Edition (port 8086)
- Grafana (port 3000)
- Butler SOS configured for v3

**Default credentials:**

- InfluxDB token: `mytoken`
- InfluxDB database: `butler-sos`
- Grafana: admin/admin

### Step 2: Update Configuration

Update your Butler SOS configuration file:

```yaml
Butler-SOS:
  influxdbConfig:
    enable: true
    host: localhost # or your InfluxDB v3 hostname
    port: 8086
    version: 3 # Change from 1 or 2

    v3Config:
      database: butler-sos # Database name (instead of dbName or bucket)
      token: mytoken # Authentication token
      description: Butler SOS metrics
      retentionDuration: 10d
      # Optional settings:
      timeout: 10000 # Socket timeout in ms (default: 10000)
      queryTimeout: 60000 # gRPC timeout in ms (default: 60000)
```

### Step 3: Update Environment (if using Docker)

If running Butler SOS in Docker, update your environment variable:

```bash
NODE_ENV=production_influxdb_v3
```

Or in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production_influxdb_v3
```

### Step 4: Update Grafana Dashboards

You'll need to update dashboard queries to use the new field names:

**Before (v1/v2):**

```sql
SELECT userId, appName FROM user_events WHERE userId = 'tom'
```

**After (v3):**

```sql
SELECT userId_field, appName_field FROM user_events WHERE userId = 'tom'
```

::: tip
Tags remain the same, so WHERE clauses using tags don't need changes:

- `WHERE userId = 'tom'` ✅ Still works
- `WHERE appName = 'Sales'` ✅ Still works
  :::

### Step 5: Test Configuration

Start Butler SOS and verify:

1. **Check logs** for successful InfluxDB connection:

   ```
   [INFO] Connected to InfluxDB v3: localhost:8086
   [INFO] Using database: butler-sos
   ```

2. **Verify data is being written**:

   ```bash
   # Query InfluxDB v3
   curl -X POST http://localhost:8086/api/v3/query_sql \
     -H "Authorization: Bearer mytoken" \
     -H "Accept: application/json" \
     -d '{"database": "butler-sos", "query": "SELECT * FROM sense_server LIMIT 5"}'
   ```

3. **Check Butler SOS health metrics** in Grafana

## Data Migration

### From v1 to v3

Direct migration requires exporting data from v1 and importing to v3:

1. **Export from v1:**

   ```bash
   influx -database 'SenseOps' -execute 'SELECT * FROM sense_server' -format csv > export.csv
   ```

2. **Transform data** (field names may need adjustment)

3. **Import to v3** using the InfluxDB v3 CLI or API

::: warning
Full historical data migration can be complex. Consider starting fresh with v3 and keeping v1 running in read-only mode for historical queries.
:::

### From v2 to v3

InfluxDB provides migration tools:

```bash
# Using influx CLI
influx backup -b mybucket /path/to/backup
# Then restore to v3 (consult InfluxDB v3 documentation)
```

::: tip
For most operational monitoring use cases, starting fresh with v3 is simpler than migrating historical data.
:::

## Queue Metrics

InfluxDB v3 support includes new queue metrics for monitoring Butler SOS event processing:

```yaml
Butler-SOS:
  userEvents:
    udpServerConfig:
      messageQueue:
        maxConcurrent: 10
        maxSize: 200
        backpressureThreshold: 80
      queueMetrics:
        influxdb:
          enable: true
          writeFrequency: 20000
          measurementName: user_events_queue
          tags:
            - name: qs_env
              value: production

  logEvents:
    udpServerConfig:
      queueMetrics:
        influxdb:
          enable: true
          writeFrequency: 20000
          measurementName: log_events_queue
```

New measurements:

- `user_events_queue` - User event queue metrics
- `log_events_queue` - Log event queue metrics

Fields tracked:

- `queue_size` - Current queue size
- `queue_utilization` - Queue utilization percentage
- `messages_processed` - Total messages processed
- `messages_dropped` - Messages dropped due to full queue

## Rollback Procedure

If you need to rollback to v1 or v2:

1. **Stop Butler SOS**

2. **Revert configuration:**

   ```yaml
   version: 2 # or 1
   # Remove v3Config, restore v2Config or v1Config
   ```

3. **Restart Butler SOS**

4. **Point Grafana back to old database**

::: tip
Keep your old InfluxDB instance running until you're confident v3 is working correctly.
:::

## Troubleshooting

### Connection Issues

**Error:** `Unable to connect to InfluxDB v3`

**Solutions:**

- Verify InfluxDB v3 is running: `docker ps` or check service status
- Check host and port in configuration
- Verify token is correct
- Check firewall rules

### Timeout Errors

**Error:** `Write timeout` or `Query timeout`

**Solutions:**

```yaml
v3Config:
  timeout: 30000 # Increase to 30 seconds
  queryTimeout: 120000 # Increase to 2 minutes
```

### Authentication Errors

**Error:** `Authentication failed`

**Solutions:**

- Verify token is correct
- Check token has write permissions to the database
- Ensure database exists (Butler SOS will create it if it doesn't)

### Data Not Appearing

**Checklist:**

1. Check Butler SOS logs for write errors
2. Verify `influxdbConfig.enable: true`
3. Check database name matches v3Config
4. Query database directly to verify data is written
5. Check Grafana datasource configuration

## Performance Considerations

### Retry Logic

Butler SOS v3 includes automatic retry with exponential backoff:

- Up to 3 retry attempts
- Exponential backoff: 1s, 2s, 3s
- Configurable via code (not in config file)

### Write Performance

Tips for optimal performance:

- Enable queue metrics to monitor backpressure
- Adjust queue size if needed:
  ```yaml
  messageQueue:
    maxSize: 500 # Increase if messages are being dropped
  ```

### Query Performance

InfluxDB v3 uses Apache Arrow and offers better query performance:

- Columnar storage for faster aggregations
- Improved indexing
- Better memory efficiency

## Additional Resources

- [InfluxDB v3 Documentation](https://docs.influxdata.com/influxdb/v3/)
- [Butler SOS Configuration Reference](/docs/reference/config-file-format)
- [Available Metrics](/docs/reference/available-metrics/influxdb)
- [Docker Compose Examples](https://github.com/ptarmiganlabs/butler-sos/tree/master/docs)

## Getting Help

If you encounter issues:

1. Check Butler SOS logs for detailed error messages
2. Verify your configuration matches the examples
3. Review the [GitHub issues](https://github.com/ptarmiganlabs/butler-sos/issues)
4. Ask questions in [GitHub Discussions](https://github.com/ptarmiganlabs/butler-sos/discussions)
