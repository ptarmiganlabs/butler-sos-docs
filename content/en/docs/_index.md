---
title: "Documentation"
linkTitle: "Documentation"
weight: 20
menu:
  main:
    weight: 20
---

{{% pageinfo %}}

{{< notice tip >}}
Starting with version 9.3, the [GitHub releases page](https://github.com/ptarmiganlabs/butler-sos/releases) is the place where release notes are found.
{{< /notice >}}

Release notes for older versions are found below.

### What's new in version 9.2

#### Features

* Add support for storing Sense engine warning/error log messages in InfluxDB. [#435](https://github.com/ptarmiganlabs/butler-sos/issues/435)
* Specify zero or more New Relic credentials via command line options. [#429](https://github.com/ptarmiganlabs/butler-sos/issues/429)
* Support for sending metrics and events to multiple New Relic accounts. [#417](https://github.com/ptarmiganlabs/butler-sos/issues/417)
* Write info on startup about execution type. [#430](https://github.com/ptarmiganlabs/butler-sos/issues/430)

#### Bug Fixes

* Add missing XML log appender file for QS engine service. [#433](https://github.com/ptarmiganlabs/butler-sos/issues/433)
* Log events now correctly sent to New Relic, incl engine log events. [#432](https://github.com/ptarmiganlabs/butler-sos/issues/432)

#### Miscellaneous

* Remove unnecessary handling of engine performance log messages. [#434](https://github.com/ptarmiganlabs/butler-sos/issues/434)
* Updated dependencies

### What's new in version 9.1

#### Features

* Better logging when warnings and errors occur. [#404](https://github.com/ptarmiganlabs/butler-sos/issues/404)

#### Bug Fixes

* Send correct tags to Prometheus endpoint. [#422](https://github.com/ptarmiganlabs/butler-sos/issues/422)

#### Miscellaneous

* Apply consistent formatting to all source and doc files. [#419](https://github.com/ptarmiganlabs/butler-sos/issues/419)
* Upgrade Prometheus metrics lib to latest version.
* Update dependencies to latest versions.

### What's new in version 9.0

Focus of this release is twofold:  

1. Improve the usability of the stand-alone Butler SOS binaries.
2. Send metrics and log events to the New Relic monitoring service.

#### ⚠ BREAKING CHANGES

* Add external memory to uptime data in InfluxDB.  
  This is a minor change, but it does also require a small change in the config file.

#### Features

* Add command line options to Butler SOS. [#387](https://github.com/ptarmiganlabs/butler-sos/issues/387)
* Add external memory to uptime data in InfluxDB.
* Add New Relic as destination for SenseOps metrics.
* Add optional scrambling of user id for user events sent to New Relic. [#398](https://github.com/ptarmiganlabs/butler-sos/issues/398)
* Send engine, proxy and session metrics to New Relic.

#### Bug Fixes

* Compress stand-alone binaries.
* Include New Relic status in telemtry data (23c292c)

#### Miscellaneous

* Make proxy related log entries easier to understand.[#392](https://github.com/ptarmiganlabs/butler-sos/issues/392)
* Make user event log messages easier to understand. [#396](https://github.com/ptarmiganlabs/butler-sos/issues/396)
* More relvant log prefixes for proxy session logging.
* Update dependencies to latest versions.

### What's new in version 8.1

* Scanning for security risks and vulnerabilities is now done as part of the relese process.
  This is in addition to the daily scans that are also done (and have been done for a long time].
* Clean up the Docker images (available on Docker Hub) in order to keep them as lean as possible.

### What's new in version 8.0

The version number change indicate this release contains breaking changes.  

Well... When working on the release process for Butler SOS we happened to bump the version number too much. Oops.  
No breaking changes in this version.

There's a major new feature though:  
**Pre-compiled, standalone binaries for Windows, Linux and macOS!**

This has been planned for ages and we finally got around to implement it.  
It may look like a minor change but it does make it easier to get started with Butler SOS:

* You no longer have to first install Node.js, then install all the Butler SOS files.
* All you need is now a single binary and a valid YAML config file (which hasn't changed since previous version/7.x).
* If you want to keep using a separate Node.js engine for running Butler SOS that's perfectly fine too.

### What's new in version 7.0

This is a major release including features that have been on the roadmap for years, but never really graduated from the concept phase.  
Until now, that is.

The big thing in v7.0 is the addition of a generic way to handle QSEoW warning and error events.  
These used to be written to both log files and the Sense log database, but with log db gone those events only exist in the log files.  

Butler SOS can now handle these events and store them in InfluxDB or re-publish them as MQTT messages.  
Grafana dashboards attached to InfluxDB gives you close to a real-time view into Sense errors and warnings.

Or simply:  
**Get the most important messages from the Sense log files sent in real-time to Butler SOS - and from there out into the world as needed.**

⚠️ NOTE: Because of the significant nature of the changes below, this version includes some breaking changes.

* ⚠️ Added support for dealing with individual QSEoW log events.  
  Initially warning and error events from the proxy, scheduler and repository services are sent to Butler SOS.
* MQTT topics matching the QSEoW subsystem where log events originated.  
  When sending log events to MQTT, there's an option to send each log event to a MQTT subtopic corresponding to the QSEoW subsystem the event originated from. This is useful for 3rd party systems that want to detect (and probably take action based on) very specific QSEoW log events.  
  For example, a log event from the `Service.Scheduler.Scheduler.Master.Task.TaskSession` subsystem in QSEoW would be posted to the topic `<some root topic>/service/scheduler/scheduler/master/task/tasksession`.
* ⚠️ Improved handling of user activity events.  
  These can now be sent to zero or more different MQTT topics, each covering a specific kind of user activity (start/stop session, open/close connection etc).
* ⚠️ Take the first step towards removing support for QSEoW log db in Butler SOS.  
  There is no date set yet when log db support will be removed, but at some point that's likely to happen.  
  * In this release the previously existing InfluxDB measure `log_event` has been renamed to `log_event_logdb`.  
  * The new log events introduced in v7.0 will be stored in the `log_event` message going forward.
* The [later](https://github.com/bunkat/later) library is no longer maintained and has been replaced by [@breejs/later](https://github.com/breejs/later).
* All libraries used by Butler SOS updated to latest versions.
* Documentation site updated with respect to v7.0.

### What's new in version 6.0

First, while the switch to 6.0 indicate there are breaking changes, that's not entirely true.

There are however significant changes to many parts of the code base.  

The code is now better, more modern, scalable and in general better structured.  
Plenty of testing has been done, but in order to highlight that lots of changes were done, we decided to move to 6.0 rather than 5.7.

* Added Prometheus support.  
  Most Butler SOS metrics are now exposed on a Prometheus-friendly endpoint. They can thus easily be scraped by and ingested into Prometheus.  
  Once in Prometheus the Qlik Sense metrics can be visualised using Grafana (just as before when using InfluxDB), but also used in very capable alerting scenarios. Prometheus has great integrations with many incident management tools, for example.
* The Prometheus endpoint also include general Node.js metrics that can be used to monitor Butler SOS itself.
* Switched process for doing releases of Butler SOS.  
  Things are now more automated which should result in more predictable and consistent [version numbers](/docs/about/versioning/). The changelog file will be auto-generated going forward (it will start from version 5.6.0, older version still available as `changelog_old.md`).

### What's new in version 5.6

* Added user event monitoring. Up until now this has been a feature of [Butler](https://butler.ptarmiganlabs.com), but as this feature is very much within the domain covered by Butler SOS, it's moving here instead.  
  The events monitored are session start/stop (typically users logging in/out/timeout) and connection open/close (typically an app being opened/closed in a browser tab).
* Added a blacklist for user sessions. If a user is added to the blacklist, the detailed session data for that user will not be saved to InfluxDB.  
  The user will still be included in the session summary metrics and count towards the total number of sessions, at any given time.  
  Note: The blacklist only applies to storing detailed session data in InfluxDB, MQTT (if enabled) is not affected by the blacklist.
* Anonymous telemetry added. Same set of data included in other Butler tools, i.e. only information about what the execution environment of Butler SOS looks like and which features are enabled.
  The rationale for adding telemetry is to give Butler SOS developers a better understanding of on what kinds of servers the software is used. This insight will make it easier to develop future Butler SOS versions.
* Continuing the journey towards using the same formatting principles in the config files for all the various Butler tools.  
  In Butler SOS' config file there's been a mix between "enabled", "enable", "enableMqtt" etc to tell whether a certain feature should be enabled or not. Confusing.
  We're moving towards only using "enable" for this. This release changes this for most config file entries.
  Rest assured though, the old format will still work - but you are **strongly** recommended to adapt the [current config file format](/docs/reference/config_file_format/) as it includes settings for other new (as of version 5.6) features too.
* Major refactoring of the documentation site [butler-sos.ptarmiganlabs.com](https://butler-sos.ptarmiganlabs.com). This site is now more aligned with other Butler sites, for example [butler.ptarmiganlabs.com](https://butler.ptarmiganlabs.com).
* Various bug fixes, performance improvements and fixed typos.

### What's new in version 5.5

* Docker images for various Arm architectures are now created as part of the standard release process.

### What's new in version 5.4

This video gives an idea of what Butler SOS is capable of.

{{< youtube id="CCMr8svrJXI" autoplay="true">}}

<br>
<br>

Highlights of version 5.4 include:

* **Sample dashboards** are now built using the brand new, shiny and all together awesome Grafana 7. Did we mention that Grafana 7 is awesome? Awesome.
* Ever wondered how long Butler SOS has been running or how much memory it uses? The new **uptime messages** have you covered. 
* You are properly impressed with the uptime messages - good. Why not store them to Influxdb, so you can also **visualize Butler SOS' own memory use**? It's just a couple of changes in the config file away.
* Don't want to use the **Docker healthchecks**? No reason to if you don't user Docker. You can now turn it off in the config file.
* Ah, you are a serious Sense user and have separate DEV and PROD environments? Good - now Butler SOS tags its own memory use so you can **monitor each Butler SOS instance separately**.
* Who will monitor the monitor? Butler SOS can now **send heartbeats** to customizable URLs at desired intervals. Perfect if you want to monitor Butler SOS using for example [healthchecks.io](https://healthchecks.io). Very, very cool actually.
* **Bugs, bugs and bugs**. The known ones have been fixed. Keep reporting new ones!
* **Update all dependencies** to latest versions, to ensure security concerns are adressed.

Releases are [available on Github](https://github.com/ptarmiganlabs/butler-sos/releases).

{{% /pageinfo %}}
