---
outline: deep
---

# Setting up Prometheus

Butler SOS can store metrics in Prometheus.

::: info Optional
These settings are optional.

If you don't need the Prometheus feature, just disable it and leave the default values in the config as they are.

Do note though that Butler SOS expects the configuration properties below to exist in the config file, but will _ignore their values_ if the related features are disabled.
:::

## What's This?

[Prometheus](https://prometheus.io) is the de-facto standard, open source tool for achieving observability of both small, large and huge IT systems.

At its heart Prometheus contains a time-series database optimized for storing various kinds of measurements. It has strong support for doing dimensional queries, great integrations with incident management tools and more.

Looking at the visualization side of things, Prometheus is Grafana's preferred source for time-series data. Put differently, Prometheus has some query features that InfluxDB lacks, thus making some Grafana diagrams easier to create using Prometheus vs InfluxDB. The difference is minor though.

## Settings in Main Config File

```yaml
Butler-SOS:
  ...
  ...
  # Prometheus config
  # If enabled, select Butler SOS metrics will be exposed on a Prometheus compatible URL from where they can be scraped.
  prometheus:
    enable: false                                   # Default false
    host: <IP or FQDN where Butler SOS is running>  # On what IP/FQDN should the Prometheus metrics be exposed? Default 0.0.0.0, i.e. all available IPs
    port: 9842
  ...
  ...
```
