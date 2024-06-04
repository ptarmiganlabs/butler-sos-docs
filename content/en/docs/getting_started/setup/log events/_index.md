---
title: "Configuring log events"
linkTitle: "Log events"
weight: 70
description:
---

{{% alert title="Optional" color="primary" %}}
These settings are optional.

If you don't do anything log events are turned off by default.
{{% /alert %}}

## What's this?

Butler SOS log events are designed to be a replacement for the most important/useful aspects of Qlik Sense' log database, which was removed from Qlik Sense Enterprise on Windows in mid 2021.  

The log events capture warnings, errors and fatals from the various QSEoW subsystems.  
These events used to be sent to the PostgreSQL logging database, most (but not all) are also sent to QSEoW's log files.  

Using Butler SOS' log events is arguably even *better* than getting the same information from log db:  
Log db had to be polled to detect new log events and this polling could realistically only be done every few minutes. It also put additional load on an often already struggling part of many QSEoW clusters.

With Butler SOS' log events concept the notifications are almost instantaneous. Errors and warnings show up in the Grafana or New Relic dashboards within seconds after taking place in QSEoW.  

Log events rely on two things to work:

1. Settings in the Butler SOS config file.
2. Log appender XML files being deployed on the Sense servers where log events should be captured.

Both are described below.

{{< notice info >}}
As of Butler SOS version 9.2, log events are captured in these QSEoW services:

- Engine
- Proxy
- Repository
- Scheduler

