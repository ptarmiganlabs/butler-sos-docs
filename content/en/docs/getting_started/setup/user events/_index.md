---
title: "Configuring user events"
linkTitle: "User events"
weight: 50
description:
---

{{% alert title="Optional" color="primary" %}}
These settings are optional.

If you don't do anything telemetry is turned on by default.
{{% /alert %}}

## What's this?

User events are among the most detailed bits of information retrieved from Sense by Butler SOS.  
They capture session start/stop events (=users logging in/out) and connection open/close events (apps opened/closed).

These events rely on two things to be correctly configured:

1. Settings in main config file.
2. Log appender XML files being deployed on the Sense servers where user events should be captured.

Both are described below.

## Tech deep-dive

The user events are created by hooking into Sense's logging framework, which is called Log4Net.

By placing a carefully crafted XML file in the Qlik Sense proxy service's configuration directory, we can instruct Log4net to forward Sense log events that we are interested in to Butler SOS.  
In this case we are interested in session start/stop and connection open/close events.

The XML file is called a "log appender file". It can instructions that tell Log4Net to do various things when the specified filter matches the actual log data. Examples include sending emails, writing log entries to disk (i.e. regular file logging!), sending the log row as a UDP message and more.  
Here we're interested in the UDP message feature.

So, by means of a log appender file we tell Log4Net to send certain log rows to Butler SOS as UDP messages.  
We then also have to specify what host/IP address and port Butler SOS listens to.
Finally we have to make sure firewalls are open and allow UDP traffic to Butler SOS.

If everything is set up correctly UDP messages will arrive at Butler SOS within seconds after the actual event taking place.

## Settings in main config file

```yaml
---
Butler-SOS:
  ...
  ...
  # Track individual users opening/closing apps and starting/stopping sessions. 
  # Requires log appender XML file(s) to be added to Sense server(s.
  userEvents:                       
    enable: false
    excludeUser:                    # Optional blacklist of users that should be disregarded when it comes to user events
      - directory: LAB
        userId: testuser1
      - directory: LAB
        userId: testuser2
    udpServerConfig:
      serverHost: <IP or FQDN>      # Host/IP where user event server will listen for events from Sense
      portUserActivityEvents: 9997  # Port on which user event server will listen for events from Sense
    tags:                           # Tags are added to the data before it's stored in InfluxDB
      - tag: env
        value: DEV
      - tag: foo
        value: bar
    sendToMQTT:                     # Set to true if user events should be forwarded as MQTT messages
      enable: false                 # MQTT topic to use for user event messages
      topic: userEvent
    sendToInfluxdb:
      enable: true                  # Set to true if user events should be stored in InfluxDB
  ...
  ...
```

## Log appender XML files

A template log appender file `LocalLogConfig.xml` is available in the `/docs/log4net_user-audit-event` folder in the GitHub repo. It looks like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <appender name="EventSession" type="log4net.Appender.UdpAppender">
        <filter type="log4net.Filter.StringMatchFilter">
            <param name="stringToMatch" value="Start session for user" />
        </filter>
        <filter type="log4net.Filter.StringMatchFilter">
            <param name="stringToMatch" value="Stop session for user" />
        </filter>
        <filter type="log4net.Filter.DenyAllFilter" />
        <param name="remoteAddress" value="<FQDN or IP of server where Butler is running>" />
        <param name="remotePort" value="9997" />
        <param name="encoding" value="utf-8" />
        <layout type="log4net.Layout.PatternLayout">
            <converter>
                <param name="name" value="hostname" />
                <param name="type" value="Qlik.Sense.Logging.log4net.Layout.Pattern.HostNamePatternConverter" />
            </converter>
            <param name="conversionpattern" value="/proxy-session/;%hostname;%property{Command};%property{UserDirectory};%property{UserId};%property{Origin};%property{Context};%message" />
        </layout>
    </appender>

    <appender name="EventConnection" type="log4net.Appender.UdpAppender">
        <filter type="log4net.Filter.StringMatchFilter">
            <param name="stringToMatch" value="connection Opened for session" />
        </filter>
        <filter type="log4net.Filter.StringMatchFilter">
            <param name="stringToMatch" value="connection Closed for session" />
        </filter>
        <filter type="log4net.Filter.DenyAllFilter" />
        <param name="remoteAddress" value="<FQDN or IP of server where Butler is running>" />
        <param name="remotePort" value="9997" />
        <param name="encoding" value="utf-8" />
        <layout type="log4net.Layout.PatternLayout">
            <converter>
                <param name="name" value="hostname" />
                <param name="type" value="Qlik.Sense.Logging.log4net.Layout.Pattern.HostNamePatternConverter" />
            </converter>
            <param name="conversionpattern" value="/proxy-connection/;%hostname;%property{Command};%property{UserDirectory};%property{UserId};%property{Origin};%property{Context};%message" />
        </layout>
    </appender>

    <logger name="AuditActivity.Proxy">
        <appender-ref ref="EventSession" />
        <appender-ref ref="EventConnection" />
    </logger>
</configuration>
```

Note the places where you need to fill in the IP/host where Butler SOS is running, as well as the port number to use (set to 9997 but can be changed if needed).

Make necessary changes so the file matches your environment, then deploy to `C:\ProgramData\Qlik\Sense\Proxy\LocalLogConfig.xml`.
Note that the file **must** be called `LocalLogConfig.xml`!

Sense will usually detect and use the file without any restarts needed, but it can take a while. You can always try restarting the Sense proxy service to make sure the XML file is applied and used.

Once in place you should see events in the Butler SOS console log if you set logging level to `verbose`, `debug` or `silly`.
