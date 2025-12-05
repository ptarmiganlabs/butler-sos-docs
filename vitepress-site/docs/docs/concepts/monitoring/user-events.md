---
outline: deep
---

# User Events

User events provide real-time tracking of user activity in your Qlik Sense environment.

Unlike polling-based [user sessions](./user-sessions) data, user events are pushed to Butler SOS as they happen via UDP messages.

## Event types

| Event Type                | Description                                 |
| ------------------------- | ------------------------------------------- |
| **Session start/stop**    | Users logging in or out of Qlik Sense       |
| **Connection open/close** | Apps being opened or closed in browser tabs |

## How it works

User events rely on Qlik Sense's Log4Net logging framework:

1. A log appender XML file is deployed on the Sense server(s)
2. The XML file instructs Log4Net to forward specific log events to Butler SOS via UDP
3. Butler SOS receives and processes the events in near real-time
4. Events are stored in InfluxDB and/or forwarded to other destinations

::: info
Events arrive at Butler SOS within seconds of the actual event occurring in Qlik Sense.
:::

## Data captured

Each user event includes:

- **Host** - The Sense server where the event originated
- **Event action** - Start session, Stop session, Open connection, Close connection
- **User information** - User directory and user ID
- **Origin** - What caused the event (e.g., AppAccess)
- **App information** - App ID and name (when applicable)
- **User agent** - Browser and OS information (see below)

## Configuration

### Butler SOS config file

```yaml
Butler-SOS:
  userEvents:
    enable: true
    excludeUser: # Optional blacklist
      - directory: LAB
        userId: testuser1
    udpServerConfig:
      serverHost: 192.168.1.100 # Where Butler SOS listens
      portUserActivityEvents: 9997 # UDP port for user events
    tags: # Custom tags for InfluxDB
      - tag: env
        value: PROD
    sendToMQTT:
      enable: false
      postTo:
        everythingTopic:
          enable: true
          topic: qliksense/userevent
```

### Log appender XML file

A log appender XML file must be deployed on each Sense server where you want to capture user events.

The file should be placed in:

```text
C:\ProgramData\Qlik\Sense\Proxy\LocalLogConfig.xml
```

Example content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <appender name="EventSession" type="log4net.Appender.UdpAppender">
    <remoteAddress value="192.168.1.100" />
    <remotePort value="9997" />
    <layout type="log4net.Layout.PatternLayout">
      <conversionPattern value="/proxy-user-event/;%property{hostname};%property{subsystem};%property{context};%message" />
    </layout>
    <filter type="log4net.Filter.StringMatchFilter">
      <regexToMatch value="^(Start|Stop) session" />
    </filter>
    <filter type="log4net.Filter.StringMatchFilter">
      <regexToMatch value="^(Opening|Closing) connection" />
    </filter>
    <filter type="log4net.Filter.DenyAllFilter" />
  </appender>
  <logger name="Session.Proxy">
    <appender-ref ref="EventSession" />
  </logger>
</configuration>
```

::: warning Firewall configuration
Ensure firewalls allow UDP traffic from the Sense server(s) to Butler SOS on the configured port.
:::

## Use cases

User events are extremely valuable for:

- **Real-time dashboards** - Show who is currently using Sense
- **Security monitoring** - Track user access patterns
- **Troubleshooting** - Correlate user activity with system issues
  - Example: "Who caused that 250 GB drop in RAM we were just alerted about?"
- **Usage analytics** - Understand when and how users access apps

## Data destinations

User events can be sent to:

- **InfluxDB** - For Grafana visualization
- **New Relic** - For cloud-based monitoring
- **MQTT** - For integration with other systems

## User agent tracking

User events include the browser's user agent string, which Butler SOS parses to extract:

| Field           | Example |
| --------------- | ------- |
| Browser name    | Chrome  |
| Browser version | 119     |
| OS name         | Windows |
| OS version      | 10      |

This data is stored as InfluxDB tags (`qs_uaBrowserName`, `qs_uaBrowserMajorVersion`, `qs_uaOsName`, `qs_uaOsVersion`) and can be used to:

- Track which browsers access your Sense environment
- Identify outdated browsers that may have security issues
- Understand mobile vs desktop usage patterns
