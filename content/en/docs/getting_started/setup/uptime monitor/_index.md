---
title: "Configuring Butler SOS uptime monitor"
linkTitle: "Uptime monitor"
weight: 210
description: >
  Butler SOS can optionally log how long it's been running and how much memory it uses. 

  Optionally the memory usage can also be stored to an InfluxDB database, for later viewing/alerting in for example a Grafana dashboard.
---

{{% alert title="Optional" color="primary" %}}
These settings are optional.

If you don't need this feature just disable it and leave the default values in the config as they are.

Do note though that Butler SOS expects the configuration properties below to exist in the config file, but will *ignore their values* if the related features are disabled.
{{% /alert %}}

## What's this?

In some cases - especially when investigating issues or bugs - it can be useful to get log messages telling how long Butler SOS has been running and how much memory it uses.

This feature is called "uptime monitoring" and can be enabled in the main config file. The feature is being added to more and more tools in the [Butler family](https://github.com/ptarmiganlabs) of tools for Qlik Sense.

The logging interval is configurable, as is the log level required for uptime messages to be shown.

The memory usage data can optionally be written to InfluxDB, from where it can later be viewed in Grafana.  
The metrics will be stored in the database specified in ``.

Select a reasonable retention policy and logging frequency!  
You will rarely if ever need to know how much memory Butler used a month ago... A retention policy of 1-2 weeks is usually a good start, with logging every few minutes.

## Settings in main config file

```yaml
Butler-SOS:
  ...
  ...
  # Uptime monitor
  uptimeMonitor:
    enable: true                   # Should uptime messages be written to the console and log files?
    frequency: every 15 minutes     # https://bunkat.github.io/later/parsers.html
    logLevel: verbose               # Starting at what log level should uptime messages be shown?
    storeInInfluxdb: 
      butlerSOSMemoryUsage: true    # Should data on Butler SOS' own memory use be stored in Infludb?
      instanceTag: DEV              # Tag that can be used to differentiate data from multiple Butler SOS instances
  ...
  ...
```
