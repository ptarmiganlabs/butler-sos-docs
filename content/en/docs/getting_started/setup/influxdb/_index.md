---
title: "Setting up InfluxDB time series database"
linkTitle: "InfluxDB"
weight: 90
description: >
  Butler SOS can store metrics in InfluxDB.
---

{{% alert title="Optional" color="primary" %}}
These settings are optional, but highly recommended.

In theory you can use Butler SOS to pull metrics from Qlik Sense and then forward the metrics as MQTT messages, not storing the data in InfluxDB (no Grafana dashboards then!).

By far the most common use case is to store the metrics in InfluxDB.
{{% /alert %}}

{{< notice warning >}}
Butler SOS was developed with InfluxDB version 1.x in mind.  

InfluxDB is currently available in version 2.x and while this version brings lots of new goodies, it's not out-of-the-box compatible with Butler SOS.  
For that reason you should use the latest 1.x version of InfluxDB, which at the time of this writing is 1.8.4.

In due time Butler SOS will be updated to support InfluxDB 2.x too.
{{< /notice >}}

## What's this?

[InfluxDB](https://www.influxdata.com/get-influxdb/) is a time series database. This means it is optimised for storing data that's somehow linked to a timestamp.  
Measurements and metrics are some of the most obvious kinds of data for which InfluxDB was created.

Butler SOS stores data in InfluxDB in full detail, i.e. Butler SOS doesn't do any aggregation of older data points.  
This has a few consequences:

- If you are monitoring many Sense servers and/or have a long InfluxDB retention policy (many months or even years) you will eventually end up with *lots* of data.
- You should ask yourself how far back you need to look at operational data such as the one collected by Butler SOS. In most cases 30 or 45 days history will be more than enough. 10-14 days may even be enough. Use the `Butler-SOS.influxdbConfig.retentionPolicy` section of the config file to create a retention policy for Butler SOS.
- If you need longer history you should consider using InfluxDB's excellent aggregation features. These can assist in aggregating older data points, with the effect that you can then keep virtually unlimited history. The older data will not be as detailed (fewwer samples per minute, effectively) - but you will still have an averaged view of what the history looked like.

**Note 1:** Instructions for how to aggregate old data is beyond the scope of this documentation.

**Note 2:** The retention policy specified in the config file will only be created if the InfluxDB database specified in the config file does ***NOT*** exist when Butler SOS is started.  
I.e. if you store data to an existing InfluxDB database, the retention policy will not be created.

## Settings in main config file

```yaml
Butler-SOS:
  ...
  ...
  # Influx db config parameters
  influxdbConfig:
    enable: true
    # Items below are mandatory if influxdbConfig.enable=true
    hostIP: <IP or FQDN of Influxdb server>
    hostPort: <Port where Influxdb is listening>    # Optional. Default value=8086
    auth:
      enable: false                 # Does influxdb instance require authentication (true/false)?
      username: <username>          # Username for Influxdb authentication. Mandatory if auth.enable=true
      password: <password>          # Password for Influxdb authentication. Mandatory if auth.enable=true
    dbName: SenseOps

    # Default retention policy that should be created in InfluxDB when Butler SOS creates a new database there. 
    # Any data older than retention policy threshold will be purged from InfluxDB.
    retentionPolicy:
      name: 10d
      duration: 10d

    # Control whether certain fields are stored in InfluxDB or not
    # Use with caution! Enabling activeDocs, loadedDocs or inMemoryDocs may result in lots of data sent to InfluxDB.
    includeFields:
      activeDocs: false              # Should data on what docs are active be stored in Influxdb (true/false)? 
      loadedDocs: false              # Should data on what docs are loaded be stored in Influxdb (true/false)?
      inMemoryDocs: false            # Should data on what docs are in memory be stored in Influxdb (true/false)?
  ...
  ...
```
