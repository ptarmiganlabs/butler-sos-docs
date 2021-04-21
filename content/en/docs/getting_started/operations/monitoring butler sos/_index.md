---
title: 'Monitoring Butler SOS'
linkTitle: 'Monitoring Butler SOS'
weight: 10
description: >
    Options for monitoring Butler SOS itself.
---

## Monitoring Butler SOS

Once Butler SOS is running it's a good idea to also monitor it. Otherwise you stand the risk of not getting notified if Butler SOS for some reason misbehaves.

Butler SOS will log data on its memory usage to InfluxDB if

1. The config file's `Butler-SOS.uptimeMonitor.enables` and `Butler.uptimeMonitor.storeInInfluxdb.butlerSOSMemoryUsage` properties are both set to `true`.
2. The remaining InfluxDB properties of the config file are correctly configured.

Assuming everything is correctly set up, you can then create a Grafana dashboard showing Butler SOS' memory use over time.  
You can also set up alerts in Grafana if so desired, with notifications going to most IM tools and email.

A Grafana dashboard can look like this. This particular chart is for the [Butler](https://butler.ptarmiganlabs.com) tool, but the concept for Butler SOS is the same.

![alt text](butler-memory-usage-grafana-1.png "Butler SOS memory usage in Grafana dashboard")  

There is a [sample Grafana dashboard](https://github.com/ptarmiganlabs/butler-sos/tree/master/docs/grafana) in Butler SOS' GitHub repo.
