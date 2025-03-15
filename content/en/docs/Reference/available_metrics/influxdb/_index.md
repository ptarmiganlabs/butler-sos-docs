---
title: "Available metrics: InfluxDB"
linkTitle: "InfluxDB"
weight: 10
description: >
  In order to create dashboards in for example Grafana, you must understand what metrics are available and how they are structured.
---

## InfluxDB

Metrics retrieved from the Sense servers can be stored in an [InfluxDB](https://www.influxdata.com/products/influxdb-overview/) database. You don't have to be an InfluxDB expert to use Butler SOS, but understanding some basic concepts are helpful.

Storing metrics in InfluxDB is not mandatory, but some kind of metrics storage - either in InfluxDB, [New Relic](https://newrelic.com) or [Prometheus](/docs/reference/available_metrics/prometheus/) - is needed to take full benefit of Butler SOS' features.

- InfluxDB is a [time series database](https://www.influxdata.com/time-series-database/). This means it is super good at storing values that have a timestamp associated with them - and pretty bad at everything else. In many respects time series databases are the opposite of traditional SQL databases (who are usually pretty bad at handling time series data).
- Because of it's focus on time series data, InfluxDB v1 has its own query language, [InfluxQL](https://docs.influxdata.com/influxdb/v1.7/query_language/). It is somewhat similar to SQL, but also has many unique commands and features.
  - Influx DB v2 has a new query language called [Flux](https://docs.influxdata.com/influxdb/v2.0/query-data/get-started/). There are compatibility layers in InfluxDB v2 that allow you to use InfluxQL, meaning that existing Grafana dashboards and can be kept as they are, even if you upgrade to InfluxDB v2.
  - Flux is a more powerful query language than InfluxQL, but it also has a steeper learning curve. By learning Flux you will be able to do more advanced things with your data, for example in Grafana dashboards.
- It's worth browsing through the [InfluxDB documentation](https://docs.influxdata.com/influxdb/) to get a feel for what InfluxDB is and how it works.
  - [InfluxDB v1 documentation](https://docs.influxdata.com/influxdb/v1/).
  - [InfluxDB v2 documentation](https://docs.influxdata.com/influxdb/v2/).

{{< notice tip >}}
The list of metrics below shows _all_ metrics that Butler SOS can store in InfluxDB.

If you have disabled some features of Butler SOS, the associated metrics will not be stored in InfluxDB.
{{< /notice >}}

### InfluxDB v1 vs v2

That are some differences between InfluxDB v1 and v2 when it comes to terminology and concepts.

For example in InfluxDB v1, the main concepts are _databases_, _measurements_, _field keys_ and _tag keys_.  
In InfluxDB v2 the main concepts are _buckets_, _measurements_, _fields_ and _tags_.

The concepts are very similar, but the names are different.

The metrics below are the same for both InfluxDB v1 and v2.

## Overview

_Measurements_ are just what it sounds like: snapshots of some value(s), taken at a specific point in time.
A measurement can contain several _field keys_, which for practical purposes can be viewed as the individual metrics.

For example, the list of measurements look like this (using the InfluxDB command line client to explore the database structure):

```
> use senseops
Using database senseops
> show measurements
name: measurements
name
----
apps
butlersos_memory_usage
cache
cpu
log_event
log_event_logdb
mem
saturated
sense_server
session
user_events
user_session_details
user_session_list
user_session_summary
users
>
```

Let's take a look at what field keys the `apps` measurement contains:

```
> show field keys from apps
name: apps
fieldKey                     fieldType
--------                     ---------
active_docs                  string
active_docs_count            integer
active_docs_names            string
active_session_docs_names    string
calls                        integer
in_memory_docs               string
in_memory_docs_count         integer
in_memory_docs_names         string
in_memory_session_docs_names string
loaded_docs                  string
loaded_docs_count            integer
loaded_docs_names            string
loaded_session_docs_names    string
selections                   integer
>
```

Ok, so the field keys are the actual metrics for which we gather data. Collectively those metrics (again: _field keys_ in InfluxDB lingo) above are grouped into a _measurement_ called `apps`.

There is one more concept you need to understand: _tag keys_

It's pretty simple: Tag keys are used to categorize (or simply "tag") measurements.  
Let's say you use Butler SOS to collect data from ten Sense servers. That's great, but how will you later distinguish between server 3 and server 8? You need some way of telling your Grafana dashboard to show the data for server 3 (if that's what you want).

Tags solve this. In the Butler SOS YAML config file you can define any number of tags that will be used to tag data coming in from Qlik Sense.

The beauty of tags is that they play very nicely with Grafana - without them the Grafana dashboards would not be nearly as flexible as they are.

To see what tag keys a certain measurement has you use a query similar to the one above/for fields:

```
> show tag keys from apps
name: apps
tagKey
------
host
serverBrand
serverLocation
server_description
server_group
server_name
server_type
```

Note that this list of tags consists of two parts:

1. Tags always present. These are inserted by Butler SOS and are present for all measurements. These are `host`, `server_description` and `server_name`.
2. Tags configured in Butler SOS' config file. In the example above these are `serverBrand`, `serverLocation`, `server_group` and`server_type`.

## Measurements and fields

The measurements are grouped based on what part of Sense they are retrieved from. The groups are

1. General health metrics.
2. Metrics about user sessions, for example how many sessions there are per virtual proxy.
3. Event counters: Counters for the different types of events received from Sense.
4. User events: Session and connection related messages from QSEoW logs.
5. Log events: Warning, error and fatal messages from QSEoW logs.
6. Performance log events. Events from the QIX engine. Used to monitor performance of individual charts and other app objects.
7. Messages from the log database (deprecated, will be removed during 2nd half of 2024).
8. Metric relating to Butler SOS itself (i.e. not retrieved from Sense).

## General health metrics

A shared set of tag keys are available for all general health metrics:

| Tag key            | Description                                                                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| host               | Host name, taken from config file's `Butler-SOS.serversToMonitor.servers[].host` property. Usually a fully qualified host name, or in some cases an IP address. |
| server_name        | Human readable/friendly server name, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverName` property.                                      |
| server_description | Description of the server, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverDescription` property.                                         |

In addition to the above, all tags defined in the YAML config file for the servers will be included as tag keys.

### Measurement: apps

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/November2021/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key                    | Type    | Description                                                                                                                                                                                                            |
| ---------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| active_docs                  | string  | An array of GUIDs of active apps. Empty if no apps are active. An app is active when a user is currently performing some action on it.                                                                                 |
| active_docs_count            | integer | Number of currently active apps                                                                                                                                                                                        |
| active_docs_names            | string  | Names of currently active (non-session) apps                                                                                                                                                                           |
| active_session_docs_names    | string  | Names of currently active session apps                                                                                                                                                                                 |
| in_memory_docs               | string  | An array of the GUIDs of all apps currently loaded into the memory, even if they do not have any open sessions or connections to it. The apps disappear from the list when the engine has purged them out from memory. |
| in_memory_docs_count         | integer | Number of apps currently in memory                                                                                                                                                                                     |
| in_memory_docs_names         | string  | Names of (non-session) apps currently in memory                                                                                                                                                                        |
| in_memory_session_docs_names | string  | Names of session apps currently in memory                                                                                                                                                                              |
| loaded_docs                  | string  | An array of the GUIDs of apps currently loaded into memory and that have open sessions or connections. Empty if no apps are loaded.                                                                                    |
| loaded_docs_count            | integer | Number of currently loaded apps                                                                                                                                                                                        |
| loaded_docs_names            | string  | Names of currently loaded (non-session) apps                                                                                                                                                                           |
| loaded_session_docs_names    | string  | Names of currently loaded session apps                                                                                                                                                                                 |
|                              |         |                                                                                                                                                                                                                        |
| calls                        | integer | Number of calls to the Qlik associative engine since it started                                                                                                                                                        |
| selections                   | integer | Number of selections made in Qlik associative engine since it started                                                                                                                                                  |

### Measurement: cache

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/June2020/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key   | Type    | Description                                |
| ----------- | ------- | ------------------------------------------ |
| added       | integer | Number of cache objects added to the cache |
| bytes_added | integer | Number of bytes added to the cache         |
| hits        | integer | Number of cache hits in engine             |
| lookups     | integer | Number of lookups in engine                |
| replaced    | integer | Number of cache objects replaced           |

### Measurement: cpu

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/June2020/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type    | Description                                                                          |
| --------- | ------- | ------------------------------------------------------------------------------------ |
| total     | integer | Percentage of the CPU used by the engine, averaged over a time period of 30 seconds. |

### Measurement: mem

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/June2020/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type    | Description                                                                                  |
| --------- | ------- | -------------------------------------------------------------------------------------------- |
| allocated | integer | The total amount of allocated memory (committed + reserved) from the operating system in MB. |
| committed | integer | The total amount of committed memory for the engine process in MB.                           |
| free      | integer | The total amount of free memory (minimum of free virtual and physical memory) in MB.         |

### Measurement: saturated

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/June2020/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type    | Description                                                                                                                       |
| --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| saturated | boolean | When the value is true, the engine is running with high resource usage; otherwise the value is false. See link above for details. |

### Measurement: sense_server

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/June2020/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type   | Description                                             |
| --------- | ------ | ------------------------------------------------------- |
| started   | string | ISO timestamp when the engine service was started.      |
| uptime    | string | Time since engine service was started (human readable). |
| version   | string | Engine version.                                         |

### Measurement: session

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/June2020/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type    | Description                                                                                                                                                          |
| --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| active    | integer | Number of active engine sessions. A session is active when a user is currently performing some action on an app, for example, making selections or creating content. |
| total     | integer | Total number of engine sessions.                                                                                                                                     |

### Measurement: users

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/June2020/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type    | Description                                                    |
| --------- | ------- | -------------------------------------------------------------- |
| active    | integer | Number of users currently doing something in some app.         |
| total     | integer | Number of users with established sessions to the Sense server. |

## User session details

User session metrics have slightly different tag keys depending on the granularity level of the metric - those metrics are therefore listed under each heading below.

### Measurement: user_session_summary

Source: [Session module API](https://help.qlik.com/en-US/sense-developer/June2020/Subsystems/ProxyServiceAPI/Content/Sense_ProxyServiceAPI/ProxyServiceAPI-Session-Module-API.htm)

| Field key            | Type   | Description                                                                                                                                                 |
| -------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| session_count        | float  | Total number of sessions, per server and virtual proxy.                                                                                                     |
| session_user_id_list | string | List of user IDs with sessions, per server and virtual proxy. NOTE: A single user may have more than one session open to a particular server/virtual proxy. |

Tag keys:

| Tag key                    | Description                                                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| host                       | Host name, taken from config file's `Butler-SOS.serversToMonitor.servers[].host` property. Usually a fully qualified host name, or in some cases an IP address. |
| server_name                | Human readable/friendly server name, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverName` property.                                      |
| server_description         | Description of the server, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverDescription` property.                                         |
| user_session_host          | Host name the session metrics are associated with.                                                                                                              |
| user_session_virtual_proxy | Virtual proxy name the session metrics are associated with.                                                                                                     |

### Measurement: user_session_list

Source: [Session module API](https://help.qlik.com/en-US/sense-developer/June2020/Subsystems/ProxyServiceAPI/Content/Sense_ProxyServiceAPI/ProxyServiceAPI-Session-Module-API.htm)

| Field key            | Type   | Description                                                                                                                                                 |
| -------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| session_user_id_list | string | List of user IDs with sessions, per server and virtual proxy. NOTE: A single user may have more than one session open to a particular server/virtual proxy. |

Tag keys:

| Tag key                    | Description                                                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| host                       | Host name, taken from config file's `Butler-SOS.serversToMonitor.servers[].host` property. Usually a fully qualified host name, or in some cases an IP address. |
| server_name                | Human readable/friendly server name, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverName` property.                                      |
| server_description         | Description of the server, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverDescription` property.                                         |
| user_session_host          | Host name the session metrics are associated with.                                                                                                              |
| user_session_virtual_proxy | Virtual proxy name the session metrics are associated with.                                                                                                     |

### Measurement: user_session_details

Source: [Session module API](https://help.qlik.com/en-US/sense-developer/June2020/Subsystems/ProxyServiceAPI/Content/Sense_ProxyServiceAPI/ProxyServiceAPI-Session-Module-API.htm)

| Field key      | Type   | Description                                                                 |
| -------------- | ------ | --------------------------------------------------------------------------- |
| session_id     | string | Session GUID, uniquely identifying the session in the entire Sense cluster. |
| user_directory | string | Session user's user directory.                                              |
| user_id        | string | Session user ID                                                             |

Tag keys:

| Tag key                     | Description                                                                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| host                        | Host name, taken from config file's `Butler-SOS.serversToMonitor.servers[].host` property. Usually a fully qualified host name, or in some cases an IP address. |
| server_name                 | Human readable/friendly server name, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverName` property.                                      |
| server_description          | Description of the server, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverDescription` property.                                         |
| user_session_host           | Host name the session metrics are associated with.                                                                                                              |
| user_session_virtual_proxy  | Virtual proxy name the session metrics are associated with.                                                                                                     |
| user_session_id             | Session GUID                                                                                                                                                    |
| user_session_user_directory | User's user directory                                                                                                                                           |
| user_session_user_id        | User ID                                                                                                                                                         |

## Event counters

Event counters are used to count the number of events received from Sense.

The measurement name is configured in the Butler SOS YAML config file, `Butler-SOS.qlikSenseEvents.eventCount.influxdb.measurementName`.

| Tag key    | Description                                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| event_type | Type of event. `log` or `user`.                                                                                                  |
| host       | Host name of the Sense server generating the event.                                                                              |
| source     | Source system within Sense that caused the event. Examples: `qseow-scheduler`, `qseow-proxy`, `qseow-engine`, `qseow-repository` |
| subsystem  | Subsystem where the event originated. More granular than `source`. Example: `System.Scheduler.Scheduler.Master.Task.TaskSession` |

Static tags defined in the config file, `Butler-SOS.qlikSenseEvents.eventCount.influxdb.tags`, are also added to the InfluxDB datapoints.

| Field key | Description                |
| --------- | -------------------------- |
| counter   | Number of events received. |

### Unrecognized events

Unrecognized events are events that Butler SOS receives from Sense, but that do not have a valid source (`qseow-scheduler`, `qseow-proxy`, `qseow-engine`, `qseow-repository` etc).

These events will get a `event_type` of `user` or `log` based on what UDP port they arrived on.  
The `source`, `host` and `subsystem` tags will be set to `Unknown`.

## User events

User events capture real-time events in Qlik Sense as they happen.  
They originate from Sense's log4net logging framework and are forwarded from Sense to Butler SOS by means of XML log appenders in Sense.  
These events are also forwarded as MQTT messages, allowing other systems to act when warnings/errors/fatals occur in Qlik Sense.

Setup instructions [here](/docs/getting_started/setup/user-events/).

The following user events are handled by Butler SOS:

- Session start
- Session stop
- Connection open
- Connection close.

### Measurement: user_events

Tag keys present for all `user_events` records:

| Tag key       | Description                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| event_action  | Indicates what the event is about. Examples: `Start session`, `Stop session`, `Open connection`, `Close connection`.                                    |
| host          | Host name as reported in Qlik Sense's proxy log files.                                                                                                  |
| origin        | Textual description of what caused the event. Can for example be `AppAccess`, which means a user opened or closed a browser tab with a Sense app in it. |
| userDirectory | Sense user directory of the user causing the event.                                                                                                     |
| userId        | Sense user ID for the user causing the event.                                                                                                           |
| userFull      | The combination of `userDirectory` and `userId`.                                                                                                        |

If the user event includes browser user agent information, the following tags will be present:

| Tag key               | Description                                 |
| --------------------- | ------------------------------------------- |
| uaBrowserName         | Name of connecting user's browser.          |
| uaBrowserMajorVersion | Connecting user's browser version.          |
| uaOsName              | Connecting user's operating system.         |
| uaOsVersion           | Connecting user's operating system version. |

In addition to the above tags defined in the Butler SOS config file will be added.  
More info [here](/docs/getting_started/setup/user-events/#settings-in-main-config-file).

Fields:

| Field key | Description                        |
| --------- | ---------------------------------- |
| appId     | Id of app that is opened/closed.   |
| appName   | Name of app that is opened/closed. |
| userFull  | Same as the userFull tag.          |
| userId    | Same as the userId tag.            |

## Log events

Log events are used to capture warning, error and fatal messages in Sense. Once in Butler SOS these events are stored in InfluxDB (enabling Grafana dashboards).  
These events are also forwarded as MQTT messages, allowing other systems to act when warnings/errors/fatals occur in Qlik Sense.

Setup instructions [here](/docs/getting_started/setup/log-events/).

{{< notice info >}}
There is only one measurement for log events. It's simply called `log_event`.

Different QSEoW services (Qlik Sense Enterprise on Windows) will send different tags and metrics in the log events.  
Each variant is described below.

This modular approach to log events makes it possible to extend Butler SOS' with additional log events if/when needed..
{{< /notice >}}

_Note 1: Static tags are added as for all log events, as defined in the config file, `Butler-SOS.logEvents.tags`._

_Note 2: If log event categorization is enabled in the YAML config file, the categories defined there will be added as tags to the log event data points written to InfluxDB._

### Source: Proxy service

Events such as failed login attempts will be sent from the proxy service.

Proxy log events have these tags:

| Tag key        | Description                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| host           | Host name as reported in Qlik Sense's log files.                                                                                           |
| level          | Sense log level. Possible values are `WARN`, `ERROR`, `FATAL`.                                                                             |
| log_row        | Row number in Sense log file where the event can be found. Useful if you after all have to dig into the log files.                         |
| result_code    | Result code as reported by the Sense source system that caused the event. Its meaning will differ depending on where the event originated. |
| source         | Source system within Sense that caused the event. Examples: `qseow-scheduler`, `qseow-proxy`, `qseow-repository`                           |
| subsystem      | Subsystem where the event originated. More granular than `source`. Example: `System.Scheduler.Scheduler.Master.Task.TaskSession`           |
| user_directory | Sense user directory of the user causing the event. Example: `MYCOMPANY`                                                                   |
| user_id        | Sense user ID for the user causing the event. Example: `joe`                                                                               |
| user_full      | The combination of `user_directory` and `user_id`. Example: `MYCOMPANY\joe`                                                                |

Fields in proxy log events:

| Field key         | Description                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command           | Description of what caused the event, as found in the Sense logs. Example: `Login:TryLogin`                                                                                                       |
| context           | In what context (if one exists) the event occurred. If no context is available `Not available` will be used.                                                                                      |
| exception_message | If a serious problem/exception occurs the associated message is available here.                                                                                                                   |
| message           | Description of what the event is about. Example: `Login failed for user 'LAB\\goran' wrong credentials?`                                                                                          |
| origin            | Example: `qseow-repository.`                                                                                                                                                                      |
| raw_event         | The raw event message as received from QSEoW. Described [here](https://github.com/ptarmiganlabs/butler-sos/blob/bd9135d953d4fc2d025dc8326956b2504b3d06d4/src/lib/udp_handlers_log_events.js#L26). |
| result_code       | Example: `500`                                                                                                                                                                                    |

The `raw_event` is the actual log event message sent from QSEoW to Butler SOS.  
It has the following components:

| Part of message   | Description                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command           | Description of what caused the event, as found in the Sense logs. Example: `Login:TryLogin`                                                               |
| context           | In what context (if one exists) the event occurred. If no context is available `Not available` will be used.                                              |
| exception_message | If a serious problem/exception occurs the associated message is available here.                                                                           |
| host              | Host name as reported in Qlik Sense's log files.                                                                                                          |
| level             | Sense log level. Possible values are `WARN`, `ERROR`, `FATAL`.                                                                                            |
| log_row           | Row number in Sense log file where the event can be found. Useful if you after all have to dig into the log files.                                        |
| message           | Description of what the event is about. Example: `Login failed for user 'LAB\\goran' wrong credentials?`                                                  |
| origin            | Party of the proxy service the event originated from. Rarely used by Sense.                                                                               |
| result_code       | Result code as reported by the Sense source system that caused the event. Its meaning will differ depending on where the event originated. Example: `500` |
| source            | Source system within Sense that caused the event. Examples: `qseow-scheduler`, `qseow-proxy`, `qseow-repository`                                          |
| subsystem         | Subsystem where the event originated. More granular than `source`. Example: `System.Scheduler.Scheduler.Master.Task.TaskSession`                          |
| tags              | User defined tags. Set in the main YAML config file. Example: `{"env":"DEV","foo":"bar"}`                                                                 |
| ts_iso            | Timestamp (ISO format) when the event occurred, according to QSEoW. Example: `20211126T214006.122+0100`                                                   |
| ts_local          | Event timestamp (time format of Sense server). Example: `2021-11-26 21:40:06,122`                                                                         |
| user_directory    | Sense user directory of the user causing the event. Example: `MYCOMPANY`                                                                                  |
| user_full         | The combination of `user_directory` and `user_id`. Example: `MYCOMPANY\joe`                                                                               |
| user_id           | Sense user ID for the user causing the event. Example: `joe`                                                                                              |
| windows_user      | Windows account used to run the proxy QSEoW Windows service. Example: `LAB\\qlikservice`                                                                  |

### Source: Scheduler service

Events such as failed reload tasks will be sent from the scheduler service.

Scheduler log events have these tags:

| Tag key        | Description                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| host           | Host name as reported in Qlik Sense's log files.                                                                                 |
| level          | Sense log level. Possible values are `WARN`, `ERROR`, `FATAL`.                                                                   |
| log_row        | Row number in Sense log file where the event can be found. Useful if you after all have to dig into the log files.               |
| source         | Source system within Sense that caused the event. Examples: `qseow-scheduler`, `qseow-proxy`, `qseow-repository`                 |
| subsystem      | Subsystem where the event originated. More granular than `source`. Example: `System.Scheduler.Scheduler.Master.Task.TaskSession` |
| user_directory | Sense user directory of the user causing the event. Example: `MYCOMPANY`                                                         |
| user_id        | Sense user ID for the user causing the event. Example: `joe`                                                                     |
| user_full      | The combination of `user_directory` and `user_id`. Example: `MYCOMPANY\joe`                                                      |
| task_id        | Task ID (if a task is involved in the event, for example task failing). Example: `58dd8322-e39c-4b71-b74e-13c47a2f6dd4`          |
| task_name      | Task name (if a task is involved in the event). Example: `Reload task of Meetup.com`                                             |

Fields in scheduler log events:

| Field key         | Description                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app_id            | Application ID (if an app is involved in the event). Example: `deba4bcf-47e4-472e-97b2-4fe8d6498e11`                                                                                              |
| app_name          | Application name (if an app is involved in the event). Example: `Meetup.com`                                                                                                                      |
| exception_message | If a serious problem/exception occurs the associated message is available here.                                                                                                                   |
| execution_id      | ID identifying a particular task execution. Example: `67a56c3b-2e20-4df8-ad1b-e48de28e1bfa`                                                                                                       |
| message           | Description of what the event is about. Example: `Login failed for user 'LAB\\goran' wrong credentials?`                                                                                          |
| raw_event         | The raw event message as received from QSEoW. Described [here](https://github.com/ptarmiganlabs/butler-sos/blob/bd9135d953d4fc2d025dc8326956b2504b3d06d4/src/lib/udp_handlers_log_events.js#L61). |

The `raw_event` is the actual log event message sent from QSEoW to Butler SOS.  
It has the following components:

| Part of message   | Description                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| app_id            | Application ID (if an app is involved in the event). Example: `deba4bcf-47e4-472e-97b2-4fe8d6498e11`                            |
| app_name          | Application name (if an app is involved in the event). Example: `Meetup.com`                                                    |
| exception_message | If a serious problem/exception occurs the associated message is available here.                                                 |
| execution_id      | ID identifying a particular task execution. Example: `67a56c3b-2e20-4df8-ad1b-e48de28e1bfa`                                     |
| host              | Host name as reported in Qlik Sense's log files.                                                                                |
| level             | Sense log level. Possible values are `WARN`, `ERROR`, `FATAL`.                                                                  |
| log_row           | Row number in Sense log file where the event can be found. Useful if you after all have to dig into the log files.              |
| message           | Description of what the event is about. Example: `Login failed for user 'LAB\\goran' wrong credentials?`                        |
| source            | Source system within Sense that caused the event. Example: `qseow-scheduler`                                                    |
| subsystem         | Subsystem where the event originated. More granular than `source`. Example: `System.Scheduler.Scheduler.Slave.Tasks.ReloadTask` |
| tags              | User defined tags. Set in the main YAML config file. Example: `{"env":"DEV","foo":"bar"}`                                       |
| task_id           | Task ID (if a task is involved in the event, for example task failing). Example: `58dd8322-e39c-4b71-b74e-13c47a2f6dd4`         |
| task_name         | Task name (if a task is involved in the event). Example: `Reload task of Meetup.com`                                            |
| ts_iso            | Timestamp (ISO format) when the event occurred, according to QSEoW. Example: `20211126T214006.122+0100`                         |
| ts_local          | Event timestamp (time format of Sense server). Example: `2021-11-26 21:40:06,122`                                               |
| user_directory    | Sense user directory of the user causing the event. Example: `MYCOMPANY`                                                        |
| user_full         | The combination of `user_directory` and `user_id`. Example: `MYCOMPANY\joe`                                                     |
| user_id           | Sense user ID for the user causing the event. Example: `joe`                                                                    |
| windows_user      | Windows account used to run the proxy QSEoW Windows service. Example: `LAB\\qlikservice`                                        |

### Source: Repository service

The repository service is the hub around which the rest of Qlik Sense revolves.  
As such it emit events in many different situations. One example can be when a Sense node is offline (this example is used in the field description below).

Repository log events have these tags:

| Tag key        | Description                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| host           | Host name as reported in Qlik Sense's log files.                                                                                           |
| level          | Sense log level. Possible values are `WARN`, `ERROR`, `FATAL`.                                                                             |
| log_row        | Row number in Sense log file where the event can be found. Useful if you after all have to dig into the log files.                         |
| source         | Source system within Sense that caused the event. Examples: `qseow-scheduler`, `qseow-proxy`, `qseow-repository`                           |
| subsystem      | Subsystem where the event originated. More granular than `source`. Example: `System.Scheduler.Scheduler.Master.Task.TaskSession`           |
| result_code    | Result code as reported by the Sense source system that caused the event. Its meaning will differ depending on where the event originated. |
| user_directory | Sense user directory of the user causing the event. Example: `MYCOMPANY`                                                                   |
| user_id        | Sense user ID for the user causing the event. Example: `joe`                                                                               |
| user_full      | The combination of `user_directory` and `user_id`. Example: `MYCOMPANY\joe`                                                                |

Fields in scheduler log events:

| Field key         | Description                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command           | Description of what caused the event, as found in the Sense logs. Example: `Login:TryLogin`                                                                                                       |
| context           | In what context (if one exists) the event occurred. If no context is available `Not available` will be used.                                                                                      |
| exception_message | If a serious problem/exception occurs the associated message is available here.                                                                                                                   |
| message           | Description of what the event is about. Example: `Login failed for user 'LAB\\goran' wrong credentials?`                                                                                          |
| origin            | Example: `qseow-repository.`                                                                                                                                                                      |
| raw_event         | The raw event message as received from QSEoW. Described [here](https://github.com/ptarmiganlabs/butler-sos/blob/bd9135d953d4fc2d025dc8326956b2504b3d06d4/src/lib/udp_handlers_log_events.js#L43). |
| result_code       | Example: `500`                                                                                                                                                                                    |

The `raw_event` is the actual log event message sent from QSEoW to Butler SOS.  
It has the following components:

| Part of message   | Description                                                                                                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| command           | Description of what caused the event, as found in the Sense logs. Example: `Check service status`                                                                                                                                                                                          |
| context           | In what context (if one exists) the event occurred. If no context is available `Not available` will be used. Example: `/qps/servicestatusworker`                                                                                                                                           |
| exception_message | If a serious problem/exception occurs the associated message is available here.                                                                                                                                                                                                            |
| host              | Host name of event source, as reported in Qlik Sense's log files. Example: `pro2-win1`                                                                                                                                                                                                     |
| level             | Sense log level. Possible values are `WARN`, `ERROR`, `FATAL`.                                                                                                                                                                                                                             |
| log_row           | Row number in Sense log file where the event can be found. Useful if you after all have to dig into the log files. Example: `7296`                                                                                                                                                         |
| message           | Description of what the event is about. Example: `Method: 'SendRimQrsStatusRequest'. Failed to retrieve service status from 'http://pro2-win3.lab.ptarmiganlabs.net:4444/status/'. Server host 'pro2-win3.lab.ptarmiganlabs.net'. Error message: 'Unable to connect to the remote server'` |
| origin            | Part of the proxy service the event originated from. Rarely used by Sense.                                                                                                                                                                                                                 |
| result_code       | Result code as reported by the Sense source system that caused the event. Its meaning will differ depending on where the event originated. Example: `500`                                                                                                                                  |
| source            | Source system within Sense that caused the event. Example: `qseow-repository`                                                                                                                                                                                                              |
| subsystem         | Subsystem where the event originated. More granular than `source`. Example: `Service.Repository.Repository.Core.Status.ServiceStatusWorker`                                                                                                                                                |
| tags              | User defined tags. Set in the main YAML config file. Example: `{"env":"DEV","foo":"bar"}`                                                                                                                                                                                                  |
| ts_iso            | Timestamp (ISO format) when the event occurred, according to QSEoW. Example: `20211128T201538.508+0100`                                                                                                                                                                                    |
| ts_local          | Event timestamp (time format of Sense server). Example: `2021-11-28 20:15:38,508`                                                                                                                                                                                                          |
| user_directory    | Sense user directory of the user causing the event. Example: `MYCOMPANY`                                                                                                                                                                                                                   |
| user_full         | The combination of `user_directory` and `user_id`. Example: `MYCOMPANY\joe`                                                                                                                                                                                                                |
| user_id           | Sense user ID for the user causing the event. Example: `joe`                                                                                                                                                                                                                               |
| windows_user      | Windows account used to run the proxy QSEoW Windows service. Example: `LAB\\qlikservice`                                                                                                                                                                                                   |

### Source: Engine service (errors and warnings)

The associative engine (the "QIX" engine) is the core of Qlik Sense. This is where the magic happens, all the calculations and selections in apps are ultimately done here.

Engine log events have these tags:

| Tag key            | Description                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| host               | Host name as reported in Qlik Sense's log files.                                                                                           |
| level              | Sense log level. Possible values are `WARN`, `ERROR`, `FATAL`.                                                                             |
| log_row            | Row number in Sense log file where the event can be found. Useful if you after all have to dig into the log files.                         |
| result_code        | Result code as reported by the Sense source system that caused the event. Its meaning will differ depending on where the event originated. |
| source             | Source system within Sense that caused the event. Examples: `qseow-scheduler`, `qseow-proxy`, `qseow-repository`                           |
| subsystem          | Subsystem where the event originated. More granular than `source`. Example: `System.Scheduler.Scheduler.Master.Task.TaskSession`           |
| user_directory     | Sense user directory of the user causing the event. Example: `MYCOMPANY`                                                                   |
| user_id            | Sense user ID for the user causing the event. Example: `joe`                                                                               |
| user_full          | The combination of `user_directory` and `user_id`. Example: `MYCOMPANY\joe`                                                                |
| windows_user       | Windows account used to run the engine QSEoW Windows service. Example: `LAB\\qlikservice`                                                  |
| task_id            | Task ID (if a task is involved in the event, for example task failing). Example: `58dd8322-e39c-4b71-b74e-13c47a2f6dd4`                    |
| task_name          | Task name (if a task is involved in the event). Example: `Reload task of Meetup.com`                                                       |
| app_id             | Application ID (if an app is involved in the event). Example: `deba4bcf-47e4-472e-97b2-4fe8d6498e11`                                       |
| app_name           | Application name (if an app is involved in the event). Example: `Meetup.com`                                                               |
| engine_exe_version | Version of the QIX engine executable.                                                                                                      |

Fields in engine log events:

| Field key         | Description                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command           | Description of what caused the event, as found in the Sense logs. Example: `Login:TryLogin`                                                               |
| context           | In what context (if one exists) the event occurred. If no context is available `Not available` will be used.                                              |
| exception_message | If a serious problem/exception occurs the associated message is available here.                                                                           |
| message           | String. Description of what the event is about. Example: `Login failed for user 'LAB\\goran' wrong credentials?`                                          |
| origin            | Part of the engine service the event originated from. Rarely used by Sense.                                                                               |
| raw_event         | The raw event message as received from QSEoW.                                                                                                             |
| session_id        | Engine session ID.                                                                                                                                        |
| result_code       | Result code as reported by the Sense source system that caused the event. Its meaning will differ depending on where the event originated. Example: `500` |

### Source: Engine service (performance related events)

Performance log events are used to capture _performance_ related events from the associative/QIX engine.

Due to the potentially large number of performance log events, these can be filtered by Butler SOS.  
Accepted and rejected performance log events are stored in InfluxDB in slightly different ways.

#### Accepted performance log events

| Tag key            | Description                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `host`             | The hostname of the Sense server that generated the event.                                                                      |
| `level`            | The log level of the event. Always `INFO` for performance log events.                                                           |
| `source`           | The source of the event. Always `qseow-qix-perf` for performance log events.                                                    |
| `log_row`          | The log row number as created by Sense's logging framework.                                                                     |
| `subsystem`        | The subsystem that generated the event. Always `QixPerformance.Engine.Engine` for performance log events.                       |
| `method`           | The engine method that generated the performance data. `Global::GetProgress`, `GenericObject::GetLayout`, `Global::OpenApp` etc |
| `object_type`      | The type of object that the performance data is about. `table`, `barchart`, `sheet`, `CurrentSelection` etc.                    |
| `proxy_session_id` | The ID of the proxy session that generated the event. Will be a GUID for user sessions, 0 for internal work done by Sense.      |
| `session_id`       | The ID of the engine session that generated the event.                                                                          |

| `user_full` | The full name of the user that generated the event. <User directory>\<user id> |
| `user_directory` | The user directory of the user that generated the event. |
| `user_id` | The user ID of the user that generated the event. |
| `app_id` | The GUID of the app that the performance data is from. |
| `app_name` | The name of the app that the performance data is from, if available. Blank if not. |
| `object_id` | The ID of the app object that the performance data is about. |

| Field key       | Description                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `app_id`        | String. The GUID of the app that the performance data is from.                                                                        |
| `process_time`  | Float. The amount of time that was needed to process the request. Milliseconds.                                                       |
| `work_time`     | Float. The amount of time that the request did actual work. Milliseconds.                                                             |
| `lock_time`     | Float. The amount of time that the request had to wait for an internal lock. Milliseconds.                                            |
| `validate_time` | Float. The amount of time that the request used for validation. Milliseconds.                                                         |
| `traverse_time` | Float. The amount of time the request uses for the traverse part of the calculation. Milliseconds.                                    |
| `handle`        | String. The ID of the interface that handled the request. The interface can be Global, a certain sheet, a certain object, or similar. |
| `net_ram`       | Integer. The amount of memory used for the calculation. Bytes.                                                                        |
| `peak_ram`      | Integer. The peak amount of memory used for the calculation. Bytes.                                                                   |
| `raw_event`     | JSON. The raw event data in JSON format. Useful together with the log chart type in Grafana.                                          |

Descriptions of each metric/field can be found in the [Qlik Sense logging documentation](https://help.qlik.com/en-US/sense-admin/May2024/Subsystems/DeployAdministerQSE/Content/Sense_DeployAdminister/QSEoW/Deploy_QSEoW/Server-Logging-Tracing-Log-File-Format-Additional-Fields-QixPerformance-Log.htm).

#### Rejected performance log events

For rejected performance log events, the individual events are not stored in InfluxDB.  
Instead, counters are used to keep track of how many events were rejected, broken down by a set of tags.

| Tag name      | Description                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `source`      | Name of the event. Always `qseow-qix-perf` for rejected performance log events.                                                 |
| `app_id`      | The GUID of the app that the performance data is from.                                                                          |
| `app_name`    | The name of the app that the performance data is from, if available. Blank if not.                                              |
| `method`      | The engine method that generated the performance data. `Global::GetProgress`, `GenericObject::GetLayout`, `Global::OpenApp` etc |
| `object_type` | The type of object that the performance data is about. `table`, `barchart`, `sheet`, `CurrentSelection` etc.                    |

A separate set of tags are added to the rejected performance log events.  
These tags are defined in the config file, `Butler-SOS.logEvents.enginePerformanceMonitor.trackRejectedEvents.tags`.

| Field key    | Description                                                                     |
| ------------ | ------------------------------------------------------------------------------- |
| counter      | Integer. The number of rejected performance log events.                         |
| process_time | Float. The amount of time that was needed to process the request. Milliseconds. |

## Messages from the log database

All log data written to InfluxDB share a common set of tag keys:

| Tag key            | Description                                                                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| host               | Host name, taken from config file's `Butler-SOS.serversToMonitor.servers[].host` property. Usually a fully qualified host name, or in some cases an IP address. |
| server_name        | Human readable/friendly server name, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverName` property.                                      |
| server_description | Description of the server, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverDescription` property.                                         |
| log_level          | The logging level of the log event (ERROR, WARNING, INFO etc).                                                                                                  |
| source_process     | Which Sense service the log event originated in.                                                                                                                |

### Measurement: log_event_logdb

Source: More or less [log db](https://help.qlik.com/en-US/sense-admin/November2021/Subsystems/DeployAdministerQSE/Content/Sense_DeployAdminister/QSEoW/Deploy_QSEoW/Qlik-Logging-Service.htm). A query is done to the log db in Postgres, the results are stored in InfluxDB. There is thus no Qlik API call per se.

| Field key | Type   | Description                                                    |
| --------- | ------ | -------------------------------------------------------------- |
| message   | string | Log entry as retrieved from the Sense log database (Postgres). |

## Butler SOS metrics

### Measurement: butlersos_memory_usage

These metrics tell you how much memory Butler SOS itself uses.  
More info on these metrics and what they mean is available [here](https://www.valentinog.com/blog/node-usage/).

| Field key      | Type  | Description                                             |
| -------------- | ----- | ------------------------------------------------------- |
| heap_total     | float | Total size of the allocated heap.                       |
| heap_used      | float | Actual memory used during the execution of Butler SOS.  |
| process_memory | float | Total memory allocated for the execution of Butler SOS. |
