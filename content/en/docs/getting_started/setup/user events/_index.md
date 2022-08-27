---
title: "Configuring user events"
linkTitle: "User events"
weight: 60
description:
---

{{% alert title="Optional" color="primary" %}}
These settings are optional.

If you don't do anything user activity events are turned off by default.
{{% /alert %}}

## What's this?

User events are among the most detailed bits of information retrieved from Sense by Butler SOS.  
They capture session start/stop events (=users logging in/out) and connection open/close events (apps opened/closed).

These events rely on two things to be correctly configured:

1. Settings in main config file.
2. Log appender XML files being deployed on the Sense servers where user activity events should be captured.

Both are described below.

## Tech deep-dive

The user events are created by hooking into Sense's logging framework, which is called Log4Net.

By placing a carefully crafted XML file in the Qlik Sense proxy service's configuration directory, we can instruct Log4Net to forward Sense log events that we are interested in to Butler SOS.  
In this case we are interested in session start/stop and connection open/close events.

The XML file is also known as a "log appender file". It contains instructions that tell Log4Net to do various things when the specified filter matches the actual log data. Examples include sending emails, writing log entries to disk (i.e. regular file logging!), sending the log row as a UDP message and more.  
Here we're interested in the UDP message feature.

So, by means of a log appender file we tell Log4Net to send certain log rows to Butler SOS as UDP messages.  
We also have to specify in the log appender file what host/IP address and port Butler SOS listens to, i.e. where the UDP messages should be sent.  
Finally we have to make sure firewalls are open and allow UDP traffic from the Sense server(s) to Butler SOS.

If everything is set up correctly UDP messages will arrive at Butler SOS within seconds after the actual event taking place.

## Tagging of data

### New Relic

The following attributes (which is New Relic lingo for tags) are added:

1. A core set of attributes are added to all user events
   1. `qs_host`: Host name of the Sense server the event originated at.
   2. `qs_event_action`: What kind of user event that took place. Examples are "Start session", "Stop session, "Open connection", "Close connection".
   3. `qs_userFull`: Full directory/user ID of the user the event is about. Will be scrambled if scrambling enabled in config file.
   4. `qs_userDirectory`: User directory of the user the event is about. Will be scrambled if scrambling enabled in config file.
   5. `qs_userId`: User ID of the user the event is about. Will be scrambled if scrambling enabled in config file.
   6. `qs_origin`: What kind of activity caused the event, for example "AppAccess". Can be empty for some user events.
2. Custom attributes defined in the Butler SOS config file's `Butler-SOS.userEvents.tags` section.

Note: Attributes defined further down in the list above will overwrite already defined attributes if their names match.  
To avoid problems you should make sure not to use already defined attributes.

## Settings in main config file

```yaml
---
Butler-SOS:
  ...
  ...
  # Track individual users opening/closing apps and starting/stopping sessions. 
  # Requires log appender XML file(s) to be added to Sense server(s).
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
    sendToMQTT: 
      enable: false                 # Set to true if user events should be forwarded as MQTT messages
      postTo:                       # Control when and to which MQTT topics messages are sent 
        everythingTopic:            # Topic to which all user events are sent
          enable: true
          topic: qliksense/userevent
        sessionStartTopic:          # Topic to which "session start" events are sent
          enable: true
          topic: qliksense/userevent/session/start
        sessionStopTopic:           # Topic to which "session stop" events are sent
          enable: true
          topic: qliksense/userevent/session/stop
        connectionOpenTopic:        # Topic to which "connection open" events are sent
          enable: true
          topic: qliksense/userevent/connection/open
        connectionCloseTopic:       # Topic to which "connection close" events are sent
          enable: true
          topic: qliksense/userevent/connection/close
    sendToInfluxdb:
      enable: true                  # Set to true if user events should be stored in InfluxDB
    sendToNewRelic:
      enable: false                  # Should log events be sent to New Relic?
      destinationAccount:
        - First NR account
        - Second NR account
      scramble: true                # Should user info (user directory and user ID) be scrambled before sent to NR?
  ...
  ...
```

## Log appender XML files

A template log appender file `LocalLogConfig.xml` is available in the `/docs/log4net_user-audit-event` folder in the GitHub repo. It looks like this:

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

Note the places where you need to fill in the IP/host where Butler SOS is running, as well as the port number to use (set to 9997 but can be changed if needed).

Make necessary changes so the file matches your environment, then deploy to `C:\ProgramData\Qlik\Sense\Proxy\LocalLogConfig.xml`.
Note that the file **must** be called `LocalLogConfig.xml`!

Sense will usually detect and use the file without any restarts needed, but it can take a while. You can always restart the Sense proxy service to make sure the XML file is applied and used.

Once in place you should see events in the Butler SOS console log if you set logging level to `verbose`, `debug` or `silly`.
