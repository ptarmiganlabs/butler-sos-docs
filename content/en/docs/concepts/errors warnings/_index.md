---
title: "Errors & Warnings"
linkTitle: "Errors & Warnings"
weight: 40
description: >
  Warnings lead to errors.  
  
  Errors lead to unhappy users.  
  
  Unhappy users call you.  


  Wouldn't you rather get the warnings yourself, before anyone else?
---

## Sense log files

Sense creates a large number of log files for the various parts of the larger Qlik Sense Enterprise environment.  
Those logs track more or less everything - from extensions being installed, users logging in, to incorrect structure of Active Directory user directories.

Butler SOS monitors select parts of these logs and provides a way to get an aggregated, close to real-time view into warnings and errors.  
The [log events](/docs/getting_started/setup/log-events/) page has more info on this.

## Grafana dashboards

Butler SOS stores the log events in InfluxDB together with all other metrics.  
It is therefore possible to create Grafana dashboards that combine both operational metrics (apps, sessions, server RAM/CPU etc) with warning and error related charts and tables.

Showing warnings and errors visually is often an effective way to quickly identify developing or recurring issues.  

Here is an example where bursts of warnings tell us visually that something is not quite right.  
We can then look at the actual warnings to see what's going on.  
In this case it turns out to be circular references in the Active Directory data used in Qlik Sense.  Not a problem with Sense per se, but still something worth looking into:

![Warnings and errors from Qlik Sense in Grafana dashboard](butler-sos-warnings-errors-graph-1.png "Warnings and errors from Qlik Sense in Grafana dashboard")  

![Warnings from Qlik Sense in Grafana table](butler-sos-warnings-table-1.png "Warnings from Qlik Sense in Grafana table")  

Looking at that single error then, it turns out it's caused by a task already running when it was scheduled to start:

![Errors from Qlik Sense in Grafana table](butler-sos-errors-table-1.png "Errors from Qlik Sense in Grafana table")  

## Alerts

Grafana includes a set of built-in alert features that can be used to set up alerts as well as forward them to destinations such as Slack, MS Teams, email, Discord, Kafka, Webhooks, PagerDuty and others.

More info about Grafana alerts [here](https://grafana.com/docs/grafana/latest/alerting/notifications/).
