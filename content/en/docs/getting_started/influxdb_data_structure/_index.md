---
title: "Available Metrics"
linkTitle: "Available metrics"
weight: 4
description: >
  In order to create graphs in for example Grafana, you must understand what metrics are available and how they are structured.
---


## InfluxDB

All metrics retrieved from the Sense servers are stored in an [InfluxDB](https://www.influxdata.com/products/influxdb-overview/) database. You don't have to be an InfluxDB expert to use Butler SOS, but understanding some basic concepts are helpful.

* InfluxDB is a [time series database](https://www.influxdata.com/time-series-database/). This means it is super good at storing values that have a timestamp associated with them - and pretty bad at everything else. In many respects time series databases are the opposite of traditional SQL databases (who are usually pretty bad at handling time series data).

* Because of it's focus on time series data, InfluxDB has its own query language, [InfluxQL](https://docs.influxdata.com/influxdb/v1.7/query_language/). It is somewhat similar to SQL, but also has many unique commands and features.

* Browsing through the [key concepts of InfluxDB](https://docs.influxdata.com/influxdb/v1.7/concepts/key_concepts/) is a good idea. There you will learn about things such as measurements, series and tags - which are all key to using data stored in InfluxDB.

## Metrics structure

The metrics are grouped based on what kind of Qlik Sense data they represent. InfluxDB is a *very* capable database, so we will only touch on the basics here.

### Overview

*Measurements* are just what it sounds like: snapshots of some value(s), taken at a specific point in time.
A measurement can contain several *field  keys*, which for practical purposes can be viewed as the individual metrics.

For example, the list of measurements look like this (using the InfluxDB command line client to explore the database structure):

```
> use SenseOps
Using database SenseOps
> show measurements
name: measurements
name
----
apps
cache
cpu
log_event
mem
saturated
sense_server
session
user_session_details
user_session_list
user_session_summary
users

>
```

Let's take a look at what field keys the apps measurement contains:

```
> show field keys from apps
name: apps
fieldKey		fieldType
--------		---------
active_docs		string
active_docs_count	integer
calls			integer
in_memory_docs		string
in_memory_docs_count	integer
loaded_docs		string
loaded_docs_count	integer
selections		integer

>
```

Ok, so the field keys are the actual metrics for which we gather data. Collectively those metrics (again: *field keys* in InfluxDB lingo) above are grouped into a *measurement* called 'apps'.

There is one more concept you need to understand: *tag keys*

It's pretty simple: Tag keys are used to categorise (or simply 'tag') measurements.  
Let's say you use Butler SOS to collect data from ten Sense servers. That's great, but how will you later distinguish between server 3 and server 8? You need some way of telling your Grafana dashboard to show the data for server 3 (if that's what you want).

Tags solve this. In the Butler SOS YAML config file you can define any number of tags that will be used to tag data coming in from Qlik Sense.  

The beauty of tags is that they play very nicely with Grafana - without them the Grafana dashboards would not be nearly as flexible as they are.

### Measurements and fields

The measurements are grouped based on what part of Sense they are retrieved from. The groups are

1. General health metrics
2. Messages from the log files
3. Detailed metrics about what users are connected to (i.e. have sessions open with) which virtual proxies

#### General health metrics

A shared set of tag keys are available for all general health metrics:

| Tag key | Description |
| --------- | ----------- |
| host | Host name, taken from config file's `Butler-SOS.serversToMonitor.servers[].host` property. Usually a fully qualified host name, or in some cases an IP address. |
| server_name | Human readible/friednly server name, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverName` property. |
| server_description | Description of the server, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverDescription` property. |

In addition to the above, all tags defined in the YAML config file for the servers will be included as tag keys.


##### Measurement: apps

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/September2019/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type | Description |
| ----------| -----| ----------- |
| active_docs | string | An array of GUIDs of active apps. Empty if no apps are active. An app is active when a user is currently performing some action on it. |
| active_docs_count | integer | Number of currently active apps |
| in_memory_docs | string | An array ofthe GUIDs of all apps currently loaded into the memory, even if they do not have any open sessions or connections to it. The apps disappear from the list when the engine has purged them out from memory.	|
| in_memory_docs_count | integer | Numer of apps currently in memory |
| loaded_docs | string | An array of the GUIDs of apps currently loaded into memory and that have open sessions or connections. Empty if no apps are loaded. |
| loaded_docs_count | integer | Number of currently loaded apps |
|  |  |  |
| calls | integer | Number of calls to the Qlik associative engine since it started |
| selections | integer | Numer of selections made in Qlik associative engine since it started |

##### Measurement: cache

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/September2019/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type | Description |
| ----------| -----| ----------- |
| added | integer | Number of cache objects added to the cache |
| bytes_added | integer | Number of bytes added to the cache |
| hits | integer | Number of cache hits in engine |
| lookups | integer | Number of lookups in egnine |
| replaced | integer | Number of cache objects replaced |

##### Measurement: cpu

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/September2019/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type | Description |
| ----------| -----| ----------- |
| total | integer | Percentage of the CPU used by the engine, averaged over a time period of 30 seconds. |

##### Measurement: mem

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/September2019/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type | Description |
| ----------| -----| ----------- |
| allocated | integer | The total amount of allocated memory (committed + reserved) from the operating system in MB. |
| committed | integer | The total amount of committed memory for the engine process in MB. |
| free | integer | The total amount of free memory (minimum of free virtual and physical memory) in MB. |

##### Measurement: saturated

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/September2019/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type | Description |
| ----------| -----| ----------- |
| saturated | boolean | When the value is true, the engine is running with high resource usage; otherwise the value is false. See link above for details. |

##### Measurement: sense_server

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/September2019/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type | Description |
| ----------| -----| ----------- |
| started | string | ISO timestamp when the engine service was started. |
| uptime | string | Time since engine service was started (human readable).  |
| version | string | Engine version. |

##### Measurement: session

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/September2019/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type | Description |
| ----------| -----| ----------- |
| active | integer | Number of active engine sessions. A session is active when a user is currently performing some action on an app, for example, making selections or creating content. |
| total | integer | Total number of engine sessions. |

##### Measurement: users

Source: [Health check API](https://help.qlik.com/en-US/sense-developer/September2019/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

| Field key | Type | Description |
| ----------| -----| ----------- |
| active |  | integer |
| total | integer |  |

#### Log events

All log data written to InfluxDB share a common set of tag keys:

| Tag key | Description |
| --------- | ----------- |
| host | Host name, taken from config file's `Butler-SOS.serversToMonitor.servers[].host` property. Usually a fully qualified host name, or in some cases an IP address. |
| server_name | Human readible/friednly server name, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverName` property. |
| server_description | Description of the server, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverDescription` property. |
| log_level | The logging level of the log event (ERROR, WARNING, INFO etc). |
| source_process | Which Sense service the log event originated in. |

##### Measurement: log_event

Source: More or less [log db](https://help.qlik.com/en-US/sense-admin/September2019/Subsystems/DeployAdministerQSE/Content/Sense_DeployAdminister/QSEoW/Deploy_QSEoW/Qlik-Logging-Service.htm). A query is done to the log db in Postgres, the results are stored in InfluxDB. There is thus no Qlik API call per se.

| Field key | Type | Description |
| ----------| -----| ----------- |
| message | string | Log entry as retrieved from the Sense log database (Postgres). |

#### User session details

User session metrics have slightly different tag keys depending on the granularity level of the metric - those metrics are therefore listed under each heading below.

##### Measurement: user_session_summary

Source: [Session module API](https://help.qlik.com/en-US/sense-developer/September2019/Subsystems/ProxyServiceAPI/Content/Sense_ProxyServiceAPI/ProxyServiceAPI-Session-Module-API.htm)

| Field key | Type | Description |
| ----------| -----| ----------- |
| session_count | float | Total number of sessions, per server and virtual proxy. |

Tag keys: 

| Tag key | Description |
| --------- | ----------- |
| host | Host name, taken from config file's `Butler-SOS.serversToMonitor.servers[].host` property. Usually a fully qualified host name, or in some cases an IP address. |
| server_name | Human readible/friednly server name, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverName` property. |
| server_description | Description of the server, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverDescription` property. |
| user_session_host | Host name the session metrics are associated with. |
| user_session_virtual_proxy | Virtual proxy name the session metrics are associated with. |

##### Measurement: user_session_list

Source: [Session module API](https://help.qlik.com/en-US/sense-developer/September2019/Subsystems/ProxyServiceAPI/Content/Sense_ProxyServiceAPI/ProxyServiceAPI-Session-Module-API.htm)

| Field key | Type | Description |
| ----------| -----| ----------- |
| session_user_id_list | string | List of user IDs with sessions, per server and virtual proxy. NOTE: A single user may have more than one session open to a particular server/virtual proxy. |

Tag keys: 

| Tag key | Description |
| --------- | ----------- |
| host | Host name, taken from config file's `Butler-SOS.serversToMonitor.servers[].host` property. Usually a fully qualified host name, or in some cases an IP address. |
| server_name | Human readible/friednly server name, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverName` property. |
| server_description | Description of the server, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverDescription` property. |
| user_session_host | Host name the session metrics are associated with. |
| user_session_virtual_proxy | Virtual proxy name the session metrics are associated with. |

##### Measurement: user_session_details

Source: [Session module API](https://help.qlik.com/en-US/sense-developer/September2019/Subsystems/ProxyServiceAPI/Content/Sense_ProxyServiceAPI/ProxyServiceAPI-Session-Module-API.htm)

| Field key | Type | Description |
| ----------| -----| ----------- |
| session_id | string | Session GUID, uniquely identifying the session in the entire Sense cluster.|
| user_directory | string | Session user's user directory. |
| user_id | string | Session user ID |

Tag keys: 

| Tag key | Description |
| --------- | ----------- |
| host | Host name, taken from config file's `Butler-SOS.serversToMonitor.servers[].host` property. Usually a fully qualified host name, or in some cases an IP address. |
| server_name | Human readible/friednly server name, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverName` property. |
| server_description | Description of the server, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverDescription` property. |
| user_session_host | Host name the session metrics are associated with. |
| user_session_virtual_proxy | Virtual proxy name the session metrics are associated with. |
| user_session_id | Session GUID |
| user_session_user_directory | User's user directory |
| user_session_user_id | User ID |
