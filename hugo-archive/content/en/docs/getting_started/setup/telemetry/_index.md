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

{{% alert title="Important: systemInfo dependency" color="warning" %}}
**Telemetry requires system information gathering to be enabled.**

Butler SOS telemetry depends on the `Butler-SOS.systemInfo.enable` setting being set to `true`. If telemetry is enabled but systemInfo is disabled, Butler SOS will refuse to start.

This dependency exists because telemetry needs to collect system information about the host Butler SOS is running on. In security-sensitive environments where you need to disable system information gathering, you must also disable telemetry.
{{% /alert %}}

## Settings in main config file

```yaml
---
Butler-SOS:
  # System information gathering
  systemInfo:
    enable: true                # Enable/disable collection of system information
                               # Disabling this will prevent telemetry from working
  
  # Logging configuration
  ...
  ...
  anonTelemetry: true          # Can Butler SOS send anonymous data about what computer it is running on?
                               # More info on what data is collected: https://butler-sos.ptarmiganlabs.com/docs/about/telemetry/
                               # Please consider leaving this at true - it really helps future development of Butler SOS!
                               # Requires systemInfo.enable: true to work
  ...
  ...
```

Setting `anonTelemetry` to true enables telemetry, setting it to false disables telemetry.

**Important**: Telemetry requires `Butler-SOS.systemInfo.enable` to be set to `true`. If you disable system information gathering for security reasons, you must also disable telemetry.
