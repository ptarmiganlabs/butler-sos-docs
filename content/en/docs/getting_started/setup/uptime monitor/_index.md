---
title: "Configuring Butler SOS uptime monitor"
linkTitle: "Uptime monitor"
weight: 50
description: >
  Butler SOS can optionally log how long it's been running and how much memory it uses.  

  Optionally the memory usage can also be stored to an InfluxDB database or sent to New Relic, for later viewing/alerting in for example a Grafana dashboard or within New Relic.
---

{{% alert title="Optional" color="primary" %}}
These settings are optional.

If you don't need this feature just disable it and leave the default values in the config as they are.

Do note though that Butler SOS expects the configuration properties below to exist in the config file, but will *ignore their values* if the related features are disabled.
{{% /alert %}}

## What's this?

In some cases - especially when investigating issues or bugs - it can be useful to get log messages telling how long Butler SOS has been running and how much memory it uses.

This feature is called "uptime monitoring" and can be enabled in the main config file. The feature is being added to more and more tools in the [Butler family](https://github.com/ptarmiganlabs) of tools for Qlik Sense.

The logging interval is configurable, as is the log level required for uptime messages to be shown in the console/file log.  

Select a reasonable retention policy and logging frequency!  
You will rarely if ever need to know how much memory Butler SOS used a month ago... A retention policy of 1-2 weeks is usually a good start, logging uptime metrics every few minutes.

### InfluxDB

The memory usage data can optionally be written to InfluxDB, from where it can later be viewed in Grafana.  
The metrics will be stored in the database specified in ``.  
The log level does not affect storing uptime metrics in InfluxDB or New Relic.

### New Relic

Uptime metrics can be sent to zero or more New Relic accounts.

New Relic attributes (a concept where each data point sent to New Relic is tagged with a set of attributes) can be added to the metrics.  
Attributes come in two forms: Static and dynamic.  

* Static attributes are hard-coded strings that don't change over time. Could be used to distinguish metrics from DEV, TEST and PROD Sense environments.
* Dynamic attributes may change each time Butler SOS is started, or even more often in the future if/when more dynamic attributes are added.  
  An example is the Butler SOS version, which will change when Butler SOS is upgraded to a new version.

## Settings in main config file

```yaml
Butler-SOS:
  ...
  ...
  # Uptime monitor
  uptimeMonitor:
    enable: true                    # Should uptime messages be written to the console and log files?
    frequency: every 15 minutes     # https://bunkat.github.io/later/parsers.html#text
    logLevel: verbose               # Starting at what log level should uptime messages be shown in console log and log files?
    storeInInfluxdb: 
      butlerSOSMemoryUsage: true    # Should data on Butler SOS' own memory use be stored in Infludb?
      instanceTag: PROD             # Tag that can be used to differentiate data from multiple Butler SOS instances
    storeNewRelic:
      enable: true
      destinationAccount:
        - Ptarmigan Labs NR account
      metric:
        dynamic:
          butlerMemoryUsage:
            enable: true            # Should Butler SOS' memory/RAM usage be sent to New Relic?
          butlerUptime:
            enable: true            # Should Butler SOS' uptime (how long since it was started) be sent to New Relic?
      attribute: 
        static:                     # Static attributes/dimensions to attach to the data sent to New Relic.
          - name: metricType
            value: butler-sos-uptime
          - name: qs_service
            value: butler-sos
          - name: qs_environment
            value: prod
        dynamic:
          butlerVersion: 
            enable: true            # Should the Butler SOS version be included in the data sent to New Relic?
  ...
  ...
```
