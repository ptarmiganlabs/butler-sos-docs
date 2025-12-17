# Config File Format

The config file is the heart of Butler SOS. All settings must be defined in the config file—runtime errors are likely to occur otherwise.

::: tip
The config file uses YAML notation, with file extensions of `.yaml` or `.yml`.  
The `.yaml` extension is recommended.
:::

A sample config file is included in the release ZIP files, and also [available on GitHub](https://raw.githubusercontent.com/ptarmiganlabs/butler-sos/master/src/config/production_template.yaml).

## Important Notes

- Topic names (e.g. `Butler-SOS.logLevel`) are case sensitive
- First time Butler SOS starts, it checks if the specified InfluxDB database exists. If not, it creates the database along with a default InfluxDB retention policy based on the time period set in the config file
- **Conditional validation**: Starting with Butler SOS 12.0.0, configuration settings for disabled features are not validated for format or types. This means you can leave placeholder values for features you have disabled without getting validation errors

## Configuration Sections

### Top Level Settings

| Parameter       | Description                                                                                                                        |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `logLevel`      | The level of detail in logs. Possible values: `silly`, `debug`, `verbose`, `info`, `warn`, `error` (in order of decreasing detail) |
| `fileLogging`   | `true`/`false` to enable/disable logging to disk file                                                                              |
| `logDirectory`  | Subdirectory where log files are stored                                                                                            |
| `anonTelemetry` | Can Butler SOS share anonymous data about itself with the Butler SOS project? More info in [telemetry docs](/docs/about/telemetry) |

---

### Butler-SOS.configVisualisation

Settings for Butler SOS' web-based configuration visualization feature.

| Parameter   | Description                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------------------------------------- |
| `enable`    | Should Butler SOS' config file be visualized in a web UI? `true`/`false`                                              |
| `host`      | Hostname or IP address where the web server will listen. Should be `localhost` or the host's IP address in most cases |
| `port`      | Port where the web server will listen. Change if port 3100 is already in use                                          |
| `obfuscate` | Should the config file shown in the web UI be obfuscated? `true`/`false`                                              |

---

### Butler-SOS.systemInfo

Control whether Butler SOS gathers detailed system information about the host it's running on.

When enabled, Butler SOS uses the underlying `systeminformation` npm package which executes various OS commands to gather detailed host information. In some enterprise environments, these commands may be flagged as suspicious by security monitoring tools.

| Parameter | Description                                                                                                                                                                                                                                                                                                                                                    |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enable`  | Should Butler SOS gather detailed system information? `true`/`false`. **Default: true**. Set to `false` in security-sensitive environments where OS command execution is restricted. Note that [telemetry](/docs/about/telemetry) requires system information to be enabled—Butler SOS will refuse to start if telemetry is enabled but systemInfo is disabled |

---

### Butler-SOS.heartbeat

Heartbeats can be used to send "I'm alive" messages to some other tool, e.g., an infrastructure monitoring tool. The concept is simple: The remoteURL will be called at the specified frequency. The receiving tool will then know that Butler SOS is alive.

| Parameter   | Description                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `enable`    | Should heartbeats be sent to some URL, indicating that Butler SOS is alive and well? `true`/`false`                          |
| `remoteURL` | URL that will be called for heartbeats                                                                                       |
| `frequency` | How often should heartbeats be sent? Format according to [later.js parser](https://bunkat.github.io/later/parsers.html#text) |

---

### Butler-SOS.dockerHealthCheck

Docker health checks are used when running Butler SOS as a Docker container. The Docker engine will call the container's health check REST endpoint with a set interval to determine whether the container is alive/well or not.

If you are _not_ running Butler SOS in Docker you can disable this feature.

| Parameter | Description                                                                                                                                |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `enable`  | Should a Docker healthcheck endpoint be created within Butler SOS? Set to `false` if _not_ running Butler SOS under Docker. `true`/`false` |
| `port`    | Port the healthcheck should use. Usually 12398, but might need to be changed if several Butler instances run on the same server            |

---

### Butler-SOS.uptimeMonitor

| Parameter                                               | Description                                                                                                                          |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `enable`                                                | Should messages with Butler SOS uptime and memory usage be written to console and logs? `true`/`false`                               |
| `frequency`                                             | How often should uptime messages be written? Format according to [later.js parser](https://bunkat.github.io/later/parsers.html#text) |
| `logLevel`                                              | At what log level should uptime messages appear? Possible values: `silly`, `debug`, `verbose`, `info`, `warn`, `error`               |
| `storeInInfluxdb.butlerSOSMemoryUsage`                  | Should data on Butler SOS' own memory use be stored in InfluxDB? `true`/`false`                                                      |
| `storeInInfluxdb.instanceTag`                           | Tag used to differentiate data from multiple Butler SOS instances                                                                    |
| `storeNewRelic.enable`                                  | Should uptime data be sent to New Relic? `true`/`false`                                                                              |
| `storeNewRelic.destinationAccount`                      | Array of New Relic account names to which uptime data will be sent                                                                   |
| `storeNewRelic.metric.dynamic.butlerMemoryUsage.enable` | Should Butler SOS memory metrics be sent to New Relic? `true`/`false`                                                                |
| `storeNewRelic.metric.dynamic.butlerUptime.enable`      | Should Butler uptime be sent to New Relic? `true`/`false`                                                                            |
| `storeNewRelic.attribute.static`                        | Array of attributes added to all uptime metrics sent to New Relic                                                                    |
| `storeNewRelic.attribute.dynamic.butlerVersion.enable`  | Should uptime metrics be tagged with Butler SOS version number? `true`/`false`                                                       |

---

### Butler-SOS.thirdPartyToolsCredentials

| Parameter                 | Description                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `newRelic`                | Array of credentials for New Relic accounts to which data should be sent                                |
| `newRelic[].accountName`  | Name of New Relic account. This is a "friendly name" used within Butler SOS to identify each NR account |
| `newRelic[].insertApiKey` | Insert API key associated with the NR account. Get this from the NR account's settings page             |
| `newRelic[].accountId`    | New Relic account ID. Get this from the NR account's settings page                                      |

---

### Butler-SOS.userEvents

Track individual users opening/closing apps and starting/stopping sessions. Requires log appender XML file(s) to be added to Sense server(s).

::: warning Breaking Change in v13
Starting with Butler SOS v13, the `udpServerConfig` section requires additional settings for `messageQueue`, `rateLimit`, `maxMessageSize`, and `queueMetrics`. Existing configuration files must be updated to include these new sections.
:::

| Parameter                                               | Description                                                                                              |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `enable`                                                | Should Butler SOS track detailed user events (session start/stop, connection open/close)? `true`/`false` |
| `excludeUser`                                           | Array of users (directory/userId pairs) that should be disregarded when user events arrive from Sense    |
| `udpServerConfig.serverHost`                            | IP/host where the user event UDP server should listen. Using `0.0.0.0` will listen on all available IPs  |
| `udpServerConfig.portUserActivityEvents`                | Port on which the user event UDP server will listen. Should match the port in the log appender           |
| `udpServerConfig.messageQueue.maxConcurrent`            | Max messages processed simultaneously. Default: 10.                                                      |
| `udpServerConfig.messageQueue.maxSize`                  | Max queue size before messages are dropped. Default: 200.                                                |
| `udpServerConfig.messageQueue.backpressureThreshold`    | Queue utilization % that triggers warnings. Default: 80.                                                 |
| `udpServerConfig.rateLimit.enable`                      | Enable rate limiting to prevent message flooding. Default: false.                                        |
| `udpServerConfig.rateLimit.maxMessagesPerMinute`        | Max messages allowed per minute. Default: 600.                                                           |
| `udpServerConfig.maxMessageSize`                        | Max UDP message size in bytes. Default: 65507 (UDP max).                                                 |
| `udpServerConfig.queueMetrics.influxdb.enable`          | Store queue metrics in InfluxDB. Default: false.                                                         |
| `udpServerConfig.queueMetrics.influxdb.writeFrequency`  | How often to write metrics (ms). Default: 20000.                                                         |
| `udpServerConfig.queueMetrics.influxdb.measurementName` | InfluxDB measurement name. Default: user_events_queue.                                                   |
| `udpServerConfig.queueMetrics.influxdb.tags`            | Array of name/value pairs added as tags to queue metrics.                                                |
| `tags`                                                  | Array of tags (tagName/tagValue pairs) added to each user event before sending to InfluxDB               |
| `sendToMQTT.enable`                                     | Should user events be sent to MQTT? `true`/`false`                                                       |
| `sendToMQTT.postTo.everythingTopic.enable`              | Should **all** user event messages be sent to an MQTT topic? `true`/`false`                              |
| `sendToMQTT.postTo.everythingTopic.topic`               | MQTT topic to which **all** user event messages will be sent                                             |
| `sendToMQTT.postTo.sessionStartTopic.enable`            | Should **session start** messages be sent to an MQTT topic? `true`/`false`                               |
| `sendToMQTT.postTo.sessionStartTopic.topic`             | MQTT topic for **session start** messages                                                                |
| `sendToMQTT.postTo.sessionStopTopic.enable`             | Should **session stop** messages be sent to an MQTT topic? `true`/`false`                                |
| `sendToMQTT.postTo.sessionStopTopic.topic`              | MQTT topic for **session stop** messages                                                                 |
| `sendToMQTT.postTo.connectionOpenTopic.enable`          | Should **connection open** messages be sent to an MQTT topic? `true`/`false`                             |
| `sendToMQTT.postTo.connectionOpenTopic.topic`           | MQTT topic for **connection open** messages                                                              |
| `sendToMQTT.postTo.connectionCloseTopic.enable`         | Should **connection close** messages be sent to an MQTT topic? `true`/`false`                            |
| `sendToMQTT.postTo.connectionCloseTopic.topic`          | MQTT topic for **connection close** messages                                                             |
| `sendToInfluxdb.enable`                                 | Should user events be saved in InfluxDB? `true`/`false`                                                  |
| `sendToNewRelic.enable`                                 | Should user events be saved in New Relic? `true`/`false`                                                 |
| `sendToNewRelic.destinationAccount`                     | Array of New Relic account names to which user events will be sent                                       |
| `sendToNewRelic.scramble`                               | Should user directory and user ID fields be scrambled before sending to New Relic? `true`/`false`        |

---

### Butler-SOS.logEvents

Log events are used to capture Sense warnings, errors, and fatals in real time. Requires log appender XML file(s) to be added to Sense server(s).

Note that log events can be enabled/disabled per source (repository, proxy, scheduler, etc.).

::: warning Breaking Change in v13
Starting with Butler SOS v13, the `udpServerConfig` section requires additional settings for `messageQueue`, `rateLimit`, `maxMessageSize`, and `queueMetrics`. Existing configuration files must be updated to include these new sections.
:::

| Parameter                                               | Description                                                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `udpServerConfig.serverHost`                            | IP/host where the log event UDP server should listen. Using `0.0.0.0` will listen on all available IPs |
| `udpServerConfig.portLogEvents`                         | Port on which the log event UDP server will listen. Should match the port in the log appender          |
| `udpServerConfig.messageQueue.maxConcurrent`            | Max messages processed simultaneously. Default: 10.                                                    |
| `udpServerConfig.messageQueue.maxSize`                  | Max queue size before messages are dropped. Default: 200.                                              |
| `udpServerConfig.messageQueue.backpressureThreshold`    | Queue utilization % that triggers warnings. Default: 80.                                               |
| `udpServerConfig.rateLimit.enable`                      | Enable rate limiting to prevent message flooding. Default: false.                                      |
| `udpServerConfig.rateLimit.maxMessagesPerMinute`        | Max messages allowed per minute. Default: 600.                                                         |
| `udpServerConfig.maxMessageSize`                        | Max UDP message size in bytes. Default: 65507 (UDP max).                                               |
| `udpServerConfig.queueMetrics.influxdb.enable`          | Store queue metrics in InfluxDB. Default: false.                                                       |
| `udpServerConfig.queueMetrics.influxdb.writeFrequency`  | How often to write metrics (ms). Default: 20000.                                                       |
| `udpServerConfig.queueMetrics.influxdb.measurementName` | InfluxDB measurement name. Default: log*events_queue. \_New in v13.1*                                  |
| `udpServerConfig.queueMetrics.influxdb.tags`            | Array of name/value pairs added as tags to queue metrics.                                              |
| `tags`                                                  | Array of tags (tagName/tagValue pairs) added to each log event before sending to InfluxDB              |
| `source.engine.enable`                                  | Should log events from the engine service be handled? `true`/`false`                                   |
| `source.proxy.enable`                                   | Should log events from the proxy service be handled? `true`/`false`                                    |
| `source.repository.enable`                              | Should log events from the repository service be handled? `true`/`false`                               |
| `source.scheduler.enable`                               | Should log events from the scheduler service be handled? `true`/`false`                                |
| `categorise.enable`                                     | Should categorization of log events be enabled? `true`/`false`                                         |
| `categorise.rules`                                      | Array of rules used to categorise log events                                                           |
| `categorise.rules[].description`                        | Description of the rule                                                                                |
| `categorise.rules[].logLevel[]`                         | Array of log levels to match against this rule                                                         |
| `categorise.rules[].action`                             | Action to take if matched. Values: `categorise`, `drop`                                                |
| `categorise.rules[].category[]`                         | Array of name-value pairs added to the log event if matched                                            |
| `categorise.rules[].filter[]`                           | Array of type-value pairs used to match log events                                                     |
| `categorise.rules[].filter[].type`                      | Filter type. Values: `sw` (starts with), `ew` (ends with), `so` (substring of)                         |
| `categorise.ruleDefault`                                | Default values for categorization if no other rule matches                                             |
| `categorise.ruleDefault.enable`                         | Should the default rule be used? `true`/`false`                                                        |
| `categorise.ruleDefault.category[]`                     | Array of name-value pairs added if no other rule matches                                               |
| `sendToMQTT.enable`                                     | Should log events be sent to MQTT? `true`/`false`                                                      |
| `sendToMQTT.baseTopic`                                  | Root MQTT topic for all log event messages                                                             |
| `sendToMQTT.postTo.baseTopic`                           | Should all log events be posted to the root topic? `true`/`false`                                      |
| `sendToMQTT.postTo.subsystemTopics`                     | Should log events be posted to subsystem-specific topics? `true`/`false`                               |
| `sendToInfluxdb.enable`                                 | Should log events be saved in InfluxDB? `true`/`false`                                                 |
| `sendToNewRelic.enable`                                 | Should log events be sent to New Relic? `true`/`false`                                                 |
| `sendToNewRelic.destinationAccount`                     | Array of New Relic account names to which log events will be sent                                      |
| `sendToNewRelic.source.engine.enable`                   | Should log events from the engine service be handled?                                                  |
| `sendToNewRelic.source.engine.logLevel.error`           | Should ERROR log events from the engine service be handled?                                            |
| `sendToNewRelic.source.engine.logLevel.warn`            | Should WARN log events from the engine service be handled?                                             |
| `sendToNewRelic.source.proxy.enable`                    | Should log events from the proxy service be handled?                                                   |
| `sendToNewRelic.source.proxy.logLevel.error`            | Should ERROR log events from the proxy service be handled?                                             |
| `sendToNewRelic.source.proxy.logLevel.warn`             | Should WARN log events from the proxy service be handled?                                              |
| `sendToNewRelic.source.repository.enable`               | Should log events from the repository service be handled?                                              |
| `sendToNewRelic.source.repository.logLevel.error`       | Should ERROR log events from the repository service be handled?                                        |
| `sendToNewRelic.source.repository.logLevel.warn`        | Should WARN log events from the repository service be handled?                                         |
| `sendToNewRelic.source.scheduler.enable`                | Should log events from the scheduler service be handled?                                               |
| `sendToNewRelic.source.scheduler.logLevel.error`        | Should ERROR log events from the scheduler service be handled?                                         |
| `sendToNewRelic.source.scheduler.logLevel.warn`         | Should WARN log events from the scheduler service be handled?                                          |

---

### Butler-SOS.cert

Certificates to use when connecting to Sense. Get these from the Certificate Export in QMC.

| Parameter              | Description                                                                    |
| ---------------------- | ------------------------------------------------------------------------------ |
| `clientCert`           | Certificate file. Exported from QMC                                            |
| `clientCertKey`        | Certificate key file. Exported from QMC                                        |
| `clientCertCA`         | Root certificate for above certificate files. Exported from QMC                |
| `clientCertPassphrase` | Password used to protect the certificate (as set when exporting cert from QMC) |

---

### Butler-SOS.mqttConfig

MQTT config parameters. These must be correctly defined for any other MQTT features in Butler SOS to work.

| Parameter    | Description                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| `enable`     | Should health metrics be sent to MQTT? `true`/`false`                                                    |
| `brokerHost` | IP or FQDN of MQTT broker                                                                                |
| `brokerPort` | Broker port                                                                                              |
| `baseTopic`  | Default topic used if not otherwise specified elsewhere. Should end with `/`. For example: `butler-sos/` |

---

### Butler-SOS.newRelic

If enabled, select Butler SOS metrics and events will be sent to New Relic.

Note that New Relic destination accounts for events are defined in `Butler-SOS.userEvent` and `Butler-SOS.logEvent` sections, whereas destination accounts for metrics are defined in this section.

| Parameter                                          | Description                                                                                                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `enable`                                           | Should Qlik Sense health metrics be sent to New Relic? `true`/`false`                                                                        |
| `event.url`                                        | API URL for sending events to New Relic. Options: `https://insights-collector.eu01.nr-data.net` or `https://insights-collector.newrelic.com` |
| `event.header`                                     | Array of name/value pairs added as HTTP headers to all calls to New Relic event API                                                          |
| `event.attribute.static`                           | Array of name/value pairs representing attributes added to all events sent to New Relic                                                      |
| `event.attribute.dynamic.butlerSosVersion.enable`  | Should Butler SOS' version be attached as an attribute to events? `true`/`false`                                                             |
| `metric.destinationAccount`                        | Array of New Relic account names to which Sense health metrics will be sent                                                                  |
| `metric.url`                                       | API URL for sending metrics. Options: `https://insights-collector.eu01.nr-data.net/metric/v1` or `https://metric-api.newrelic.com/metric/v1` |
| `metric.header`                                    | Array of name/value pairs added as HTTP headers to all calls to New Relic metric API                                                         |
| `metric.dynamic.engine.memory.enable`              | Send Sense memory metrics to New Relic? `true`/`false`                                                                                       |
| `metric.dynamic.engine.cpu.enable`                 | Send Sense CPU metrics to New Relic? `true`/`false`                                                                                          |
| `metric.dynamic.engine.calls.enable`               | Send metrics about calls to the Sense engine? `true`/`false`                                                                                 |
| `metric.dynamic.engine.selections.enable`          | Send metrics about selections made in Sense apps? `true`/`false`                                                                             |
| `metric.dynamic.engine.sessions.enable`            | Send aggregated Sense engine session metrics? `true`/`false`                                                                                 |
| `metric.dynamic.engine.users.enable`               | Send aggregated Sense user metrics? `true`/`false`                                                                                           |
| `metric.dynamic.engine.saturated.enable`           | Send Sense engine saturation status? `true`/`false`                                                                                          |
| `metric.dynamic.apps.docCount.enable`              | Send metrics on loaded/active/in-memory Sense apps? `true`/`false`                                                                           |
| `metric.dynamic.apps.activeDocs.enable`            | Should data on active docs be sent to New Relic? `true`/`false`                                                                              |
| `metric.dynamic.apps.loadedDocs.enable`            | Should data on loaded docs be sent to New Relic? `true`/`false`                                                                              |
| `metric.dynamic.apps.inMemoryDocs.enable`          | Should data on in-memory docs be sent to New Relic? `true`/`false`                                                                           |
| `metric.dynamic.cache.cache.enable`                | Send Sense cache metrics to New Relic? `true`/`false`                                                                                        |
| `metric.dynamic.proxy.sessions.enable`             | Send aggregated Sense proxy metrics to New Relic? `true`/`false`                                                                             |
| `metric.attribute.static`                          | Array of name/value pairs representing attributes added to all Sense health metrics                                                          |
| `metric.attribute.dynamic.butlerSosVersion.enable` | Should Butler SOS' version be attached to Sense health metrics? `true`/`false`                                                               |

---

### Butler-SOS.prometheus

If enabled, select Butler SOS metrics will be exposed on a Prometheus compatible URL from where they can be scraped by Prometheus.

| Parameter | Description                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------- |
| `enable`  | Should health metrics be made available on a Prometheus compatible endpoint? `true`/`false`               |
| `host`    | IP on which the Prometheus endpoint should be available. Using `0.0.0.0` will listen on all available IPs |
| `port`    | Port on which the Prometheus endpoint will be available. Default 9842                                     |

---

### Butler-SOS.influxdbConfig

InfluxDB config parameters. These must be correctly defined for any InfluxDB features in Butler SOS to work.

If you are using InfluxDB v1, you can leave the `v2Config` and `v3Config` sections at their defaults. Similar for v2 and v3.

| Parameter                           | Description                                                                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `enable`                            | Should health metrics be stored in InfluxDB? `true`/`false`                                                                                      |
| `host`                              | IP or FQDN of InfluxDB server                                                                                                                    |
| `port`                              | Port where InfluxDB server is listening. **NOTE:** Must be set to a value (e.g., 8086)                                                           |
| `version`                           | InfluxDB version. Valid values: `1`, `2`, or `3`                                                                                                 |
| `maxBatchSize`                      | Maximum number of data points to write in a single batch. Valid range: 1-10000. Default: 1000                                                    |
| `v3Config.database`                 | Database name for InfluxDB v3                                                                                                                    |
| `v3Config.description`              | Description of the InfluxDB database                                                                                                             |
| `v3Config.token`                    | Token for InfluxDB v3                                                                                                                            |
| `v3Config.retentionDuration`        | Retention duration for data in InfluxDB v3 (e.g., `10d`)                                                                                         |
| `v3Config.writeTimeout`             | Socket timeout for write operations in milliseconds. Default: 10000                                                                              |
| `v3Config.queryTimeout`             | Query timeout in milliseconds. Default: 60000                                                                                                    |
| `v2Config.org`                      | Organization name for InfluxDB v2                                                                                                                |
| `v2Config.bucket`                   | Bucket name for InfluxDB v2                                                                                                                      |
| `v2Config.description`              | Description of the InfluxDB bucket                                                                                                               |
| `v2Config.token`                    | Token for InfluxDB v2                                                                                                                            |
| `v2Config.retentionDuration`        | Retention duration for the InfluxDB bucket                                                                                                       |
| `v1Config.auth.enable`              | Enable if using a password-protected InfluxDB v1 database                                                                                        |
| `v1Config.auth.username`            | InfluxDB username                                                                                                                                |
| `v1Config.auth.password`            | InfluxDB password                                                                                                                                |
| `v1Config.dbName`                   | Name of InfluxDB v1 database to use                                                                                                              |
| `v1Config.retentionPolicy.name`     | Name of default retention policy created when database is first created                                                                          |
| `v1Config.retentionPolicy.duration` | Duration during which metrics are kept. See [InfluxDB docs](https://docs.influxdata.com/influxdb/v1.8/query_language/spec/#durations) for syntax |
| `includeFields.activeDocs`          | Should a list of currently active Sense apps be stored? `true`/`false`                                                                           |
| `includeFields.loadedDocs`          | Should a list of Sense apps opened in a user session be stored? `true`/`false`                                                                   |
| `includeFields.inMemoryDocs`        | Should a list of Sense apps loaded into memory be stored? `true`/`false`                                                                         |

---

### Butler-SOS.appNames

| Parameter              | Description                                                               |
| ---------------------- | ------------------------------------------------------------------------- |
| `enableAppNameExtract` | Should app names be extracted from Qlik Sense server? `true`/`false`      |
| `extractInterval`      | How often (milliseconds) should app names be extracted from Sense server? |
| `hostIP`               | IP or FQDN of Sense server from which app names should be extracted       |

---

### Butler-SOS.userSessions

Extract user session data per virtual proxy.

| Parameter              | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `enableSessionExtract` | Should user session data be extracted? `true`/`false`              |
| `pollingInterval`      | How often (milliseconds) to poll for user session data             |
| `excludeUser`          | Array of users (directory/userId pairs) that should be disregarded |

---

### Butler-SOS.serversToMonitor

| Parameter                               | Description                                                                                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pollingInterval`                       | How often to query the Sense healthcheck API                                                                                                                              |
| `rejectUnauthorized`                    | Set to `false` to ignore warnings/errors caused by Qlik Sense's self-signed certificates. Set to `true` if the Qlik Sense root CA is available on the Butler SOS computer |
| `serverTagsDefinition`                  | List of tags to add to each server when storing data in InfluxDB. All tags defined here MUST be present in each server's definition section                               |
| `servers`                               | Array of servers to monitor. For each server, a set of properties MUST be defined                                                                                         |
| `servers[].host`                        | FQDN of server. Domain should match that of the certificate exported from QMC. **NOTE:** Include the port (should be `:4747` unless changed from default)                 |
| `servers[].serverName`                  | Human friendly server name                                                                                                                                                |
| `servers[].serverDescription`           | Human friendly server description                                                                                                                                         |
| `servers[].userSessions.enable`         | Control whether user session data should be retrieved for this server                                                                                                     |
| `servers[].userSessions.host`           | Host and port from which to retrieve user session data. Usually `servername.mydomain.net:4243`                                                                            |
| `servers[].userSessions.virtualProxies` | A list of key-value pairs specifying which virtual proxies on this server to retrieve user session data from                                                              |
| `servers[].serverTags`                  | A list of key-value pairs providing metadata for servers. Can be used in Grafana dashboards                                                                               |
| `servers[].headers`                     | A list of key-value pairs. Headers specified here will be used when retrieving metrics from this Sense server                                                             |
