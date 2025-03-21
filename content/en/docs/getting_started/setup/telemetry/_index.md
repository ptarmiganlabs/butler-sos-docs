---
title: "Configuring telemetry"
linkTitle: "Telemetry"
weight: 240
description:
---

{{% alert title="Optional" color="primary" %}}
These settings are optional.

If you don't do anything telemetry is turned on by default.

{{% /alert %}}

## What's this?

A description of Butler's telemetry feature is available [here](/docs/about/telemetry/).

## Settings in main config file

```yaml
---
Butler:
  # Logging configuration
  ...
  ...
  anonTelemetry: true     # Can Butler SOS send anonymous data about what computer it is running on?
                          # More info on what data is collected: https://butler-sos.ptarmiganlabs.com/docs/about/telemetry/
                          # Please consider leaving this at true - it really helps future development of Butler SOS!
  ...
  ...
```

Setting `anonTelemetry` to true enables telemetry, setting it to false disables telemetry.
