---
title: "Documentation"
linkTitle: "Documentation"
weight: 20
menu:
  main:
    weight: 20
---

{{% pageinfo %}}

### What's new in version 5.6

* Added user event monitoring. Up until now this has been a feature of [Butler](https://butler.ptarmiganlabs.com), but as this feature is very much within the domain covered by Butler SOS, it's moving here instead.  
  The events monitored are session start/stop (typically users logging in/out/timeout) and connection open/close (typically an app being opened/closed in a browser tab).
* Added a blacklist for user sessions. If a user is added to the blacklist, the session detailed session data for that user will not be saved to InfluxDB.  
  The user will still be included in the session summary metrics and count towards the total number of sessions, at any given time.  
  Note: The blacklist only applies to storing detailed session data in InfluxDB, MQTT (if enabled) is not affected by the blacklist.
* Anonymous telemetry added. Same set of data included in other Butler tools, i.e. only information about what the execution environment of Butler SOS looks like and which features are enabled.
  The rationale for adding telemetry is to give Butler SOS developers a better understanding of on what kinds of servers the software is used. This insight will make it easier to develop future Butler SOS versions.
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
