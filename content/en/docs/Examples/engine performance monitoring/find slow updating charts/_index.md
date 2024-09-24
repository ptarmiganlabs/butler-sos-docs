---
title: "Find charts that are slow to update"
linkTitle: "Find slow charts"
weight: 200
description: >
  This example shows how to use Butler SOS to monitor which parts of a Qlik Sense app that are slow to update.
---

## Overview

### Goal

The goal is to monitor how long each app object in a Sense app takes to open, and also identify which objects are slow to update.  
This is useful for several reasons:

- Identify misbehaving charts, tables etc in important apps. This can be especially important for apps that are used by many users, or that are in some way business critical.
- To get a baseline for how long it takes for each app object (chart, table, ...) to open and update. This can then be used to set thresholds for alerts, or to identify when performance degrades over time.
- An end user may experience slow performance when interacting with an app. By monitoring the time it takes for each object to both open and update when selections are done, you can identify which objects are slow to update.

A Grafana chart showing this data for the app "Training - Field indexing" could look something like this:

{{< imgproc butler-sos-accepted-performance-log-events-7 Resize "1200x" >}}
In order to understand the chart you must also know the ID of each app object. More on this further down this page.
{{< /imgproc >}}

### Prerequisites

- Butler SOS 11.0 or later. Downloads are available [here](https://github.com/ptarmiganlabs/butler-sos/releases).
- Store the data collected by Butler SOS in an InfluxDB v1 or v2 database. Setup instructions [here](/docs/getting_started/setup/influxdb/)
- XML appender files deployed on the Sense servers you want to monitor. The appender files tell Sense to send log events to Butler SOS via UDP messages. Setup instructions [here](/docs/getting_started/setup/qlik-sense-events/#log-appender-xml-files).
- A reasonably recent version of [Grafana](https://grafana.com/grafana/download). At the time of writing, Grafana 11.2 is the latest version.
- Data connetions set up in Grafana to the InfluxDB database where Butler SOS stores its data.
- A way to get the ID of each app object in the Sense apps you want to monitor. This can be done [several way](/docs/getting_started/setup/qlik-sense-events/log-events/performance-log-events/#filter-applying-to-specific-apps).

### The app being monitored

The "Training - Field indexing" app is used as an example in this tutorial.  
It's a basic app that is used to explain to Sense developers how in-app data indexing works in Qlik Sense.

The consists of a single table with two fields, with 10 million rows of random data:

{{< imgproc butler-sos-accepted-performance-log-events-11 Resize "1200x" >}}
Data model in the "Training - Field indexing" app.
{{< /imgproc >}}

The "LongStrings" field contains random strings of 32 characters each.

The idea of the app is to stress the Sense engine by having it index random data - something that can be done, but also something that will be slower and slower as the number of rows or the length of the "LongStrings" field increases.

There are two things that may require a lot of time to update in this app:

1. Opening the app when it is not already in memory. This will trigger an indexing of the data, which takes time given the randomness of the data and the number of rows.
2. Making a selection in the app once it is open. This will trigger a re-indexing of the *selected* data, which can also take some time (depending on what/how much data is selected).

### A word of caution

Enabling detailed performance monitoring can generate a lot of data, especially if it is enabled for many apps.  
This can lead to a large amount of data being stored in InfluxDB, which in turn can lead to performance issues in InfluxDB and Grafana.

It is therefore recommended to only enable detailed performance monitoring for a limited number of apps, and possibly only for a limited time period.

For example, it can be useful to start off by monitoring all app objects in an app to begin with, and then limit the monitoring to only a few objects that are of special interest.  
It's also possible to limit the monitoring to only certain app object types, such as charts and tables, and not other object types.

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
  logEvents:
    udpServerConfig:
      serverHost: 0.0.0.0           # Host/IP where log event server will listen for events from Sense
      portLogEvents: 9996           # Port on which log event server will listen for events from Sense
    tags:
      - name: env
        value: DEV
      - name: foo
        value: bar
    ...
    ...
    enginePerformanceMonitor:           # Detailed app performance data extraction from log events
      enable: true                      # Should app performance data be extracted from log events?
      appNameLookup:                    # Should app names be looked up based on app IDs?
        enable: true
      ...
      ...
      monitorFilter:                    # What objects should be monitored? Entire apps or just specific object(s) within some specific app(s)?
                                        # Two kinds of monitoring can be done:
                                        # 1) Monitor all apps, except those listed for exclusion. This is defined in the allApps section.
                                        # 2) Monitor only specific apps. This is defined in the appSpecific section.
                                        # An event will be accepted if it matches any of the rules in the allApps section OR any of the rules in the appSpecific section.
        allApps:
          enable: false                 # Should all apps be monitored?
          appExclude:                   # What apps should be excluded from monitoring?
                                        # If both appId and appName are specified, both must match the event's data for it to be considered a match.
t          objectType:
            allObjectTypes: false       # Should all object types be monitored?
            allObjectTypesExclude:      # If allObjectTypes is set to true, the object types in this array are excluded from monitoring. 
                                        # someObjectTypesInclude (below) is ignored in that case.
            someObjectTypesInclude:     # What object types should be included in monitoring?
                                        # Only applicable if allObjectTypes is set to false.
          method:
            allMethods: false           # Should all methods be monitored?
            allMethodsExclude:          # If allMethods is set to true, the methods in this array are excluded from monitoring.
                                        # someMethodsInclude (below) is ignored in that case.
            someMethodsInclude:         # What methods should be included in monitoring?
                                        # Only applicable if allMethods is set to false.
        appSpecific:
          enable: true                  # Should app specific monitoring be done?
          app:
            - include:                  # What apps should be monitored?
                                        # If both appId and appName are specified, both must match the event's data for it to be considered a match.
                - appName: Training - Field indexing
              objectType:                 
                allObjectTypes: true   # Should all object types be monitored?
                allObjectTypesExclude:  # If allObjectTypes is set to true, the object types in this array are excluded from monitoring. 
                                        # someObjectTypesInclude (below) is ignored in that case.
                someObjectTypesInclude: # What object types should be included in monitoring?
                                        # Only applicable if allObjectTypes is set to false.
              appObject:
                allAppObjects: true     # Should all app objects be monitored?
                allAppObjectsExclude:   # If allAppObjects is set to true, the app objects in this array are excluded from monitoring.
                                        # someAppObjectsInclude (below) is ignored in that case.
                someAppObjectsInclude:  # What app objects should be included in monitoring?
                                        # Only applicable if allAppObjects is set to false.
              method: 
                allMethods: true        # Should all methods be monitored?
                allMethodsExclude:      # If allMethods is set to true, the methods in this array are excluded from monitoring.
                                        # someMethodsInclude (below) is ignored in that case.
                someMethodsInclude:     # What methods should be included in monitoring?
                                        # Only applicable if allMethods is set to false.
```

## Configure Grafana

With the above Butler SOS configuration in place (remember to restart Butler SOS after making changes to its configuration file), you can now set up Grafana to visualize the data.

Here is a chart that shows the average time it takes for each app object in the "Training - Field indexing" app to open and update (the chart shown at the top of this page):

{{< imgproc butler-sos-accepted-performance-log-events-13 Resize "1200x" >}}
Definition of a Grafana chart showing the average time it takes to open and update each app object in the "Training - Field indexing" app.
{{< /imgproc >}}

### Grafana variables

The chart repeats itself over the "app_name_monitored" Grafana variable, which means one chart is shown for each selected app in that variable filter (at the top of the Grafana dashboard).  
The variable is set up like this:

{{< imgproc butler-sos-grafana-variables-1 Resize "1200x" >}}
List of variables in a SenseOps dashboard in Grafana.
{{< /imgproc >}}

{{< imgproc butler-sos-grafana-variables-monitored-apps-1 Resize "1200x" >}}
Definition of the "app_name_monitored" Grafana variable.
{{< /imgproc >}}

## Next steps

Given the detailed information captured about all app objects in the "Training - Field indexing" app, it is possible to slice and dice the data in many ways.

For example, it could be interesting to see what *kinds* of app objects use most time, and which ones are faster.  
Something like this:

{{< imgproc butler-sos-accepted-performance-log-events-14 Resize "1200x" >}}
Chart showing the *total* time spent updating the "Training - Field indexing" app, grouped by object type, during last hour.
{{< /imgproc >}}
