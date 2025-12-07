---
title: "Track how long it takes to open Sense apps"
linkTitle: "Open time for apps"
weight: 100
description: >
  This example shows how to use Butler SOS to track how long it takes to open apps on a Qlik Sense server.
---

## Overview

### Goal

The goal is to show how to use Butler SOS to track how long it takes to open apps on a Qlik Sense server.

This is useful for several reasons:

- It provides baseline for how long it takes to usually open apps on your server, and allows you to track changes over time.
- It can help identify apps that are slow to open, and then investigate why.
- Add Grafana based alerts to get notified when the time to open some app(s) exceeds a certain threshold.
- If end users complain about slow app opening times, the concept in this tutorial can be used to verify if there actually is a problem, and if so, where and how severe it is.

A Grafana chart showing this data could look something like this:

{{< imgproc butler-sos-rejected-performance-log-events-2 Resize "1200x" >}}
Chart showing mean time needed to open apps on a Qlik Sense server.
{{< /imgproc >}}

### Prerequisites

- Butler SOS 11.0 or later. Downloads are available [here](https://github.com/ptarmiganlabs/butler-sos/releases).
- Store the data collected by Butler SOS in an InfluxDB v1 or v2 database. Setup instructions [here](/docs/getting_started/setup/influxdb/)
- XML appender files deployed on the Sense servers you want to monitor. The appender files tell Sense to send log events to Butler SOS via UDP messages. Setup instructions [here](/docs/getting_started/setup/qlik-sense-events/#log-appender-xml-files).
- A reasonably recent version of [Grafana](https://grafana.com/grafana/download). At the time of writing, Grafana 11.2 is the latest version.
- Data connections set up in Grafana to the InfluxDB database where Butler SOS stores its data.

## Configure Butler SOS

1. Enable engine performance monitoring.
2. Enable tracking of rejected performance log events.  
   Butler SOS will track two things related to rejected events: Number of events (=counter), and the processing time for these events.
3. If detailed engine performance log events are enabled, Butler SOS will _not_ create counters for these events. Instead, it will store the detailed data in InfluxDB.  
   This data can then be aggregated to create the same kind of counters as for rejected engine performance log events.

Note: "Rejected events" are engine performance log events that do not meet the criteria set up in Butler SOS for _detailed_ engine performance monitoring.

Bottom line is that you can disable all detailed engine monitoring in Butler SOS, and only enable the tracking of rejected events.  
This will give you a counter for the number of rejected events, and the processing time for these events, across a set of dimensions - of which engine "method" is one.

Or you can enable detailed engine performance monitoring for some apps, and only track rejected events for others.

Either way it will be possible to create Grafana charts that show the average time it takes to open apps on your Sense server(s).

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
    rejectedEventCount:             # Rejected events are events that are received from Sense, that are correctly formatted,
                                    # but that are rejected by Butler SOS based on the configuration in this file.
                                    # An example of a rejected event is a performance log event that is filtered out by Butler SOS.
      enable: true                  # Should rejected events be counted and stored in InfluxDB?
      influxdb:
        measurementName: rejected_event_count # Name of the InfluxDB measurement where rejected event count is stored
  ...
  ...
  # Log events are used to capture Sense warnings, errors and fatals in real time
  logEvents:
    udpServerConfig:
      serverHost: 0.0.0.0           # Host/IP where log event server will listen for events from Sense
      portLogEvents: 9996           # Port on which log event server will listen for events from Sense
    tags:
      - name: qs_tag1
        value: somevalue1
      - name: qs_tag2
        value: somevalue2
    ...
    ...
    enginePerformanceMonitor:           # Detailed app performance data extraction from log events
      enable: true                      # Should app performance data be extracted from log events?
      appNameLookup:                    # Should app names be looked up based on app IDs?
        enable: true
      trackRejectedEvents:
        enable: true                    # Should events that are rejected by the app performance monitor be tracked?
        tags:                           # Tags are added to the data before it's stored in InfluxDB
          - name: qs_tag1
            value: somevalue1
          - name: qs_tag2
            value: somevalue2

```

## Configure Grafana

Create a Grafana chart (in an existing dashboard or a new one) that shows the average time it takes to open apps on your Sense server(s).  
You do this by only show data in the chart for the engine method `Global::OpenApp`.

The definition of such a chart in Grafana could look something like this (slightly different set of apps selected, compared to screenshot above):

{{< imgproc butler-sos-rejected-performance-log-events-definition-1 Resize "1200x" >}}
Definition of a Grafana chart showing the average time it takes to open apps on a Qlik Sense server.
{{< /imgproc >}}

Note how the tag `method` is set to `Global::OpenApp`. This is the engine method that is called when an app is opened in Qlik Sense, it covers the entire time it takes to open an app.

For apps currently not in memory, this will include the time it takes to load the app from disk (which can be significant for large apps).
For apps already in memory, the time for this method will be much shorter.

Also note how the `app_name` tag is used to filter out only the apps you are interested in, by matching it to the `app_name_unmonitored` variable.  
See below for detailed on how to set up this variable.

### Grafana variables

By using Grafana variables, you can easily change which apps you want to show data for in the chart.

Here is how you can set up a variable in Grafana that allows you to select which apps to show data for (see above too, for how to use this variable in a chart):

{{< imgproc butler-sos-create-app-name-variable-1 Resize "1200x" >}}
Create a Grafana variable that allows you to select which apps to show data for in a chart. The entire definition is not shown here, make sure to check the "Multi-value" and "Include All option" checkboxes too (further down that page).
{{< /imgproc >}}

## Next steps

Using the concept in this tutorial, but with a slightly different chart definition in Grafana, it is possible to visualise the mean time for each method that Butler SOS tracks.  
Combine with a app-selection filter variable in Grafana, and you can easily switch between different apps to see how long the various engine operations take in each of them:

{{< imgproc butler-sos-rejected-performance-log-events-3 Resize "1200x" >}}
Chart showing mean time for all engine methods that were used during the selected time interval, for the selected apps(s).
{{< /imgproc >}}
