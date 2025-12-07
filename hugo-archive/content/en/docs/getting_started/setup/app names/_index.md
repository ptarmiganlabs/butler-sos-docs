---
title: "Configuring extraction of app names from Qlik Sense"
linkTitle: "App names"
weight: 180
description:
---

{{% alert title="Optional" color="primary" %}}
These settings are optional.

If you don't do anything app name extraction is turned on by default.
{{% /alert %}}

## What's this?

Qlik Sense's APIs return all its app metrics relative to an app ID, not the app name.  
This is fine as the ID is guaranteed to be unique, but the downside is that the ID doesn't tell us humans much.

Butler SOS therefore provides an app ID-to-app name mapping with a configurable update interval.  
The `Butler-SOS.appNames` section of the config file controls if this mapping should be done at all, how often and which Sense server should be used to get it.

If an app ID for some reason can't be mapped to an app name, Butler SOS will use the app ID as the app name.

A more comprehensive description of Butler SOS' strategy for getting correct names of Sense apps is available in the [Concepts section](/docs/concepts/apps/#app-names-are-tricky).

## Settings in main config file

```yaml
Butler-SOS:
  ...
  ...
  # Extract app names
  appNames: 
    enableAppNameExtract: true    # Extract app names in addition to app IDs (tue/false)?
    extractInterval: 60000        # How often (milliseconds) should app names be extracted?
    hostIP: <IP or FQDN>          # What Sense server should be queried for app names?
  ...
  ...
```

Setting `anonTelemetry` to true enables telemetry, setting it to false disables telemetry.