Support for additional modules is reasonably easy to add, please [create a ticket](https://github.com/ptarmiganlabs/butler-sos/issues/new?assignees=&labels=&template=feature_request.md&title=) if you believe some service should be added to the list above.
{{< /notice >}}

## Tech deep-dive

The underlying mechanism is the same as described on the [user events page](/docs/getting_started/setup/user-events/#tech-deep-dive).

## Tagging of data

### InfluxDB

The tags added to InfluxDB are described in the reference documentation for [log events](/docs/reference/available_metrics/influxdb/#log-events).

### New Relic

The following attributes (which is New Relic lingo for tags) are added:

1. A core set of attributes are added to all user events. Note that some attributes will be empty for some/many log events.
   1. `qs_ts_iso`: Event timestamp in ISO format.
   2. `qs_ts_local`: Event timestamp in local (server) time zone.
   3. `qs_log_source`: Which Sense service the event originated in, for example "qseow-proxy", "qseow-repository".
   4. `qs_log_level`: Log level of the event. "WARN", "ERROR", or "FATAL".
   5. `qs_host`: Host name of the Sense server the event originated at.
   6. `qs_subsystem`: Which part of each Sense service the event originated in, for example "System.Proxy.Proxy.Core.RequestListener", "System.Engine.Engine".
   7. `qs_windows_user`: Name of the Windows user that's used to run the Window service where the event originated.
   8. `qs_message`: Event message.
   9. `qs_exception_message`: Additional information about the event.
   10. `qs_user_full`: Full directory/user ID of the user the event is about. Will be scrambled if scrambling enabled in config file.
   11. `qs_user_directory`: User directory of the user the event is about. Will be scrambled if scrambling enabled in config file.
   12. `qs_user_id`: User ID of the user the event is about. Will be scrambled if scrambling enabled in config file.
   13. `qs_command`: What command (if any) caused the event. Example: "Doc::DoSave", "Doc::CreateObject".
   14. `qs_result_code`: Result code as reported by Sense. Usually empty.
   15. `qs_origin`: What kind of activity caused the event, for example "AppAccess".
   16. `qs_context`: Additional information about the event.
   17. `qs_task_name`: Task name (if any) causing the event.
   18. `qs_app_name`: App name (if any) causing the event.
   19. `qs_task_id`: Task ID (if any) causing the event.
   20. `qs_app_id`: App ID (if any) causing the event.
   21. `qs_execution_id`: Execution ID as reported by Sense.
   22. `qs_proxy_session_id`: Proxy session ID as reported by Sense.
   23. `qs_engine_ts`: Engine timestamp (if any) associated with the event.
   24. `qs_process_id`: Process ID of engine service.
   25. `qs_engine_exe_version`: Version of engine service's EXE file.
   26. `qs_server_started`: Timestamp when Sense engine service was started.
   27. `qs_entry_type`: Entry type as reported by Sense. Usually empty.
   28. `qs_session_id`: Session ID as reported by Sense.
2. Custom attributes defined in the Butler SOS config file's `Butler-SOS.logEvents.tags` section.
3. Custom attributes defined in the Butler SOS config file's `Butler-SOS.newRelic.event.attribute.static` section.
4. Dynamic attributes
   1. `butlerSosVersion`: Butler SOS version. Enabled by setting `Butler-SOS.newRelic.event.attribute.dynamic.butlerSosVersion.enable` to true in config file.

Note: Attributes defined further down in the list above will overwrite already defined attributes if their names match.  
To avoid problems you should make sure not to use already defined attributes.

## Settings in main config file

{{< notice tip >}}
The config snippet below comes from the [production_template.yaml](https://github.com/ptarmiganlabs/butler-sos/blob/master/src/config/production_template.yaml) file.

Being a template, it contains examples on how configuration *may* be done - not necessarily how it *should* be done.  
For example, the `env/DEV` and `foo/bar` tags are optional and can be changed to something else, or removed all together if not used.
{{< /notice >}}

```yaml
---
Butler-SOS:
  ...
  ...
  # Log events are used to capture Sense warnings, errors and fatals in real time
  logEvents:
    udpServerConfig:
      serverHost: <IP or FQDN>      # Host/IP where log event server will listen for events from Sense
      portLogEvents: 9996           # Port on which log event server will listen for events from Sense
    tags:
      - tag: env
        value: DEV
      - tag: foo
        value: bar
    source:
      engine:
        enable: false                  # Should log events from the engine service be handled?
      proxy:
        enable: false                  # Should log events from the proxy service be handled?
      repository:
        enable: false                  # Should log events from the repository service be handled?
      scheduler:
        enable: false                  # Should log events from the scheduler service be handled?
    sendToMQTT: 
      enable: false                    # Should log events be sent as MQTT messages?
      baseTopic: qliksense/logevent    # What topic should log events be forwarded to? 
      postTo:
        baseTopic: true
        subsystemTopics: true          # Should log events be sent to subtopics corresponding to the QSEoW subsystems where the events originated?
    sendToInfluxdb:
      enable: false                    # Should log events be stored in InfluxDB?
    sendToNewRelic:
      enable: false                    # Should log events be sent to New Relic?
      destinationAccount:
        - First NR account
        - Second NR account
      source:
        engine:
          enable: true                 # Should log events from the engine service be handled?
          logLevel: 
            error: true                # Should error level log events be handled by Butler SOS?
            warn: true                 # Should warning level log events be handled by Butler SOS?
        proxy:
          enable: true                 # Should log events from the proxy service be handled?
          logLevel: 
            error: true                # Should error level log events be handled by Butler SOS?
            warn: true                 # Should warning level log events be handled by Butler SOS?
        repository:
          enable: true                 # Should log events from the repository service be handled?
          logLevel: 
            error: true                # Should error level log events be handled by Butler SOS?
            warn: true                 # Should warning level log events be handled by Butler SOS?
        scheduler:
          enable: true                 # Should log events from the scheduler service be handled?
          logLevel: 
            error: true                # Should error level log events be handled by Butler SOS?
            warn: true                 # Should warning level log events be handled by Butler SOS?
  ...
  ...
```

## Log appender XML files

Sample log appender files are available in the ZIP file available from the [download page](https://github.com/ptarmiganlabs/butler-sos/releases), in subfolders engine/proxy/repository/scheduler of `config/log_appender_xml/` folder.  

Note that the log appender files contain slightly different information for each Sense service (engine/proxy/repository/scheduler)!  
Also keep in mind that the log appender files **must** be called `LocalLogConfig.xml` and placed in these directories on the all Sense servers:  

- `C:\ProgramData\Qlik\Sense\Engine`
- `C:\ProgramData\Qlik\Sense\Proxy`
- `C:\ProgramData\Qlik\Sense\Repository`
- `C:\ProgramData\Qlik\Sense\Scheduler`

{{< notice tip >}}
If you have more than one Sense server you strictly speaking don't *have* to deploy log appenders to all servers.

If you are only interested in receiving log events from some servers and/or services (engine, proxy, repository, scheduler) - deploy the log appender files there.

{{< /notice >}}
