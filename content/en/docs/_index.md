---
title: "Documentation"
linkTitle: "Documentation"
weight: 20
menu:
  main:
    weight: 20
---

{{% pageinfo %}}

### What's new in version 5.4

* **Sample dashboards** are now built using the brand new, shiny and all together awesome Grafana 7. Did we mention that Grafana 7 is awesome?
* Ever wondered how long Butler SOS has been running or how much memory it uses? The new **uptime messages** have you covered. 
* You are properly impressed with the uptime messages - good. Why not store them to Influxdb, so you can also **visualize Butler SOS' own memory use**? It's just a couple of changes in the config file away.
* Don't want to use the **Docker healthchecks**? No reason to if you don't user Docker. You can now turn it off in the config file.
* Ah, you are a serious Sense user and have separate DEV and PROD environments? Good - now Butler SOS tags its own memory use so you can **monitor each Butler SOS instance separately**.
* Who will monitor the monitor? Butler SOS can now **send heartbeats** to customizable URLs at desired intervals. Perfect if you want to monitor Butler SOS using for example [healthchecks.io](https://healthchecks.io). Very, very cool actually.
* **Bugs, bugs and bugs**. The known ones have been fixed. Keep reporting new ones!
* **Update all dependencies** to latest versions, to ensure security concerns are adressed.

Releases are [available on Github](https://github.com/ptarmiganlabs/butler-sos/releases).

{{% /pageinfo %}}
