---
title: "Available Metrics: New Relic"
linkTitle: "New Relic"
weight: 15
description: >
  Once data has been sent to New Relic, its web based user interface makes it very intuitive to both create charts and combine these into dashboards.
---

## New Relic

[New Relic](https://newrelic.com) offers a complete SaaS observability stack, ranging from high-volume ingestion of events/metrics/logs/traces to advanced dashboards that can be created ad-hoc using a web UI or from files and templates, for more of an infrastructure-as-code approach.

Storing metrics in New Relic is not mandatory, but some kind of metrics storage - either in [New Relic](https://newrelic.com), [InfluxDB](/docs/reference/available_metrics/influxdb/) or [Prometheus](/docs/reference/available_metrics/prometheus/) - is needed to take full benefit of Butler SOS' features.

In order to view data in New Relic you first have to send data to them.

Butler SOS does this for you.

Furthermore, you can to a large degree control which Qlik Sense metrics, logs and events are sent to New Relic.

## Data volumes and pricing

At the time of this writing New Relic offers a generous [free plan](https://newrelic.com/pricing).  
It will be a great starting point for everyone, if there's a need for more dashboard users etc the account can be upgraded as needed.

In most cases Butler SOS will not generate a lot of data and you can stay within New Relic's free tier.  
The amount of data generated by Sense health metrics and Butler SOS uptime metrics is very small indeed, but if your Qlik Sense environment for some reason generate a lot of _log events_ that can cause the data volumes to increase rapidly.

For example, if a user connects to Sense and gets a https certificate warning in the browser, this will also cause a number of warnings and errors in the proxy logs. Multiple this by X users and there can suddenly be thousands of errors and warnings per hour in the Sense logs.  
If these are also sent to New Relic the data volumes increase quickly.

### Overview of New Relic

New Relic is similar to InfluxDB in that Butler SOS pushes data to both systems.

The basic concepts are

- _Metrics_ represent a measurement of some kind. Number or sessions in the Sense proxy, amount of free RAM on a Sense server etc.
- _Events_ are something that happened. Warnings and errors in the Sense log files can be forwarded to New Relic as events.  
  Various user activities (user session start/stop etc) in Sense can also be sent to New Relic as events.
- _Attributes_ are conceptually tags that are attached to metrics or events. These act as dimensions for the data.
  Metrics in visualizations can be grouped by attributes, much in the same way Qlik Sense measurements are grouped by dimensions in Sense charts and tables.
  - _Static attributes_ are defined in Butler SOS' config file.
  - _Dynamic attributes_ are determined at runtime.

In addition to the above these data formats exist but are not currently used by Butler SOS. This may change in the future.

- _Logs_ are essentially regular lines in a log file, consisting of several fields.
- _Distributed tracing_ collects data as requests travel from one service to another, recording each segment of the journey as a span.
  These spans contain important details about each segment of the request and are eventually combined into one trace.
  The completed trace gives you a picture of the entire request.
