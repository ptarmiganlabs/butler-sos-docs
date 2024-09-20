---
title: About Butler SOS
linkTitle: About
menu:
  main:
    weight: 10
---


{{% blocks/cover title="About Butler SOS" image_anchor="bottom" height="min" %}}

<p class="lead mt-5">Qlik Sense + DevOps = SenseOps
</p>

{{% /blocks/cover %}}



{{% blocks/lead %}}
Anyone responsible for an IT system - large or small - can testify how frustrating it can be, **NOT** to be confident about the system's current status.

Butler SOS was born out of that frustration.

As a sysadmin, shouldn't *you* be the first to know when something breaks - rather than be told about it by stressed-out end users?
{{% /blocks/lead %}}



{{% blocks/lead color="dark" %}}
Qlik Sense Enterprise on Windows (QSEoW) is an awesome analytics platform.

In addition to being powerful - yet easy to use for end users - it also provides great APIs that make it possible to create all kinds of add-on tools that solve specific challenges.

Butler SOS is such a tool, aiming to provide best-in-class operational monitoring of Qlik Sense environments. It is open source and free to use.

Butler SOS works with client-managed Sense environments. Qlik Sense cloud is not supported, simply because it does not provide the necessary APIs for getting real-time monitoring metrics (that's ok, the idea with a SaaS platform is that it should be managed and monitored by the provider, in this case Qlik).
{{% /blocks/lead %}}


{{% blocks/lead %}}
Butler SOS extracts more than 30 metrics on both server health (CPU load, free memory) and Qlik Sense specifics (session, users, log entries, cache status etc).

These metrics are stored in a time-series database ([InfluxDB](https://www.influxdata.com/products/influxdb-overview/) and [Prometheus](https://prometheus.io) both supported) and optionally also sent to other services such as New Relic, or sent as MQTT messages.

Once the metrics are stored in the database/service of choice, [Grafana](https://grafana.com/) or [New Relic](https://newrelic.com/) (if data is stored there) can be used to create real-time visualisations and alerts. 
{{% /blocks/lead %}}


{{< blocks/section type="row" color="light">}}

{{% blocks/feature icon="fa-server" title="Scalability?" %}}
Butler SOS handles very large Sense clusters - or just a single node.
{{% /blocks/feature %}}


{{% blocks/feature icon="fa-bell" title="Alerts and notifications?" %}}
Built into Grafana. Email, Slack, Teams, New Relic, PagerDuty and more.  
Prometheus offers even more integrations with various alerting tools.
{{% /blocks/feature %}}


{{% blocks/feature icon="fa-users" title="Who, when, where?" %}}
Detailed info is available about what users are (and were!) connected to which virtual proxies.<br>

Example: Easy to see which users will be affectd by a server restart. Connect this data to your IM tool and notify users before restarts happen.
{{% /blocks/feature %}}


{{% blocks/feature icon="fa-archive" title="Logging revisited" %}}
The Sense log database is gone as of second half of 2021, but with log events forwarded to Butler SOS - then visualised in Grafana or New Relic - you get real-time insight into errors and warnings as they happen.

No more digging around in log files on the server!
{{% /blocks/feature %}}

{{% blocks/feature icon="fa-tachometer-alt" title="Real-time chart performance monitoring" %}}
Butler SOS can monitor the performance of individual charts and tables in your apps, as well as the performance of the actual data model itself.  
{{% /blocks/feature %}}


{{% blocks/feature icon="fa-frown" title="Know - don't guess what your users experience" %}}
Are users reporting that an app is slow to open?  
Get actual numbers - in real-time - on how long the app usually takes to open, and what the outliers are.  
{{% /blocks/feature %}}


{{% blocks/feature icon="fa-volume-down" title="Manage Sense log noise" %}}
Getting thousands of warnings and errors in your Sense logs?

Butler SOS can categorise log entries into any number of categories, making it much easier to understand what is happening in your Sense environment.

Suddenly it's easy to find the important log entries among all those non-critical events.
{{% /blocks/feature %}}


{{% /blocks/section %}}
