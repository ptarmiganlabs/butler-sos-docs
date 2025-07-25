---
title: "Config file format"
linkTitle: "Config file format"
weight: 10
description: >
  Everything you ever wanted to know about the Butler SOS configuration file.
---

{{% alert title="Tip" color="primary" %}}

The config file uses YAML notation, with file extensions of .yaml or .yml.  
The .yaml extension is recommended.

{{% /alert %}}

The config file is the heart of Butler SOS.  
All setting must be defined in the config file - run time errors are likely to occur otherwise.

A sample config file is included in the release ZIP files, and also [available on GitHub](https://raw.githubusercontent.com/ptarmiganlabs/butler-sos/master/src/config/production_template.yaml).

A few things to keep in mind:

- Topic names (e.g. "Butler-SOS.logLevel") are case sensitive.
- First time Butler SOS is started, a new check is done if the specified InfluxDB database already exists.
  If it doesn't exist it will be created together with a default InfluxDB retention policy. The retention policy is based on the time period set in the config file.
- **Conditional validation**: Starting with Butler SOS 11.2, configuration settings for disabled features are not validated for format or types. This means you can leave placeholder values (like those in the production template) for features you have disabled without getting validation errors.

#### Top level

| Parameter     | Description                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
|               |                                                                                                                                                  |
| logLevel      | The level of details in the logs. Possible values are silly, debug, verbose, info, warn, error (in order of decreasing level of detail).         |
| fileLogging   | true/false to enable/disable logging to disk file                                                                                                |
| logDirectory  | Subdirectory where log files are stored                                                                                                          |
| anonTelemetry | Can Butler SOS share anonymous data about itself with the Butler SOS project? More info on what data is collected [here](/docs/about/telemetry). |
|               |                                                                                                                                                  |

#### Butler-SOS.configVisualisation

| Parameter | Description                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| enable    | Should Butler SOS' config file be visualized in a web UI? true/false                                                 |
| host      | Hostname or IP address where the web server will listen. Should be localhost or the host's IP address in most cases. |
| port      | Port where the web server will listen. Change if port 3100 is already in use.                                        |
| obfuscate | Should the config file shown in the web UI be obfuscated? true/false                                                 |

#### Butler-SOS.systemInfo

Control whether Butler SOS gathers detailed system information about the host it's running on.  
When enabled, Butler SOS uses the underlying `systeminformation` npm package which executes various OS commands to gather detailed host information. In some enterprise environments, these commands may be flagged as suspicious by security monitoring tools.

| Parameter | Description                                                                                                                                                                                                                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enable    | Should Butler SOS gather detailed system information? true/false. **Default: true**. Set to false in security-sensitive environments where OS command execution is restricted. Note that [telemetry](/docs/about/telemetry/) requires system information to be enabled - Butler SOS will refuse to start if telemetry is enabled but systemInfo is disabled. |
|           |                                                                                                                                                                                                                                                                                                                                                   |

#### Butler-SOS.heartbeat

Heartbeats can be used to send "I'm alive" messages to some other tool, e.g. an infrastructure monitoring tool.  
The concept is simple: The remoteURL will be called at the specified frequency. The receiving tool will then know that Butler SOS is alive.

| Parameter | Description                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------- |
| enable    | Should heartbeats be sent to some URL, indicating that Butler SOS is alive and well? true/false           |
| remoteURL | URL that will be called for heartbeats                                                                    |
| frequency | How often should heartbeats be sent? Format according to https://bunkat.github.io/later/parsers.html#text |
|           |                                                                                                           |

#### Butler-SOS.dockerHealthCheck

Docker health checks are used when running Butler SOS as a Docker container.

The Docker engine will call the container's health check REST endpoint with a set interval to determine whether the container is alive/well or not.  
If you are _not_ running Butler SOS in Docker you can disable this feature.

| Parameter | Description                                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| enable    | Should a Docker healthcheck endpoint be created within Butler SOS? Set to false if _not_ running Butler SOS under Docker. true/false |
| port      | Port the healthcheck should use. Usually 12398, but might need be changed if several Butler instances run on the same server         |
|           |                                                                                                                                      |

#### Butler-SOS.uptimeMonitor

| Parameter                                                     | Description                                                                                                                                                                                                                                               |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enable                                                        | Should messages with Butler SOS uptime and memory usage be written to console and logs? true/false                                                                                                                                                        |
| frequency                                                     | How often should uptime messages be written to console and/or logs? Format according to https://bunkat.github.io/later/parsers.html#text                                                                                                                  |
| logLevel                                                      | Starting at what log level should uptime messages be used? Possible values are silly, debug, verbose, info, warn, error. For example, if you specify "verbose" here, uptime messages will appear if you set overall log level to silly, debug or verbose. |
| storeInInfluxdb.<br>butlerSOSMemoryUsage                      | Should data on Butler SOS' own memory use be stored in Infludb? true/false                                                                                                                                                                                |
| storeInInfluxdb.<br>instanceTag                               | Tag used to differentiate data from multiple Butler SOS instances. Useful if running different Butler SOS instances against (for example) DEV, TEST and PROD environments                                                                                 |
| storeNewRelic.<br>enable                                      | Should uptime data be sent to New Relic? true/false                                                                                                                                                                                                       |
| storeNewRelic.<br>destinationAccount                          | Array of New Relic account names to which uptime data will be sent                                                                                                                                                                                        |
| storeNewRelic.<br>metric.dynamic.<br>butlerMemoryUsage.enable | Should Butler SOS memory metrics be sent to New Relic? true/false                                                                                                                                                                                         |
| storeNewRelic.<br>metric.dynamic.<br>butlerUptime.enable      | Should Butler uptime (days, hours, minutes since startup) be sent to New Relic? true/false                                                                                                                                                                |
| storeNewRelic.<br>attribute.static                            | Array of attributes which will be added to all uptime metrics sent to New Relic                                                                                                                                                                           |
| storeNewRelic.<br>attribute.dynamic.<br>butlerVersion.enable  | Should uptime metrics be tagged with Butler SOS version number? true/false                                                                                                                                                                                |
|                                                               |                                                                                                                                                                                                                                                           |

#### Butler-SOS.thirdPartyToolsCredentials

| Parameter                  | Description                                                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| newRelic                   | Array of credentials for the New Relic accounts to which data should be sent. Each array item consists of several items, see below. |
| newRelic[]<br>accountName  | Name of New Relic account. This is a "friendly name" that's used within Butler SOS to identify each NR account.                     |
| newRelic[]<br>insertApiKey | Insert API key associated with the NR account. Get this from the NR account's settings page.                                        |
| newRelic[]<br>accountId    | New Relic account id. Get this from the NR account's settings page.                                                                 |
|                            |                                                                                                                                     |

#### Butler-SOS.userEvents

Track individual users opening/closing apps and starting/stopping sessions.  
Requires log appender XML file(s) to be added to Sense server(s).

| Parameter                                         | Description                                                                                                                                                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| enable                                            | Should Butler SOS track detailed user events (i.e. session start/stop, connection open/close)? true/false                                                                                                    |
| excludeUser                                       | Array of users (=directory/userId pairs) that should be disregarded when user events arrive from Sense. Remove sample users before deploying Butler SOS.                                                     |
| udpServerConfig.<br>serverHost                    | IP/host where the user event UDP server should listen for incoming connections. Usually the same IP/host as where Butler SOS is running. Using 0.0.0.0 will cause Butler SOS to listen on all available IPs. |
| udpServerConfig.<br>portUserActivityEvents        | Port on which the user event UDP server will listen. Should match the port specified in the log appender.                                                                                                    |
| tags                                              | Array of tags (tagName/tagValue pairs) that should be added to each user event before sending it to InfluxDB. Remove sample tags before deploying Butler SOS.                                                |
| sendToMQTT.enable                                 | Should user events be sent to MQTT? true/false                                                                                                                                                               |
| sendToMQTT.postTo.<br>everythingTopic.enable      | Should **all** user event messages be sent to an MQTT topic? true/false                                                                                                                                      |
| sendToMQTT.postTo.<br>everythingTopic.topic       | MQTT topic to which **all** user event messages will be sent.                                                                                                                                                |
| sendToMQTT.postTo.<br>sessionStartTopic.enable    | Should **session start** user event messages be sent to an MQTT topic? true/false                                                                                                                            |
| sendToMQTT.postTo.<br>sessionStartTopic.topic     | MQTT topic to which **session start** user event messages will be sent.                                                                                                                                      |
| sendToMQTT.postTo.<br>sessionStopTopic.enable     | Should **session stop** user event messages be sent to an MQTT topic? true/false                                                                                                                             |
| sendToMQTT.postTo.<br>sessionStopTopic.topic      | MQTT topic to which **session stop** user event messages will be sent.                                                                                                                                       |
| sendToMQTT.postTo.<br>connectionOpenTopic.enable  | Should **connection open** user event messages be sent to an MQTT topic? true/false                                                                                                                          |
| sendToMQTT.postTo.<br>connectionOpenTopic.topic   | MQTT topic to which **connection open** user event messages will be sent.                                                                                                                                    |
| sendToMQTT.postTo.<br>connectionCloseTopic.enable | Should **connection close** user event messages be sent to an MQTT topic? true/false                                                                                                                         |
| sendToMQTT.postTo.<br>connectionCloseTopic.topic  | MQTT topic to which **connection close** user event messages will be sent.                                                                                                                                   |
| sendToInfluxdb.enable                             | Should user events be saved in InfluxDB? true/false                                                                                                                                                          |
| sendToNewRelic.enable                             | Should user events be saved in New Relic? true/false                                                                                                                                                         |
| sendToNewRelic.destinationAccount                 | Array of New Relic account names to which user events will be sent.                                                                                                                                          |
| sendToNewRelic.scramble                           | Should `user directory` and `user ID` fields be scrambled before user events are sent to New Relic? true/false                                                                                               |
|                                                   |                                                                                                                                                                                                              |

#### Butler-SOS.logEvents

Log events are used to capture Sense warnings, errors and fatals in real time.
Requires log appender XML file(s) to be added to Sense server(s).

Note that log events can be enabled/disabled per source (repository, proxy, scheduler etc).

| Parameter                                           | Description                                                                                                                                                                                                                                     |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| udpServerConfig.<br>serverHost                      | IP/host where the log event UDP server should listen for incoming connections. Usually the same IP/host as where Butler SOS is running. Using 0.0.0.0 will cause Butler SOS to listen on all available IPs.                                     |
| udpServerConfig.<br>portLogEvents                   | Port on which the log event UDP server will listen. Should match the port specified in the log appender.                                                                                                                                        |
| tags                                                | Array of tags (tagName/tagValue pairs) that should be added to each log event before sending it to InfluxDB. Remove sample tags before deploying Butler SOS.                                                                                    |
| source.<br>engine.enable                            | Should log events from the engine service be handled by Butler SOS? true/false                                                                                                                                                                  |
| source.<br>proxy.enable                             | Should log events from the proxy service be handled by Butler SOS? true/false                                                                                                                                                                   |
| source.<br>repository.enable                        | Should log events from the repository service be handled by Butler SOS? true/false                                                                                                                                                              |
| source.<br>scheduler.enable                         | Should log events from the scheduler service be handled by Butler SOS? true/false                                                                                                                                                               |
| categorise.enable                                   | Should categorization of log events be enabled? true/false                                                                                                                                                                                      |
| categorise.rules                                    | Array of rules that will be used to categorise log events. Each rule consists of a set of properties.                                                                                                                                           |
| categorise.rules[].<br>description                  | Description of the rule.                                                                                                                                                                                                                        |
| categorise.rules[].<br>logLevel[]                   | Array of log levels that will be used to match log events against this rule.                                                                                                                                                                    |
| categorise.rules[].<br>action                       | Action to take if a log event matches this rule. Possible values are "categorise" and "drop".                                                                                                                                                   |
| categorise.rules[].<br>category[]                   | Array of name-value pairs that will be added to the log event if it matches this rule.                                                                                                                                                          |
| categorise.rules[].<br>category[].name              | Name of the category.                                                                                                                                                                                                                           |
| categorise.rules[].<br>category[].value             | Value of the category.                                                                                                                                                                                                                          |
| categorise.rules[].<br>filter[]                     | Array of type-value pairs that will be used to match log events against this rule.                                                                                                                                                              |
| categorise.rules[].<br>filter[].type                | Type of filter. Possible values are "sw" = starts with, "ew" = ends with, "so" = substring of.                                                                                                                                                  |
| categorise.ruleDefault                              | Default values for categorization, if no other rule matches.                                                                                                                                                                                    |
| categorise.ruleDefault.<br>enable                   | Should the default rule be used? true/false                                                                                                                                                                                                     |
| categorise.ruleDefault.<br>category[]               | Array of name-value pairs that will be added to the log event if no other rule matches.                                                                                                                                                         |
| categorise.ruleDefault.<br>category[].name          | Name of the category.                                                                                                                                                                                                                           |
| categorise.ruleDefault.<br>category[].value         | Value of the category.                                                                                                                                                                                                                          |
| sendToMQTT.enable                                   | Should log events be sent to MQTT? true/false                                                                                                                                                                                                   |
| sendToMQTT.baseTopic                                | Root MQTT topic. All log events MQTT messages will be posted in this topic or subtopics of it.                                                                                                                                                  |
| sendToMQTT.postTo<br>.baseTopic                     | Should all log events be posted to the root topic? true/false                                                                                                                                                                                   |
| sendToMQTT.postTo<br>.subsystemTopics               | All log events originate from a specific subsystem in a Sense server. These subsystems are organized in a hierarchical tree that can be directly mapped to MQTT topics. Should log events be posted as MQTT messages to such topics? true/false |
| sendToInfluxdb.enable                               | Should log events be saved in InfluxDB? true/false                                                                                                                                                                                              |
| sendToNewRelic.enable                               | Should log events be sent to New Relic? true/false                                                                                                                                                                                              |
| sendToNewRelic.destinationAccount                   | Array of New Relic account names to which log events will be sent.                                                                                                                                                                              |
| sendToNewRelic.<br>source.engine.enable             | Should log events from the engine service be handled?                                                                                                                                                                                           |
| sendToNewRelic.<br>source.engine.logLevel.error     | Should ERROR log events from the engine service be handled?                                                                                                                                                                                     |
| sendToNewRelic.<br>source.engine.logLevel.warn      | Should WARN log events from the engine service be handled?                                                                                                                                                                                      |
| sendToNewRelic.<br>source.proxy.enable              | Should log events from the proxy service be handled?                                                                                                                                                                                            |
| sendToNewRelic.<br>source.proxy.logLevel.error      | Should ERROR log events from the proxy service be handled                                                                                                                                                                                       |
| sendToNewRelic.<br>source.proxy.logLevel.warn       | Should WARN log events from the proxy service be handled                                                                                                                                                                                        |
| sendToNewRelic.<br>source.repository.enable         | Should log events from the repository service be handled?                                                                                                                                                                                       |
| sendToNewRelic.<br>source.repository.logLevel.error | Should ERROR log events from the repository service be handled                                                                                                                                                                                  |
| sendToNewRelic.<br>source.repository.logLevel.warn  | Should WARN log events from the repository service be handled                                                                                                                                                                                   |
| sendToNewRelic.<br>source.scheduler.enable          | Should log events from the scheduler service be handled?                                                                                                                                                                                        |
| sendToNewRelic.<br>source.scheduler.logLevel.error  | Should ERROR log events from the scheduler service be handled                                                                                                                                                                                   |
| sendToNewRelic.<br>source.scheduler.logLevel.warn   | Should WARN log events from the scheduler service be handled                                                                                                                                                                                    |
|                                                     |                                                                                                                                                                                                                                                 |

#### Butler-SOS.cert

Certificates to use when connecting to Sense. Get these from the Certificate Export in QMC.

| Parameter            | Description                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| clientCert           | Certificate file. Exported from QMC                                            |
| clientCertKey        | Certificate key file. Exported from QMC                                        |
| clientCertCA         | Root certificate for above certificate files. Exported from QMC                |
| clientCertPassphrase | Password used to protect the certificate (as set when exporting cert from QMC) |
|                      |                                                                                |

#### Butler-SOS.mqttConfig

MQTT config parameters. These must be correctly defined for any other MQTT features in Butler SOS to work.

| Parameter  | Description                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| enable     | Should health metrics be sent to MQTT? true/false                                                       |
| brokerHost | IP or FQDN of MQTT broker                                                                               |
| brokerPort | Broker port                                                                                             |
| baseTopic  | Default topic used if not not otherwise specified elsewhere. Should end with /. For example butler-sos/ |
|            |                                                                                                         |

#### Butler-SOS.newRelic

If enabled, select Butler SOS metrics and events will be sent to New Relic.

Note that New Relic destination accounts for events are defined in the `Butler-SOS.userEvent` and `Butler-SOS.logEvent` sections, whereas destination accounts for metrics are defined in this section (`Butler-SOS.newRelic`).

| Parameter                                                | Description                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enable                                                   | Should Qlik Sense health metrics be sent to New Relic? true/false                                                                                                                                                                                                                                                    |
| event.url                                                | Which API URL should be used for sending events to New Relic?<br>At time of this writing the options are<br>https://insights-collector.eu01.nr-data.net<br>https://insights-collector.newrelic.com<br>More info here: https://docs.newrelic.com/docs/accounts/accounts-billing/account-setup/choose-your-data-center |
| event.header                                             | Array of name/value pairs that will be added as http headers to all calls to the New Relic event API                                                                                                                                                                                                                 |
| event.attribute.<br>static                               | Array of name/value pairs, representing attributes/tags that will be added to all events sent to New Relic                                                                                                                                                                                                           |
| event.attribute.<br>dynamic.butlerSosVersion.<br>enable  | Should Butler SOS' version be attached as an attribute to events sent to New Relic? true/false                                                                                                                                                                                                                       |
| metric.destinationAccount                                | Array of New Relic account names to which Sense health metrics will be sent.                                                                                                                                                                                                                                         |
| metric.url                                               | Which API URL should be used for sending Sense health metrics to New Relic?<br>At time of this writing the options are<br>https://insights-collector.eu01.nr-data.net/metric/v1<br>https://metric-api.newrelic.com/metric/v1                                                                                         |
| metric.header                                            | Array of name/value pairs that will be added as http headers to all calls to the New Relic metric API                                                                                                                                                                                                                |
| metric.dynamic.<br>engine.memory.<br>enable              | Send Sense memory metrics to New Relic? true/false                                                                                                                                                                                                                                                                   |
| metric.dynamic.<br>engine.cpu.<br>enable                 | Send Sense CPU metrics to New Relic? true/false                                                                                                                                                                                                                                                                      |
| metric.dynamic.<br>engine.calls.<br>enable               | Send metrics about calls to the Sense engine to New Relic? true/false                                                                                                                                                                                                                                                |
| metric.dynamic.<br>engine.selections.<br>enable          | Send metrics about number of selections made in Sense apps to New Relic? true/false                                                                                                                                                                                                                                  |
| metric.dynamic.<br>engine.sessions.<br>enable            | Send aggregated Sense engine session metrics to New Relic? true/false                                                                                                                                                                                                                                                |
| metric.dynamic.<br>engine.users.<br>enable               | Send aggregated Sense user metrics to New Relic? true/false                                                                                                                                                                                                                                                          |
| metric.dynamic.<br>engine.saturated.<br>enable           | Send Sense engine saturation status to New Relic? true/false                                                                                                                                                                                                                                                         |
| metric.dynamic.<br>apps.docCount.<br>enable              | Send metrics on loaded/active/in-memory Sense apps to New Relic? true/false                                                                                                                                                                                                                                          |
| metric.dynamic.<br>apps.activeDocs.<br>enable            | Should data on what docs are active in engine be sent to New Relic (true/false)?                                                                                                                                                                                                                                     |
| metric.dynamic.<br>apps.loadedDocs.<br>enable            | Should data on what docs are loaded (=having open sessions or connections) in engine be sent to New Relic (true/false)?                                                                                                                                                                                              |
| metric.dynamic.<br>apps.inMemoryDocs.<br>enable          | Should data on what docs are in engine memory be sent to New Relic (true/false)?                                                                                                                                                                                                                                     |
| metric.dynamic.<br>cache.cache.<br>enable                | Send Sense cache metrics to New Relic? true/false                                                                                                                                                                                                                                                                    |
| metric.dynamic.<br>proxy.sessions.<br>enable             | Send aggregated Sense proxy metrics to New Relic? true/false                                                                                                                                                                                                                                                         |
| metric.attribute.<br>static                              | Array of name/value pairs, representing attributes/tags that will be added to all Sense health metrics sent to New Relic                                                                                                                                                                                             |
| metric.attribute.<br>dynamic.butlerSosVersion.<br>enable | Should Butler SOS' version be attached as an attribute to Sense health metrics sent to New Relic? true/false                                                                                                                                                                                                         |
|                                                          |                                                                                                                                                                                                                                                                                                                      |

#### Butler-SOS.prometheus

If enabled, select Butler SOS metrics will be exposed on a Prometheus compatible URL from where they can be scraped by Prometheus.

| Parameter | Description                                                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| enable    | Should health metrics be made available for scraping on a Prometheus compatible API http endpoint? true/false                           |
| host      | IP on which the Prometheus compatible endpoint should be available. Using 0.0.0.0 will cause Butler SOS to listen on all available IPs. |
| port      | Port on which the Prometheus compatible endpoint will be made available. Default 9842.                                                  |
|           |                                                                                                                                         |

#### Butler-SOS.influxdbConfig

InfluxDB config parameters. These must be correctly defined for any other InfluxDB features in Butler SOS to work.

| Parameter                             | Description                                                                                                                                                                                                                                                                         |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enable                                | Should health metrics be stored in Influxdb? true/false                                                                                                                                                                                                                             |
| host                                  | IP or FQDN of Influxdb server.                                                                                                                                                                                                                                                      |
| port                                  | Port where Influxdb server is listening. Useful if Influxdb for some reason is not using its standard port of 8086. <br>NOTE: Must be set to a value (for example 8086), otherwise this config entry will be flagged as invalid when the config file format is verified on startup. |
| version                               | Influxdb version. Valid values are 1 and 2.                                                                                                                                                                                                                                         |
| v2Config.org                          | Organization name to use when connecting to Influxdb v2.                                                                                                                                                                                                                            |
| v2Config.bucket                       | Bucket name to use when connecting to Influxdb v2.                                                                                                                                                                                                                                  |
| v2Config.description                  | Description of the Inflluxdb bucket.                                                                                                                                                                                                                                                |
| v2Config.token                        | Token to use when connecting to Influxdb v2.                                                                                                                                                                                                                                        |
| v2Config.retentionDuration            | Retention duration for the Influxdb bucket.                                                                                                                                                                                                                                         |
| v1Config.<br>auth.enable              | Enable if data is to be stored in a password protected Influxdb v1 database.                                                                                                                                                                                                        |
| v1Config.<br>auth.username            | Influxdb username.                                                                                                                                                                                                                                                                  |
| v1Config.<br>auth.password            | Influxdb password.                                                                                                                                                                                                                                                                  |
| v1Config.dbName                       | Name of Influxdb v1 database to use.                                                                                                                                                                                                                                                |
| v1Config.<br>retentionPolicy.name     | Name of default retention policy that will be created in InfluxDB database when that database is created during first execution of Butler SOS.                                                                                                                                      |
| v1Config.<br>retentionPolicy.duration | Duration during which metrics are kept in InfluxDB. After the duration has passed, InfluxDB will purge all data older than duration from the database. See [InfluxDB docs](https://docs.influxdata.com/influxdb/v1.8/query_language/spec/#durations) for details on syntax.         |
| includeFields.<br>activeDocs          | Should a list of currently active Sense apps be stored in Influxdb? true/false                                                                                                                                                                                                      |
| includeFields.<br>loadedDocs          | Should a list of Sense apps opened in a user session be stored in Influxdb? true/false                                                                                                                                                                                              |
| includeFields.<br>activeDocs          | Should a list of Sense apps loaded into memory (some apps might not currently be associated with a user session) be stored in Influxdb? true/false                                                                                                                                  |
|                                       |                                                                                                                                                                                                                                                                                     |

#### Butler-SOS.appNames

| Parameter            | Description                                                               |
| -------------------- | ------------------------------------------------------------------------- |
| enableAppNameExtract | Should app names be extracted from Qlik Sense server? true/false          |
| extractInterval      | How often (milliseconds) should app names be extracted from Sense server? |
| hostIP               | IP or FQDN of Sense server from which app names should be extracted       |
|                      |                                                                           |

#### Butler-SOS.userSessions

Extract user session data per virtual proxy.

| Parameter            | Description                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| enableSessionExtract | Influxdb password                                                                                              |
| pollingInterval      | Influxdb password                                                                                              |
| excludeUser          | Array of users (=directory/userId pairs) that should be disregarded when user session data arrives from Sense. |
|                      |                                                                                                                |

#### Butler-SOS.serversToMonitor

| Parameter                                   | Description                                                                                                                                                                                                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pollingInterval                             | How often to query the Sense healthcheck API                                                                                                                                                                                                                     |
| rejectUnauthorized                          | Set to false to ignore warnings/errors caused by Qlik Sense's self-signed certificates. <br> Set to true if the Qlik Sense root CA is available on the computer where Butler SOS is running.                                                                     |
| serverTagsDefinition                        | List of tags to add to each server when storing the data in Influxdb. All tags defined here MUST be present in each server's definition section further down in the config file!                                                                                 |
| servers                                     | Array of servers to monitor. For each server a set of properties MUST be defined.                                                                                                                                                                                |
| servers.<br>host                            | FQDN of server. Domain should match that of the certificate exported from QMC - otherwise certificate warnings may appear. NOTE: You need to specify the port too - should be :4747 unless it's been changed from default value (_very_ unusual to change this). |
| servers.<br>serverName                      | Human friendly server name                                                                                                                                                                                                                                       |
| servers.<br>serverDescription               | Human friendly server description                                                                                                                                                                                                                                |
| servers.<br>userSessions.<br>enable         | Control whether user session data should be retrieved for this server                                                                                                                                                                                            |
| servers.<br>userSessions.<br>host           | Host and port from which to retrieve user session data. Usually on the form servername.mydomain.net:4243                                                                                                                                                         |
| servers.<br>userSessions.<br>virtualProxies | A list of key-value pairs. Use to specify for which virtual proxies on this server user session data should be retrieved.                                                                                                                                        |
| serverTags                                  | A list of key-value pairs. Use to provide more metadata for servers. Can then (among other things) be used to created more advanced Grafana dashboards.                                                                                                          |
| headers                                     | A list of key-value pairs. Headers specified here will be used when retrieving metrics from this Sense server.                                                                                                                                                   |
