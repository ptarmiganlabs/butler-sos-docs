---
outline: deep
---

# Configuring User Events

::: info Optional
These settings are optional.

If you don't do anything user activity events are turned off by default.
:::

## What's This?

User events are among the most detailed bits of information retrieved from Sense by Butler SOS.  
They capture session start/stop events (=users logging in/out) and connection open/close events (apps opened/closed in browser tabs).

These events rely on two things to be correctly configured:

1. Settings in Butler SOS' config file.
2. Log appender XML file(s) being deployed on the Sense server(s) where user activity events should be captured.

Both are described below.

## Tech Deep-Dive

The user events are created by hooking into Sense's logging framework, which is called Log4Net.

By placing a carefully crafted XML file in the Qlik Sense proxy service's configuration directory, we can instruct Log4Net to forward certain Sense log events that we are interested in to Butler SOS.  
In this case we are interested in session start/stop and connection open/close events.

The XML file is also known as a "log appender file".  
It contains instructions that tell Log4Net to do various things when the specified filter matches the actual log data created by Sense. Examples include sending emails, writing log entries to disk (i.e. regular file logging!), sending the log row as a UDP message and more.  
Here we're interested in the UDP message feature.

> So, by means of a log appender file we tell Log4Net to send certain log rows to Butler SOS as UDP messages.

We also have to specify in the log appender file what host/IP address and port Butler SOS listens to, i.e. where the UDP messages should be sent.  
Finally we have to make sure firewalls are open and allow UDP traffic from the Sense server(s) to Butler SOS.

If everything is set up correctly UDP messages will arrive at Butler SOS within seconds after the actual event taking place in Qlik Sense, i.e. close to real-time.

## UDP Message Format

User events use a semicolon-separated message format with 8 fields. See the [UDP Payload Format Reference](/v15.0/reference/udp-payload-format#user-events-udp-payload) for the complete field specification and example payloads.

## Message Queue

Butler SOS uses a managed queue to handle incoming user event messages. The queue provides controlled concurrency, optional rate limiting, and message size validation. Queue health metrics can optionally be stored in InfluxDB. See the [UDP Message Queue](/v15.0/concepts/monitoring/udp-queue) documentation for configuration details.

## Restrict Allowed Senders

If the Butler SOS UDP listener is reachable by hosts other than the Qlik Sense nodes that should send user events, enable source validation so only approved senders can reach the `userEvents` UDP server.

```yaml
Butler-SOS:
  userEvents:
    udpServerConfig:
      serverHost: butler-sos.mycompany.net
      portUserActivityEvents: 9997
      enableSourceValidation: true
      allowedSources:
        - 192.168.100.109
        - sense-proxy-1.company.internal
```

`allowedSources` accepts literal IPv4 addresses and hostnames. Hostnames are resolved once at startup to IPv4 addresses. If validation is enabled but the list is empty, or none of the entries resolve, Butler SOS logs a warning and disables source validation at startup. Unauthorized packets are dropped before queueing, and repeated reject messages from the same source IP are rate-limited to avoid log flooding.

See the [UDP Message Queue](../../../concepts/monitoring/udp-queue#source-ip-validation) page for the full runtime behavior shared by both `userEvents` and `logEvents`.

## Tagging of Data

### InfluxDB

The tags added to InfluxDB are described in the reference documentation for [user events](/v15.0/reference/available-metrics/influxdb#user-events).

### New Relic

The following attributes (which is New Relic lingo for tags) are added:

1. A core set of attributes are added to all user events:

   - `qs_host`: Host name of the Sense server the event originated at.
   - `qs_event_action`: What kind of user event that took place. Examples are "Start session", "Stop session", "Open connection", "Close connection".
   - `qs_userFull`: Full directory/user ID of the user the event is about. Will be scrambled if scrambling enabled in config file.
   - `qs_userDirectory`: User directory of the user the event is about. Will be scrambled if scrambling enabled in config file.
   - `qs_userId`: User ID of the user the event is about. Will be scrambled if scrambling enabled in config file.
   - `qs_origin`: What kind of activity caused the event, for example "AppAccess". May be empty for some user events.
   - `qs_appId`: App ID of the app the event is about. May be empty for some user events.
   - `qs_appName`: App name of the app the event is about. May be empty for some user events.
   - `qs_uaBrowserName`: Browser name of the user agent that caused the event.
   - `qs_uaBrowserMajorVersion`: Browser major version of the user agent that caused the event.
   - `qs_uaOsName`: OS name of the user agent that caused the event.
   - `qs_uaOsVersion`: OS version of the user agent that caused the event.

2. Custom attributes defined in the Butler SOS config file's `Butler-SOS.userEvents.tags` section.

::: warning Attribute Naming
Attributes defined further down in the list above will overwrite already defined attributes if their names match.  
To avoid problems you should make sure not to use already defined attributes.
:::

## Settings in Main Config File

```yaml
Butler-SOS:
  ...
  ...
  # Track individual users opening/closing apps and starting/stopping sessions.
  # Requires log appender XML file(s) to be added to Sense server(s).
  userEvents:
    enable: false
    excludeUser:                    # Optional blacklist of users that should be disregarded
      - directory: LAB
        userId: testuser1
      - directory: LAB
        userId: testuser2
    udpServerConfig:
      serverHost: butler-sos.mycompany.net      # Host/IP where user event server will listen for events from Sense
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
      enable: false                 # Should user events be sent to New Relic?
      destinationAccount:
        - First NR account
        - Second NR account
      scramble: true                # Should user info be scrambled before sent to NR?
  ...
  ...
```

## Log Appender XML Files

A sample log appender file `LocalLogConfig.xml` is available in the ZIP file available from the [download page](https://github.com/ptarmiganlabs/butler-sos/releases), in the `config/log_appender_xml/proxy/LocalLogConfig.xml` folder.

That file includes log appenders for both user and log events.  
Looks like this:

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
        <param name="remoteAddress" value="FQDN or IP of server where Butler SOS is running" />
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
        <param name="remoteAddress" value="FQDN or IP of server where Butler SOS is running" />
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

::: tip Multiple Servers
If you have several servers in your Sense cluster you probably need several log appender files too.

More specifically, you should put a log appender file on each server where the Qlik Sense proxy service is running, i.e. on all servers via which end users access the Sense cluster.
:::

Note the places where you need to fill in the IP/host where Butler SOS is running, as well as the port number to use (set to 9997 but can be changed if needed).

Make necessary changes so the file matches your environment, then deploy to `C:\ProgramData\Qlik\Sense\Proxy\LocalLogConfig.xml` (adapt path if you have a different installation path).  
Note that the file **must** be called `LocalLogConfig.xml`!

Sense will usually detect and use the file without any restarts needed, but it can take a while. You can always restart the Sense proxy service to make sure the XML file is applied and used.

Once in place you should see events in the Butler SOS console/file logs if you set logging level to `verbose`, `debug` or `silly`.
