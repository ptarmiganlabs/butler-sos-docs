---
outline: deep
---

# Configuring Butler SOS Logging

Butler SOS can log its activities to console and disk files.

Log files can be useful for retrospective troubleshooting of Butler SOS.

## What's This?

Butler SOS continuously logs what it's doing. Logging is always done to console and optionally also to disk files.

The top level section `Butler-SOS` in the config file has a set of settings that control logging.

Log level (verbosity) can be set, logging to disk can be enabled/disabled and the directory where log files are stored can be set.

Log level can also be set on the command line when starting Butler SOS, using the `--loglevel` option.

Log files are kept for 30 days, after which they are automatically deleted.

## Settings in Main Config File

```yaml
Butler-SOS:
  ...
  ...
  # Logging configuration
  logLevel: info          # Log level. Possible log levels are silly, debug, verbose, info, warn, error
  fileLogging: true       # true/false to enable/disable logging to disk file
  logDirectory: log       # Subdirectory where log files are stored
  ...
  ...
```
