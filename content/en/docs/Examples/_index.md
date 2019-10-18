---
title: "Examples"
linkTitle: "Examples"
weight: 3
description: >
  See Butler SOS in action!
---

{{% pageinfo %}}
The whole SenseOps (Butler family of tools, together with support tools like InfluxDB, Grafana etc) stack is really a platform that can be configured and used in lots of different ways.  

Be curious and bold - extend the given examples and use cases with your own!
And when doing so - please consider sharing your successes (and failures..) with others, as inspiration and insight.
{{% /pageinfo %}}


## Qlik Sense server metrics

This is a top use case for Butler SOS.  
These kind of dashboards give you detailed insights into several important metrics for your Sense servers:

* CPU load
* Amount of free RAM memory
* Number of sessions in total
* Success rate of the Qlik engine's cache
* Number of loaded apps in the Qlik engine

You can create dashboards that combine metrics from several servers, or break out the metrics for each server:

![Grafana dashboard](senseOps_dashboard_4.png "SenseOps dashboard showing Qlik Sense metrics, using Grafana")

Note how a low-RAM alert has been set (using Grafana's alert feature) and is also triggered in the dashboard above. Such alerts can be sent (using features built into Grafana) as notifications to Slack, Teams, Pager Duty, as email etc.

## Qlik Sense warnings and errors

When something breaks in a Qlik Sense environment the logs immediately fill up with warning and/or error messages. By keeping track of these it's easy to quickly spot (and get notified) issues when they first occur:

![Grafana dashboard](senseOps_dashboard_3.png "SenseOps dashboard showing errors and warnings, using Grafana")

## User level session monitoring

As of version 5 of Butler SOS, metrics can be extracted about what individual users have open sessions with each Sense virtual proxy. This allows for very detailed monitoring of what users are connected, how many sessions they have open etc.  

One possible use case for this information is to see what users will be affected by a pending server reboot. You could even use this information to send a chat message to these users, informing them that their connection to Sense will be lost in x minutes. This feature is not available in Butler SOS out of the box, but is quite possible to implement if needed.

