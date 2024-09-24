---
title: "Count user and log events"
linkTitle: "Count user/log events"
weight: 250
description: >
  This example shows how to use Butler SOS to count user and log events received from one or more Qlik Sense servers.
---

## Overview

### Goal

The goal is to count how many  user and log events are received from one or more Qlik Sense servers.

This can be useful for several reasons:

- To get a general feeling if the Qlik Sense environment is healthy or not. A sudden increase in the number of warnings, errors or fatals can be an early warning sign that something is wrong. The event counters can be seen as a kind of heart beat of the Qlik Sense environment. Too fast - or too slow - can be a sign of trouble.
- The counters count **all** log and user events sent from the Qlik Sense servers to Butler SOS. They can be used to confirm tha the Qlik Sense servers are indeed sending events to Butler SOS at all. Other, more detailed event data can then be used to drill down into the details of what is happening in the Qlik Sense environment.

A Grafana dashboard is used to visualize the event counters:

{{< imgproc butler-sos-event-counter-2 Resize "1200x" >}}
A set of Grafana panels showing the number of user and log events received from two Qlik Sense servers. The panels are broken down by event type (log or user) and by server. The table contains event count per host, Sense service and subsystem.
{{< /imgproc >}}

### Prerequisites

- Butler SOS 11.0 or later. Downloads are available [here](https://github.com/ptarmiganlabs/butler-sos/releases).
- Store the data collected by Butler SOS in an InfluxDB v1 or v2 database. Setup instructions [here](/docs/getting_started/setup/influxdb/)
- XML appender files deployed on the Sense servers you want to monitor. The appender files tell Sense to send log events to Butler SOS via UDP messages. Setup instructions [here](/docs/getting_started/setup/qlik-sense-events/#log-appender-xml-files).
- A reasonably recent version of [Grafana](https://grafana.com/grafana/download). At the time of writing, Grafana 11.2 is the latest version.
- Data connetions set up in Grafana to the InfluxDB database where Butler SOS stores its data.

## Configure Butler SOS

{{< notice info >}}
InfluxDB is the only supported database for this feature.  
It is configured elsewhere in the YAML config file, more info [here](/docs/getting_started/setup/influxdb/).
{{< /notice >}}

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

The upper left panel of the Grafana dashboard at the top of this page is defined as below.

Note the two-layered query.  
It is needed to get the data from the InfluxDB database in a format that Grafana can use.

{{< imgproc butler-sos-event-counter-3 Resize "1200x" >}}
Total count of user and log events received from two Qlik Sense servers.
{{< /imgproc >}}

There are also a couple of transformations applied to the data:

{{< imgproc butler-sos-event-counter-4 Resize "1200x" >}}
Transformations applied to the data before it's displayed in the Grafana panel. The sorting is done to make sure the data is displayed in the correct order. Renaming/reorder is not used in this exampe.
{{< /imgproc >}}

### Count of user and log events per host

The center left panel of the Grafana dashboard at the top of this page is defined as below.  
The query is very similar to the one above, but with a different grouping.

{{< imgproc butler-sos-event-counter-5 Resize "1200x" >}}
Count of user and log events per host.
{{< /imgproc >}}

Transformations...

{{< imgproc butler-sos-event-counter-6 Resize "1200x" >}}
Transformations applied to the data before it's displayed in the Grafana panel.
{{< /imgproc >}}

### Count of user and log events per event type

The lower left panel of the Grafana dashboard at the top of this page is defined as below.

{{< imgproc butler-sos-event-counter-7 Resize "1200x" >}}
Count of user and log events per event type.
{{< /imgproc >}}

Transformations...

{{< imgproc butler-sos-event-counter-8 Resize "1200x" >}}
Transformations applied to the data before it's displayed in the Grafana panel.
{{< /imgproc >}}

### Table of received events

The table at the right of the Grafana dashboard at the top of this page is defined as below.

{{< imgproc butler-sos-event-counter-9 Resize "1200x" >}}
Table of received events and event count per event type, host, Sense service/source and subsystem.
{{< /imgproc >}}

Transformations...

{{< imgproc butler-sos-event-counter-10 Resize "1200x" >}}
Transformations applied to the data before it's displayed in the Grafana panel.
{{< /imgproc >}}

## Next steps

