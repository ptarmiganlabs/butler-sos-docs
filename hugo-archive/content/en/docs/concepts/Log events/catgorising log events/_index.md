---
title: "Getting rid of Sense log noise"
linkTitle: "Categorizing log events"
weight: 50
description: >
  Let's say Butler SOS is configured to receive log events from Qlik Sense Enterprise, specifically warnings and errors.


  In the best of worlds there will be few such events, but in reality there are usually more than expected. It's not uncommon for a Sense cluster to generate hundreds or even thousands of error and warning events per hour.


  By categorizing these events, Butler SOS can help you focus on the most important ones, and ignore the rest.
---

## What kind of log events are there?

Log events originate from the Qlik Sense logging framework, which is called Log4Net.

The framework is responsible for logging things to Qlik Sense's own log files, but [can also be extended](https://help.qlik.com/en-US/sense-admin/May2024/Subsystems/DeployAdministerQSE/Content/Sense_DeployAdminister/QSEoW/Deploy_QSEoW/Server-Logging-Using-Appenders.htm) in various ways - for example by sending log events as UDP messages to Butler SOS.  
This is done by deploying XML files in well defined folders on the Sense servers, these files are called "log appender files".

Log4Net assigns a log level to all log events, these are on of the following: `DEBUG`, `INFO`, `WARN`, `ERROR` and `FATAL`.

The log appender files that ship with Butler SOS are configured to send `WARN` and `ERROR` events to Butler SOS, from the repository, proxy, engine, and scheduler services in Qlik Sense.

So, what Butler SOS receives is a stream of log events, with a log level of either `WARN` or `ERROR`, from the repository, proxy, engine, and scheduler services in Qlik Sense.

That's all fine, but it's not uncommon for a Sense cluster to generate way more warnings and errors than expected by the Sense admin person.  
The challenge then becomes to focus on the most important events, and ignore the rest.

## How to categorize log events

Let's say there are 1000 log events per hour.

When looking at the log events, it turns out that 95% of them are either about

- people getting https certificate warnings when accessing the Qlik Sense Hub...
- ...people getting access denied errors when trying to open an app...
- ...or that Sense has detected something unusual (like a circular reference) in an Active Directory user directory.

Those events are not good, but they are not critical either.  
They are things that can be fixed in a controlled way, and they won't bring the Sense cluster to its knees.

But there may also be a few log events that are related to the Sense central node not being able to connect to one of the rim nodes.
Maybe the events occur at irregular intervals and therefore more difficult to detect.

These events **_are_** critical, and should be investigated immediately.

If Butler SOS is configured to categorize the certificate warnings as "user-certificate, the Active Directory warnings as "active-directory" and the access-denied warnings as "access-denied", _that information is then added as tags to the event data that is stored in InfluxDB_.

This means that when creating Grafana dashboards, it's possible to create a table that show the number of "user-certificate" events and the number of "active-directory" events - and the number of "other" events.

Another Grafana panel can show detailed event info for the "other" events, making it easy to investigate what they are about.

> By categorizing log events it is possible to get rid of the log noise that hides the important events.

## Sample Grafana dashboard

A few charts and tables give a good overview of the log events.

{{< imgproc butler-sos-grafana-log-event-categorise-1.png Resize "1200x" >}}
Butler SOS log events dashboard in Grafana. Uncategorized events by the yellow arrows, and in table/charts to the right.
{{< /imgproc >}}

### Butler SOS Configuration

The following settings in the Butler SOS config file were used to categorize the log events that were used in the Grafana dashboard above.

```yaml
Butler-SOS:
  ...
  ...
  # Log events are used to capture Sense warnings, errors and fatals in real time
  logEvents:
    udpServerConfig:
      serverHost: 0.0.0.0           # Host/IP where log event server will listen for events from Sense
      portLogEvents: 9996           # Port on which log event server will listen for events from Sense
    tags:
      - name: env
        value: DEV
      - name: foo
        value: bar
    source:
      engine:
        enable: true                   # Should log events from the engine service be handled?
      proxy:
        enable: true                   # Should log events from the proxy service be handled?
      repository:
        enable: true                   # Should log events from the repository service be handled?
      scheduler:
        enable: true                   # Should log events from the scheduler service be handled?
      qixPerf:
        enable: true                   # Should log events relating to QIX performance be handled?
    categorise:                        # Take actions on log events based on their content
      enable: true
      rules:                           # Rules are used to match log events to filters
        - description: Find access denied errors
          logLevel:                    # Log events of this Log level will be matched. WARN, ERROR, FATAL. Case insensitive.
            - WARN
            - ERROR
          action: categorise           # Action to take on matched log events. Possible values are categorise, drop
          category:                    # Category to assign to matched log events. Name/value pairs.
                                       # Will be added to InfluxDB datapoints as tags.
            - name: qs_log_category
              value: access-denied
          filter:                      # Filter used to match log events. Case sensitive.
            - type: sw                 # Type of filter. sw = starts with, ew = ends with, so = substring of
              value: "Access was denied for User:"
            - type: so
              value: was denied for User
        - description: Find AD issues
          logLevel:                    # Log events of this Log level will be matched. WARN, ERROR, FATAL. Case insensitive.
            - ERROR
            - WARN
          action: categorise           # Action to take on matched log events. Possible values are categorise, drop
          category:                    # Category to assign to matched log events. Name/value pairs.
                                       # Will be added to InfluxDB datapoints as tags.
            - name: qs_log_category
              value: user-directory
          filter:                      # Filter used to match log events. Case sensitive.
            - type: sw                 # Type of filter. sw = starts with, ew = ends with, so = substring of
              value: Duplicate entity with userId
        - description: Qlik Sense service down
          logLevel:                    # Log events of this Log level will be matched. WARN, ERROR, FATAL. Case insensitive.
            - WARN
          action: categorise           # Action to take on matched log events. Possible values are categorise, drop
          category:                    # Category to assign to matched log events. Name/value pairs.
                                       # Will be added to InfluxDB datapoints as tags.
            - name: qs_log_category
              value: qs-service
          filter:                      # Filter used to match log events. Case sensitive.
            - type: sw                 # Type of filter. sw = starts with, ew = ends with, so = substring of
              value: Failed to request service alive response from
            - type: so                 # Type of filter. sw = starts with, ew = ends with, so = substring of
              value: Unable to connect to the remote server
        - description: Reload task failed
          logLevel:                    # Log events of this Log level will be matched. WARN, ERROR, FATAL. Case insensitive.
            - WARN
            - ERROR
          action: categorise           # Action to take on matched log events. Possible values are categorise, drop
          category:                    # Category to assign to matched log events. Name/value pairs.
                                        # Will be added to InfluxDB datapoints as tags.
            - name: qs_log_category
              value: reload-failed
          filter:                      # Filter used to match log events. Case sensitive.
            - type: sw                 # Type of filter. sw = starts with, ew = ends with, so = substring of
              value: Task finished with state FinishedFail
            - type: sw                 # Type of filter. sw = starts with, ew = ends with, so = substring of
              value: Task finished with state Error
            - type: ew                 # Type of filter. sw = starts with, ew = ends with, so = substring of
              value: Reload failed in Engine. Check engine or script logs.
            - type: sw                 # Type of filter. sw = starts with, ew = ends with, so = substring of
              value: Reload sequence was not successful (Result=False, Finished=True, Aborted=False) for engine connection with handle
      ruleDefault:                     # Default rule to use if no other rules match the log event
        enable: true
        category:
          - name: qs_log_category
            value: unknown
```
