---
outline: deep
---

# Setting up InfluxDB

Butler SOS can store metrics in InfluxDB.

::: info Optional but Recommended
These settings are optional, but highly recommended.

In theory you can use Butler SOS to pull metrics from Qlik Sense and then forward the metrics as MQTT messages, not storing the data in InfluxDB (no Grafana dashboards then!).

By far the most common use case is to store the metrics in InfluxDB. If you already have Prometheus deployed you can use it instead of InfluxDB, see the [Prometheus config page](/docs/getting-started/setup/prometheus).

Using InfluxDB is enabled by default in the config file.
:::

::: info InfluxDB Version Support
Butler SOS supports InfluxDB 1.x, 2.x, and 3.x.

There are reports that InfluxDB's cloud product also works with Butler SOS, but that has not been tested by the Butler SOS team.

**Version 3.x is now supported** (Butler SOS 15+). See the [migration guide](/docs/getting-started/upgrade/influxdb-v3-migration) for details on upgrading from v1 or v2.
:::

## What's This?

[InfluxDB](https://www.influxdata.com/get-influxdb/) is a time series database. This means it is optimized for storing data that's somehow linked to a timestamp. Measurements and metrics are some of the most obvious kinds of data for which InfluxDB was created.

Butler SOS stores data in InfluxDB in full detail, i.e. Butler SOS doesn't do any aggregation of older data points.

This has a few consequences:

- If you are monitoring many Sense servers and/or query Sense for health metrics very frequently and/or have a long InfluxDB retention policy (many months or even years) you will eventually end up with _lots_ of data.
- You should ask yourself how far back you need to look at operational data such as the one collected by Butler SOS. In most cases 30 or 45 days history will be more than enough. 10-14 days are usually a good starting point. Use the `Butler-SOS.influxdbConfig.retentionPolicy` section of the config file to create a retention policy for Butler SOS.
- If you need longer history you should consider using InfluxDB's excellent aggregation features. These can assist in aggregating older data points, with the effect that you can then keep virtually unlimited history. The older data will not be as detailed (fewer samples per time period) - but you will still have an averaged view of what the history looked like.

::: tip Note
Instructions for how to aggregate old data is beyond the scope of this documentation.
:::

::: tip Note
The retention policy specified in the config file will only be created if the InfluxDB database specified in the config file does **_NOT_** exist when Butler SOS is started.

I.e. if you store data to an existing InfluxDB database, the retention policy will not be created.
:::

## Settings in Main Config File

```yaml
Butler-SOS:
  ...
  ...
  # Influx db config parameters
  influxdbConfig:
    enable: true
    # Items below are mandatory if influxdbConfig.enable=true
    host: influxdb.mycompany.com    # InfluxDB host, hostname, FQDN or IP address
    port: 8086                      # Port where InfluxDB is listening, usually 8086
    version: 1                      # InfluxDB version: 1, 2, or 3
    v3Config:                       # Settings for InfluxDB v3.x only, i.e. Butler-SOS.influxdbConfig.version=3
      database: butler-sos          # Database name
      token: mytoken                # Authentication token
      description: Butler SOS metrics
      retentionDuration: 10d        # Data retention period
      timeout: 10000                # Optional: Socket timeout in ms (default: 10000)
      queryTimeout: 60000           # Optional: Query timeout in ms (default: 60000)
    v2Config:                       # Settings for InfluxDB v2.x only, i.e. Butler-SOS.influxdbConfig.version=2
      org: myorg
      bucket: mybucket
      description: Butler SOS metrics
      token: mytoken
      retentionDuration: 10d
    v1Config:                       # Settings below are for InfluxDB v1.x only, i.e. Butler-SOS.influxdbConfig.version=1
      auth:
        enable: false               # Does InfluxDB instance require authentication (true/false)?
        username: <username>        # Username for InfluxDB authentication. Mandatory if auth.enable=true
        password: <password>        # Password for InfluxDB authentication. Mandatory if auth.enable=true
      dbName: SenseOps
      # Default retention policy that should be created in InfluxDB when Butler SOS creates a new database there.
      # Any data older than retention policy threshold will be purged from InfluxDB.
      retentionPolicy:
        name: 10d
        duration: 10d               # Possible duration units here: https://docs.influxdata.com/influxdb/v1.8/query_language/spec/#durations
    # Control whether certain metrics are stored in InfluxDB or not
    # Use with caution! Enabling activeDocs, loadedDocs or inMemoryDocs may result in lots of data sent to InfluxDB.
    includeFields:
      activeDocs: false             # Should data on what docs are active be stored in InfluxDB (true/false)?
      loadedDocs: false             # Should data on what docs are loaded be stored in InfluxDB (true/false)?
      inMemoryDocs: false           # Should data on what docs are in memory be stored in InfluxDB (true/false)?
  ...
  ...
```
