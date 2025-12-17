# InfluxDB Metrics

Metrics retrieved from Qlik Sense servers can be stored in [InfluxDB](https://www.influxdata.com/products/influxdb-overview/). You don't have to be an InfluxDB expert to use Butler SOS, but understanding some basic concepts is helpful.

## InfluxDB Concepts

**Measurements** are containers for related data points—similar to tables in relational databases.

**Tags** are indexed metadata used for filtering. Tags are always strings and are included in InfluxDB's index, making queries on tag values fast.

**Fields** are the actual values being measured. Fields can be strings, integers, floats, or booleans. Fields are not indexed, so queries on field values are slower than tag queries.

## InfluxDB v3 Schema Differences

::: warning Important for v3 Users
InfluxDB 3.x has a different architecture than v1/v2. **Tags and fields cannot have the same name** within a measurement. Butler SOS automatically handles this by appending `_field` to conflicting field names in v3.
:::

### Affected Measurements

The following measurements have field name changes in InfluxDB v3:

**user_events** - User activity events:

- `userId` → `userId_field`
- `userFull` → `userFull_field`
- `appId` → `appId_field`
- `appName` → `appName_field`

**log_event** - Log events (field changes vary by source):

- Engine, Proxy, Repository: `result_code` → `result_code_field`
- Scheduler: `app_id` → `app_id_field`, `app_name` → `app_name_field`
- QIX Performance: `app_id` → `app_id_field`

::: tip
**Tags remain unchanged.** You can still filter by the original tag names in WHERE clauses:

```sql
-- This still works in v3
WHERE userId = 'tom' AND appName = 'Sales'
```

Only SELECT statements need to reference the `_field` variants:

```sql
-- v3 query
SELECT userId_field, appName_field FROM user_events WHERE userId = 'tom'
```

:::

For detailed migration information, see the [InfluxDB v3 Migration Guide](/docs/getting-started/upgrade/influxdb-v3-migration).

### Measurements Not Affected

The following measurements have **no schema differences** between v1/v2 and v3:

- Health metrics (`sense_server`, `mem`, `apps`, `cpu`, `session`, `users`, `cache`, `saturated`)
- Session metrics (`user_session_summary`, `user_session_list`, `user_session_details`)
- Butler SOS memory (`butlersos_memory_usage`)
- Event counters (`event_count`)
- Queue metrics (`user_events_queue`, `log_events_queue`)

---

## Common Tags

All measurements share these common tags:

| Tag Key              | Description                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `host`               | Host name, taken from config file's `Butler-SOS.serversToMonitor.servers[].host` property                              |
| `server_name`        | Human friendly server name, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverName` property       |
| `server_description` | Description of the server, taken from config file's `Butler-SOS.serversToMonitor.servers[].serverDescription` property |

Additional custom tags can be defined in the config file and will be added to all measurements.

---

## General Health Metrics

These measurements contain general health and performance data from Qlik Sense servers.

### Measurement: sense_server

This measurement contains various stats from the Qlik associative engine, i.e., the part of Qlik Sense Enterprise (QSEoW) handling apps and user sessions.

**Source:** [Qlik Sense health check API](https://help.qlik.com/en-US/sense-developer/November2020/Subsystems/EngineAPI/Content/Sense_EngineAPI/GettingSystemInformation/HealthCheckStatus.htm)

#### Tags

Standard tags plus any custom tags defined in the config file.

#### Fields

| Field Key         | Type   | Description                                                                                                             |
| ----------------- | ------ | ----------------------------------------------------------------------------------------------------------------------- |
| `version`         | string | Version of the Sense engine                                                                                             |
| `started`         | string | Timestamp when the Sense engine was started                                                                             |
| `engine_metadata` | string | Various metadata about the Sense engine, as a JSON string. Parse using JSON functions to get individual key-value pairs |

---

### Measurement: apps

Application-related metrics from the Sense engine.

| Field Key              | Type    | Description                                                                                                             |
| ---------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `active_docs`          | string  | JSON array of app IDs for active apps. An app is active when a user is currently performing some action on it           |
| `active_docs_count`    | integer | Number of active apps                                                                                                   |
| `active_docs_names`    | string  | App names (as a string) of the active apps. Based on app IDs in `active_docs`. Requires app names feature to be enabled |
| `in_memory_docs`       | string  | JSON array of apps currently loaded into memory, even if they do not have any open sessions or connections              |
| `in_memory_docs_count` | integer | Number of in-memory apps                                                                                                |
| `in_memory_docs_names` | string  | App names of the in-memory apps                                                                                         |
| `loaded_docs`          | string  | JSON array of apps currently loaded into memory that also have open sessions or connections                             |
| `loaded_docs_count`    | integer | Number of loaded apps                                                                                                   |
| `loaded_docs_names`    | string  | App names of the loaded apps                                                                                            |
| `calls`                | integer | Total number of requests made to the engine                                                                             |
| `selections`           | integer | Total number of selections made in the engine                                                                           |

---

### Measurement: cache

Cache-related metrics from the Sense engine.

| Field Key     | Type    | Description                                     |
| ------------- | ------- | ----------------------------------------------- |
| `added`       | integer | Number of cache objects added                   |
| `bytes_added` | integer | Number of bytes added to cache (when available) |
| `hits`        | integer | Number of cache hits                            |
| `lookups`     | integer | Number of cache lookups                         |
| `replaced`    | integer | Number of cache objects that have been replaced |

---

### Measurement: cpu

CPU usage metrics from the Sense engine.

| Field Key | Type  | Description                                                                                            |
| --------- | ----- | ------------------------------------------------------------------------------------------------------ |
| `total`   | float | Percentage of the CPU used by the engine, averaged over a 30-second period. 100% = full use of one CPU |

---

### Measurement: mem

Memory-related metrics from the Sense engine.

| Field Key   | Type    | Description                                                                             |
| ----------- | ------- | --------------------------------------------------------------------------------------- |
| `allocated` | integer | Total amount of allocated memory (committed + reserved) from the operating system in MB |
| `committed` | integer | Total amount of committed memory for the engine process in MB                           |
| `free`      | integer | Total amount of free memory (minimum of free virtual and physical memory) in MB         |

---

### Measurement: saturated

Engine saturation status.

| Field Key   | Type    | Description                                                                      |
| ----------- | ------- | -------------------------------------------------------------------------------- |
| `saturated` | integer | When the value is 1, the engine is running with high resource usage; otherwise 0 |

---

### Measurement: session

Session-related metrics from the Sense engine.

| Field Key | Type    | Description                                                                                                     |
| --------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| `active`  | integer | Number of active engine sessions. A session is active when a user is currently performing some action on an app |
| `total`   | integer | Total number of engine sessions                                                                                 |

---

### Measurement: users

User-related metrics from the Sense engine.

| Field Key | Type    | Description                                                                                 |
| --------- | ------- | ------------------------------------------------------------------------------------------- |
| `active`  | integer | Number of distinct active users. An active user is currently performing an action on an app |
| `total`   | integer | Total number of distinct users within the current engine sessions                           |

---

## User Session Metrics

These measurements contain detailed information about user sessions, retrieved from the Qlik Sense Proxy Service (QPS) API.

### Measurement: user_session_summary

Aggregated view showing the number of sessions for each virtual proxy.

#### Tags

| Tag Key              | Description                                                     |
| -------------------- | --------------------------------------------------------------- |
| `host`               | Host name of the Sense server from which the data was retrieved |
| `server_name`        | Human friendly server name                                      |
| `server_description` | Description of the server                                       |
| `virtual_proxy`      | Name of the virtual proxy for which session count is reported   |

#### Fields

| Field Key              | Type    | Description                                           |
| ---------------------- | ------- | ----------------------------------------------------- |
| `session_count`        | integer | Number of active sessions for the virtual proxy       |
| `session_user_id_list` | string  | Comma-separated list of user IDs with active sessions |

---

### Measurement: user_session_list

Provides a list of active sessions per user.

#### Tags

| Tag Key              | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| `host`               | Host name of the Sense server                                      |
| `server_name`        | Human friendly server name                                         |
| `server_description` | Description of the server                                          |
| `user_id`            | User ID from Qlik Sense's user directory. Format: `DOMAIN\user_id` |
| `virtual_proxy`      | Name of the virtual proxy                                          |

#### Fields

| Field Key       | Type    | Description                                                 |
| --------------- | ------- | ----------------------------------------------------------- |
| `session_count` | integer | Number of active sessions for the user on the virtual proxy |
| `sessions`      | string  | Comma-separated list of session IDs                         |

---

### Measurement: user_session_details

Detailed per-session data.

#### Tags

| Tag Key              | Description                              |
| -------------------- | ---------------------------------------- |
| `host`               | Host name of the Sense server            |
| `server_name`        | Human friendly server name               |
| `server_description` | Description of the server                |
| `user_id`            | User ID from Qlik Sense's user directory |
| `virtual_proxy`      | Name of the virtual proxy                |
| `session_id`         | Unique identifier for the session        |

#### Fields

| Field Key    | Type   | Description                       |
| ------------ | ------ | --------------------------------- |
| `session_id` | string | Unique identifier for the session |
| `user_id`    | string | User's complete ID                |

---

## Event Counters

### Measurement: event_count

Aggregated event counters for both log and user events received from Qlik Sense servers.

#### Tags

| Tag Key      | Description                                                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `event_type` | Type of event: `log` (warnings, errors, fatals from Sense services) or `user` (user activity events)                                |
| `source`     | Source system within Sense that generated the event. Examples: `qseow-scheduler`, `qseow-proxy`, `qseow-engine`, `qseow-repository` |
| `host`       | Host name of the Sense server generating the event                                                                                  |
| `subsystem`  | Subsystem where the event originated, more granular than `source`. Example: `System.Scheduler.Scheduler.Master.Task.TaskSession`    |

#### Fields

| Field Key | Type    | Description                                          |
| --------- | ------- | ---------------------------------------------------- |
| `counter` | integer | Number of events counted in the measurement interval |

---

## User Events

### Measurement: user_events

Real-time user activity events (requires log appender configuration on Sense servers).

#### Tags

| Tag Key         | Description                                                                                |
| --------------- | ------------------------------------------------------------------------------------------ |
| `host`          | Host name of the Sense server                                                              |
| `event_action`  | Type of user event: `Start session`, `Stop session`, `Open connection`, `Close connection` |
| `userFull`      | User identification in `DIRECTORY\userid` format                                           |
| `userDirectory` | User's directory                                                                           |
| `userId`        | User's ID                                                                                  |
| `origin`        | Where in Qlik Sense the event originated                                                   |

#### Fields

| Field Key        | Type   | Description                                           |
| ---------------- | ------ | ----------------------------------------------------- |
| `userFull_field` | string | User identification in `DIRECTORY\userid` format (v3) |
| `userDirectory`  | string | User's directory                                      |
| `userId_field`   | string | User's ID (v3)                                        |

::: tip InfluxDB v3
In InfluxDB v3, field names that conflict with tag names use the `_field` suffix. Tags remain unchanged for filtering purposes. See [v3 Schema Differences](#influxdb-v3-schema-differences).
:::

---

## Log Events

Log events are captured in real-time from Qlik Sense services. Different Sense services produce different types of log events.

### Measurement: log_event

Log events from various Sense services (proxy, scheduler, repository, engine).

#### Common Tags (All Sources)

| Tag Key     | Description                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------ |
| `host`      | Host name as reported in Qlik Sense's log files                                                  |
| `level`     | Sense log level: `WARN`, `ERROR`, `FATAL`                                                        |
| `log_row`   | Row number in Sense log file where the event can be found                                        |
| `source`    | Source system within Sense: `qseow-scheduler`, `qseow-proxy`, `qseow-repository`, `qseow-engine` |
| `subsystem` | Subsystem where the event originated. More granular than `source`                                |

#### Common Fields (All Sources)

| Field Key           | Type   | Description                                                                     |
| ------------------- | ------ | ------------------------------------------------------------------------------- |
| `message`           | string | Description of what the event is about                                          |
| `raw_event`         | string | The raw event message as received from QSEoW                                    |
| `command`           | string | Description of what caused the event                                            |
| `context`           | string | Context in which the event occurred. `Not available` if none                    |
| `exception_message` | string | If a serious problem/exception occurs, the associated message is available here |

### Source: Proxy Service

Proxy log events include these additional tags:

| Tag Key          | Description                                        |
| ---------------- | -------------------------------------------------- |
| `result_code`    | Result code as reported by the Sense source system |
| `user_directory` | Sense user directory of the user causing the event |
| `user_id`        | Sense user ID for the user                         |
| `user_full`      | Combination of `user_directory` and `user_id`      |

Additional fields:

| Field Key      | Description                                         |
| -------------- | --------------------------------------------------- |
| `origin`       | Part of the proxy service the event originated from |
| `task_id`      | Task ID (if a task is involved in the event)        |
| `task_name`    | Task name (if a task is involved)                   |
| `ts_iso`       | Timestamp (ISO format) when the event occurred      |
| `ts_local`     | Event timestamp (time format of Sense server)       |
| `windows_user` | Windows account used to run the proxy service       |

### Source: Scheduler Service

Scheduler log events include these additional tags:

| Tag Key        | Description                                     |
| -------------- | ----------------------------------------------- |
| `task_id`      | Task ID for tasks related to the event          |
| `task_name`    | Task name                                       |
| `app_id`       | Application ID (if an app is involved)          |
| `app_name`     | Application name                                |
| `execution_id` | Execution ID for this particular task execution |

### Source: Repository Service

Repository log events include these additional tags:

| Tag Key          | Description                                        |
| ---------------- | -------------------------------------------------- |
| `result_code`    | Result code as reported by the Sense source system |
| `user_directory` | Sense user directory                               |
| `user_id`        | Sense user ID                                      |
| `user_full`      | Combination of `user_directory` and `user_id`      |

### Source: Engine Service (Errors and Warnings)

Engine log events include these additional tags:

| Tag Key              | Description                                        |
| -------------------- | -------------------------------------------------- |
| `result_code`        | Result code as reported by the Sense source system |
| `user_directory`     | Sense user directory                               |
| `user_id`            | Sense user ID                                      |
| `user_full`          | Combination of `user_directory` and `user_id`      |
| `windows_user`       | Windows account used to run the engine service     |
| `task_id`            | Task ID (if a task is involved)                    |
| `task_name`          | Task name                                          |
| `app_id`             | Application ID (if an app is involved)             |
| `app_name`           | Application name                                   |
| `engine_exe_version` | Version of the QIX engine executable               |

Additional fields:

| Field Key    | Description       |
| ------------ | ----------------- |
| `session_id` | Engine session ID |

---

## Engine Performance Log Events

Performance log events capture detailed performance data from the associative/QIX engine. These can be filtered by Butler SOS.

### Accepted Performance Events

| Tag Key            | Description                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `host`             | The hostname of the Sense server                                                          |
| `level`            | Always `INFO` for performance log events                                                  |
| `source`           | Always `qseow-qix-perf`                                                                   |
| `log_row`          | Log row number                                                                            |
| `subsystem`        | Always `QixPerformance.Engine.Engine`                                                     |
| `method`           | Engine method: `Global::GetProgress`, `GenericObject::GetLayout`, `Global::OpenApp`, etc. |
| `object_type`      | Object type: `table`, `barchart`, `sheet`, `CurrentSelection`, etc.                       |
| `proxy_session_id` | Proxy session ID (GUID for user sessions, 0 for internal work)                            |
| `session_id`       | Engine session ID                                                                         |
| `user_full`        | Full user name: `<User directory>\<user id>`                                              |
| `user_directory`   | User directory                                                                            |
| `user_id`          | User ID                                                                                   |
| `app_id`           | App GUID                                                                                  |
| `app_name`         | App name (if available)                                                                   |
| `object_id`        | App object ID                                                                             |

| Field Key       | Type    | Description                                          |
| --------------- | ------- | ---------------------------------------------------- |
| `app_id`        | string  | App GUID                                             |
| `process_time`  | float   | Time needed to process the request (milliseconds)    |
| `work_time`     | float   | Time the request did actual work (milliseconds)      |
| `lock_time`     | float   | Time waiting for internal lock (milliseconds)        |
| `validate_time` | float   | Time used for validation (milliseconds)              |
| `traverse_time` | float   | Time for traverse part of calculation (milliseconds) |
| `handle`        | string  | Interface ID that handled the request                |
| `net_ram`       | integer | Memory used for calculation (bytes)                  |
| `peak_ram`      | integer | Peak memory used for calculation (bytes)             |
| `raw_event`     | JSON    | Raw event data in JSON format                        |

More details on performance metrics can be found in the [Qlik Sense logging documentation](https://help.qlik.com/en-US/sense-admin/May2024/Subsystems/DeployAdministerQSE/Content/Sense_DeployAdminister/QSEoW/Deploy_QSEoW/Server-Logging-Tracing-Log-File-Format-Additional-Fields-QixPerformance-Log.htm).

### Rejected Performance Events

For rejected performance log events, counters track how many events were rejected:

| Tag Key       | Description             |
| ------------- | ----------------------- |
| `source`      | Always `qseow-qix-perf` |
| `app_id`      | App GUID                |
| `app_name`    | App name (if available) |
| `method`      | Engine method           |
| `object_type` | Object type             |

| Field Key      | Type    | Description                                       |
| -------------- | ------- | ------------------------------------------------- |
| `counter`      | integer | Number of rejected performance log events         |
| `process_time` | float   | Time needed to process the request (milliseconds) |

---

## Log Database Metrics

### Measurement: log_event_logdb

Metrics retrieved from the Sense log database (Postgres).

#### Tags

| Tag Key              | Description                                     |
| -------------------- | ----------------------------------------------- |
| `host`               | Host name from config file                      |
| `server_name`        | Human friendly server name                      |
| `server_description` | Server description                              |
| `log_level`          | The logging level (ERROR, WARNING, INFO, etc.)  |
| `source_process`     | Which Sense service the log event originated in |

#### Fields

| Field Key | Type   | Description                                        |
| --------- | ------ | -------------------------------------------------- |
| `message` | string | Log entry as retrieved from the Sense log database |

---

## Butler SOS Metrics

### Measurement: butlersos_memory_usage

Metrics about Butler SOS' own resource usage. More info on these metrics is available [here](https://www.valentinog.com/blog/node-usage/).

| Field Key        | Type  | Description                                       |
| ---------------- | ----- | ------------------------------------------------- |
| `heap_total`     | float | Total size of the allocated heap                  |
| `heap_used`      | float | Actual memory used during execution of Butler SOS |
| `process_memory` | float | Total memory allocated for Butler SOS execution   |

---

## UDP Queue Metrics

::: tip New in v13.1
UDP queue metrics were introduced in Butler SOS v13.1 to provide visibility into message queue health and performance.
:::

Butler SOS uses internal message queues to handle incoming UDP messages from Qlik Sense. These queues provide protection against message flooding, enable backpressure detection, and ensure stable message processing under high load.

Queue metrics are stored in separate measurements for user events and log events.

### Measurement: user_events_queue

Metrics about Butler SOS' UDP message queue for user activity events.

The measurement name is configurable via `Butler-SOS.userEvents.udpServerConfig.queueMetrics.influxdb.measurementName`.

#### Tags

| Tag Key      | Type   | Description                                    |
| ------------ | ------ | ---------------------------------------------- |
| `queue_type` | string | Queue identifier, always `user_events`         |
| `host`       | string | Butler SOS hostname where the queue is running |
| Custom tags  | string | Additional tags from config file `tags` array  |

#### Fields

**Queue Status**

| Field Key               | Type    | Description                                 |
| ----------------------- | ------- | ------------------------------------------- |
| `queue_size`            | integer | Current number of messages waiting in queue |
| `queue_max_size`        | integer | Maximum queue capacity (from config)        |
| `queue_utilization_pct` | float   | Queue utilization percentage (0-100)        |
| `queue_pending`         | integer | Messages currently being processed          |

**Message Counters**

| Field Key            | Type    | Description                                        |
| -------------------- | ------- | -------------------------------------------------- |
| `messages_received`  | integer | Total messages received (since last metrics write) |
| `messages_queued`    | integer | Messages successfully added to queue               |
| `messages_processed` | integer | Messages successfully processed                    |
| `messages_failed`    | integer | Messages that failed during processing             |

**Dropped Messages**

| Field Key                     | Type    | Description                               |
| ----------------------------- | ------- | ----------------------------------------- |
| `messages_dropped_total`      | integer | Total dropped messages (all reasons)      |
| `messages_dropped_rate_limit` | integer | Dropped due to rate limiting              |
| `messages_dropped_queue_full` | integer | Dropped because queue was full            |
| `messages_dropped_size`       | integer | Dropped due to exceeding max message size |

**Performance**

| Field Key                | Type  | Description                                    |
| ------------------------ | ----- | ---------------------------------------------- |
| `processing_time_avg_ms` | float | Average message processing time (milliseconds) |
| `processing_time_p95_ms` | float | 95th percentile processing time (milliseconds) |
| `processing_time_max_ms` | float | Maximum processing time (milliseconds)         |

**Rate Limiting**

| Field Key             | Type    | Description                                         |
| --------------------- | ------- | --------------------------------------------------- |
| `rate_limit_current`  | integer | Current message rate (messages received per minute) |
| `backpressure_active` | integer | Backpressure status (0=inactive, 1=active)          |

---

### Measurement: log_events_queue

Metrics about Butler SOS' UDP message queue for log events.

The measurement name is configurable via `Butler-SOS.logEvents.udpServerConfig.queueMetrics.influxdb.measurementName`.

#### Tags

| Tag Key      | Type   | Description                                    |
| ------------ | ------ | ---------------------------------------------- |
| `queue_type` | string | Queue identifier, always `log_events`          |
| `host`       | string | Butler SOS hostname where the queue is running |
| Custom tags  | string | Additional tags from config file `tags` array  |

#### Fields

The fields are identical to `user_events_queue`. See above for the complete field reference.
