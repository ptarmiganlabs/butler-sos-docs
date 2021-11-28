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

They capture warnings, errors and fatals from the various QSEoW subsystems.  
These events used to be sent to PostgreSQL loging database, most (but not all) are also sent to QSEoW's log files.  

Using Butler SOS' log events is arguably even *better* than getting the same information from log db:  
Log db had to be polled to detect new log events and this polling could realistically only be done every few minutes. It also put additional load on an often already struggling part of many QSEoW clusters.

With Butler SOS' log events concept the notifications are almost instantaneous: Errors and warnings show up in the Grafana dashboards within seconds after taking place in QSEoW.  

Log events rely on two things to work:

1. Settings in the Butler SOS main config file.
2. Log appender XML files being deployed on the Sense servers where log events should be captured.

Both are described below.

{{< notice info >}}
As of Butler SOS version 7.0, log events are captured in these QSEoW modules:

- Proxy service
- Repository service
- Scheduler service

Support for additional modules is reasonably easy to add, please [create a ticket](https://github.com/ptarmiganlabs/butler-sos/issues/new?assignees=&labels=&template=feature_request.md&title=) if you believe some module should be added to the list above.
{{< /notice >}}

## Tech deep-dive

The underlying mechanism is the same as described on the [user events page](/docs/getting_started/setup/user-events/#tech-deep-dive).

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
      proxy:
        enable: false                   # Should log events from the proxy service be handled?
      repository:
        enable: false                   # Should log events from the repository service be handled?
      scheduler:
        enable: false                   # Should log events from the scheduler service be handled?
    sendToMQTT: 
      enable: false                     # Should log events be sent as MQTT messages?
      baseTopic: qliksense/logevent    # What topic should log events be forwarded to? 
      postTo:
        baseTopic: true
        subsystemTopics: true          # Should log events be sent to subtopics corresponding to the QSEoW subsystems where the events originated?
    sendToInfluxdb:
      enable: false                     # Should log events be stored in InfluxDB?
  ...
  ...
```

## Log appender XML files

Template/sample log appender files are available in the `/docs/log_appenders` folder in the GitHub repo.  


`LocalLogConfig.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <!-- Log appender finding user session events -->
    <appender name="EventSession" type="log4net.Appender.UdpAppender">
        <filter type="log4net.Filter.StringMatchFilter">
            <param name="stringToMatch" value="Start session for user" />
        </filter>
        <filter type="log4net.Filter.StringMatchFilter">
            <param name="stringToMatch" value="Stop session for user" />
        </filter>
        <filter type="log4net.Filter.DenyAllFilter" />
        <param name="remoteAddress" value="192.168.1.168" />
        <param name="remotePort" value="9997" />
        <param name="encoding" value="utf-8" />
        <layout type="log4net.Layout.PatternLayout">
            <converter>
                <param name="name" value="hostname" />
                <param name="type" value="Qlik.Sense.Logging.log4net.Layout.Pattern.HostNamePatternConverter" />
             </converter>
            <param name="conversionpattern" value="/qseow-proxy-session/;%hostname;%property{Command};%property{UserDirectory};%property{UserId};%property{Origin};%property{Context};%message" />
        </layout>
    </appender>

    <!-- Log appender finding user connection events -->
    <appender name="EventConnection" type="log4net.Appender.UdpAppender">
        <filter type="log4net.Filter.StringMatchFilter">
            <param name="stringToMatch" value="connection Opened for session" />
        </filter>
        <filter type="log4net.Filter.StringMatchFilter">
            <param name="stringToMatch" value="connection Closed for session" />
        </filter>
        <filter type="log4net.Filter.DenyAllFilter" />
        <param name="remoteAddress" value="192.168.1.168" />
        <param name="remotePort" value="9997" />
        <param name="encoding" value="utf-8" />
        <layout type="log4net.Layout.PatternLayout">
            <converter>
                <param name="name" value="hostname" />
                <param name="type" value="Qlik.Sense.Logging.log4net.Layout.Pattern.HostNamePatternConverter" />
             </converter>
            <param name="conversionpattern" value="/qseow-proxy-connection/;%hostname;%property{Command};%property{UserDirectory};%property{UserId};%property{Origin};%property{Context};%message" />
        </layout>
    </appender>

    <!-- Send UDP message to Butler SOS on user activity -->
    <logger name="AuditActivity.Proxy">
        <appender-ref ref="EventSession" />
        <appender-ref ref="EventConnection" />
    </logger>
</configuration>
```

{{< notice tip >}}
If you have several servers in your Sense cluster you probably need several log appender files too.

More specifically, you should put a log appender file on each server where the Qlik Sense proxy service is running, i.e. on all servers via which end users access the Sense cluster.  

{{< /notice >}}

Note the places where you need to fill in the IP/host where Butler SOS is running, as well as the port number to use (set to 9997 but can be changed if needed). The IP/host and port used in the log appender file should match that where Butler SOS' log event handler (=UDP server) is running.  
The [overview page](/docs/getting_started/overview/) has more info.

Make necessary changes so the file matches your environment, then deploy to `C:\ProgramData\Qlik\Sense\Proxy\LocalLogConfig.xml` on each Sense server from which log events should be forwarded to Butler SOS. Note that the file **must** be called `LocalLogConfig.xml`!

Sense will usually detect and use the file without any restarts needed, but it can take a while. You can always restart the Sense proxy service to make sure the XML file is applied and used.

Once in place you should see events in the Butler SOS console log if you set logging level to `verbose`, `debug` or `silly`.
