---
title: "Setting up Prometheus"
linkTitle: "Prometheus"
weight: 80
description: >
  Butler SOS can store metrics in Prometheus.
---

{{% alert title="Optional" color="primary" %}}
These settings are optional.

If you don't need the Prometheus feature, just disable it and leave the default values in the config as they are.

Do note though that Butler expects the configuration properties below to exist in the config file, but will *ignore their values* if the related features are disabled.
{{% /alert %}}

## What's this?

[Prometheus](https://prometheus.io) is the de-facto standard, open source tool-set for achieving observability of small and large scale IT systems.

At its heart Prometheus contains a time-series databas optimized for storing various kinds of measurements. It has strong support for doing dimensional queries, great integrations with incident managament tools and more.

Looking at the visualisation side of things, Prometheus is Grafana's preferred source for time-series data.

## Settings in main config file

```yaml
Butler-SOS:
  ...
  ...
  # Prometheus config
  # If enabled, select Butler SOS metrics will be exposed on a Prometheus compatible URL from where they can be scraped.
  prometheus:
    enable: false                                    # Default false
    host: <IP or FQDN where Butler SOS is running>  # On what IP/FQDN should the Prometheus metrics be exposed? Default 0.0.0.0, i.e. all available IPs
    port: 9842      
  ...
  ...
```
