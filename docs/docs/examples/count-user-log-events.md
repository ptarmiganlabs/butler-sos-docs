---
outline: deep
---

# Count User and Log Events

This example shows how to use Butler SOS to count user and log events received from one or more Qlik Sense servers.

## Overview

### Goal

The goal is to count how many user and log events are received from one or more Qlik Sense servers.

This can be useful for several reasons:

- **Environment health monitoring** - A sudden increase in the number of warnings, errors or fatals can be an early warning sign that something is wrong. The event counters can be seen as a kind of heartbeat of the Qlik Sense environment. Too fast - or too slow - can be a sign of trouble.
- **Connectivity verification** - The counters count **all** log and user events sent from the Qlik Sense servers to Butler SOS. They can be used to confirm that the Qlik Sense servers are indeed sending events to Butler SOS at all. Other, more detailed event data can then be used to drill down into the details of what is happening in the Qlik Sense environment.

![Event Counter Dashboard](/img/examples/butler-sos-event-counter-2.png)
_A set of Grafana panels showing the number of user and log events received from two Qlik Sense servers. The panels are broken down by event type (log or user) and by server. The table contains event count per host, Sense service and subsystem._

### Prerequisites

- Butler SOS 11.0 or later. [Download from GitHub releases](https://github.com/ptarmiganlabs/butler-sos/releases).
- Store the data collected by Butler SOS in an InfluxDB v1 or v2 database. [InfluxDB setup instructions](/docs/getting-started/install/influxdb-grafana).
- XML appender files deployed on the Sense servers you want to monitor. The appender files tell Sense to send log events to Butler SOS via UDP messages.
- A reasonably recent version of [Grafana](https://grafana.com/grafana/download). At the time of writing, Grafana 11.2 is the latest version.
- Data connections set up in Grafana to the InfluxDB database where Butler SOS stores its data.

## Configure Butler SOS

::: info Database requirement
InfluxDB is the only supported database for this feature.
See the [config file format reference](/docs/reference/config-file-format) for details.
:::

```yaml
  # Shared settings for user and log events (see below)
  qlikSenseEvents:                  # Shared settings for user and log events (see below)
    influxdb:
      enable: true                  # Should summary (counter) of user/log events, and rejected events be stored in InfluxDB?
      writeFrequency: 20000         # How often (milliseconds) should event counts be written to InfluxDB?
  ...
  ...
  # Log events are used to capture Sense warnings, errors and fatals in real time
  # Shared settings for user and log events (see below)
  qlikSenseEvents:                  # Shared settings for user and log events (see below)
    influxdb:
      enable: true                  # Should summary (counter) of user/log events, and rejected events be stored in InfluxDB?
      writeFrequency: 20000         # How often (milliseconds) should rejected event count be written to InfluxDB?
    eventCount:                     # Track how many log and user events are received from Sense.
                                    # Some events are valid, some are not. Of the valid events, some are rejected by Butler SOS
                                    # based on the configuration in this file.
      enable: true                  # Should event count be stored in InfluxDB?
      influxdb:
        measurementName: event_count # Name of the InfluxDB measurement where event count is stored
        tags:                       # Tags are added to the data before it's stored in InfluxDB
          - name: qs_tag1
            value: somevalue1
          - name: qs_tag2
            value: somevalue2
```

## Configure Grafana

### Total count of user and log events received from two Qlik Sense servers

The upper left panel of the Grafana dashboard uses a two-layered query to get the data from InfluxDB in a format that Grafana can use.

![Total Event Count Query](/img/examples/butler-sos-event-counter-3.png)
_Total count of user and log events received from two Qlik Sense servers._

![Event Count Transformations](/img/examples/butler-sos-event-counter-4.png)
_Transformations applied to the data before it's displayed in the Grafana panel. The sorting is done to make sure the data is displayed in the correct order._

### Count of user and log events per host

The center left panel uses a similar query but with different grouping.

![Events per Host Query](/img/examples/butler-sos-event-counter-5.png)
_Count of user and log events per host._

![Events per Host Transformations](/img/examples/butler-sos-event-counter-6.png)
_Transformations applied to the data before it's displayed in the Grafana panel._

### Count of user and log events per event type

The lower left panel breaks down events by type.

![Events per Type Query](/img/examples/butler-sos-event-counter-7.png)
_Count of user and log events per event type._

![Events per Type Transformations](/img/examples/butler-sos-event-counter-8.png)
_Transformations applied to the data before it's displayed in the Grafana panel._

### Table of received events

A table view shows event counts per event type, host, Sense service/source and subsystem.

![Events Table Query](/img/examples/butler-sos-event-counter-9.png)
_Table of received events and event count per event type, host, Sense service/source and subsystem._

![Events Table Transformations](/img/examples/butler-sos-event-counter-10.png)
_Transformations applied to the data before it's displayed in the Grafana panel._

## Next Steps

- Learn about [engine performance monitoring](/docs/examples/engine-performance/) for more detailed app-level monitoring
- Explore [Grafana dashboards](/docs/examples/grafana/) for more visualization examples
- Review the [available metrics](/docs/reference/available-metrics/) to understand what data is available
