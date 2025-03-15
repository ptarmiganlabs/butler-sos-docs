---
title: "Configuring Butler SOS heartbeats"
linkTitle: "Heartbeats"
weight: 30
description: >
  Heartbeats provide a way to monitor that Butler SOS is running and working as intended.  

  Butler SOS can send periodic heartbeat messages to a monitoring tool, which can then alert if Butler SOS hasn't checked in as expected.
---

{{% alert title="Optional" color="primary" %}}
These settings are optional.

If you don't need this feature just disable it and leave the default values in the config as they are.

Do note though that Butler SOS expects the configuration properties below to exist in the config file, but will _ignore their values_ if the related features are disabled.
{{% /alert %}}

## What's this?

A tool like Butler SOS should be viewed as mission critical, at least if it is used to monitor mission critical Sense apps.

But how can you know whether Butler SOS itself is working?  
Somehow Butler SOS should be monitored.

Butler SOS (and most other tools in the Butler family) has a **heartbeat** feature.  
It sends periodic messages to a monitoring tool, which can then alert if Butler SOS hasn't checked in as expected.

[Healthchecks.io](https://healthchecks.io/) is an example of such as tool. It's open source and can be self-hosted, but also has a SaaS option if so preferred.

[Uptime Kuma](https://github.com/louislam/uptime-kuma) is another great tool that can be used, it has a somewhat slicker UI than Healthchecks.io - but it's really a matter of personal preference which one to use.

More info on using Healthchecks.io with Butler (Butler SOS works the same way) can be found [in this blog post](https://ptarmiganlabs.com/blog/2020/07/26/black-box-monitoring-of-butler-tools-monitoring-the-monitor/).

## Settings in main config file

```yaml
Butler-SOS:
  ...
  ...
  # Heartbeats can be used to send "I'm alive" messages to some other tool, e.g. an infrastructure monitoring tool
  # The concept is simple: The remoteURL will be called at the specified frequency. The receiving tool will then know
  # that Butler SOS is alive.
  heartbeat:
    enable: true
    remoteURL: http://my.monitoring.server/some/path/
    frequency: every 1 hour         # https://bunkat.github.io/later/parsers.html#text
  ...
  ...
```
