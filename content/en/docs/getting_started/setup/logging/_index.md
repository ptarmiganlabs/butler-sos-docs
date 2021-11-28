---
title: "Configuring Butler SOS logging"
linkTitle: "Log files"
weight: 20
description: >
  Heartbeats provide a way to monitor that Butler SOS is running and working as intended.  

  Butler SOS can send periodic heartbeat messages to a monitoring tool, which can then alert if Butler SOS hasn't checked in as expected.
---

{{% alert title="Mandatory" color="warning" %}}
These settings are mandatory.
They must exist in the config file and be correctly set for Butler SOS to work.
{{% /alert %}}

## What's this?

Butler SOS continuously logs what its doing.  

The top level section `Butler-SOS` in the config file has a set of settings that control logging and telemetry.

Log level (verbosity) can be set, logging to disk can be enabled/disabled etc.

For more information about telemetry, please see [this page](/docs/about/telemetry/).

## Settings in main config file

```yaml
Butler-SOS:
  ...
  ...
  # Logging configuration
  logLevel: info          # Log level. Possible log levels are silly, debug, verbose, info, warn, error
  fileLogging: true       # true/false to enable/disable logging to disk file
  logDirectory: log       # Subdirectory where log files are stored
  anonTelemetry: true     # Can Butler SOS send anonymous data about what computer it is running on? 
                          # More info on whata data is collected: https://butler-sos.ptarmiganlabs.com/docs/about/telemetry/
                          # Please consider leaving this at true - it really helps future development of Butler SOS!
  ...
  ...
```
