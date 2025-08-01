---
title: Butler SOS
---

{{< blocks/cover title="Butler SOS: Real-time monitoring for Qlik Sense" image_anchor="top" height="full" >}}

<div class="mx-auto">
 <a class="btn btn-lg btn-primary mr-3 mb-4" href="/docs/">
  Learn More <i class="fas fa-arrow-alt-circle-right ml-2"></i>
 </a>
 <a class="btn btn-lg btn-secondary mr-3 mb-4" href="https://github.com/ptarmiganlabs/butler-sos/releases/latest" target="_blank">
  Download <i class="fab fa-github ml-2 "></i>
 </a>
 <p class="lead mt-5">Warnings lead to errors ➡️ Errors lead to unhappy users ➡️ Unhappy users call you. Ouch 👎.</p>
 <p class="lead mt-2">Wouldn't you rather get the warnings yourself, before anyone else?</p>

 <p class="lead mt-5"></p>
 <p class="-bg-primary p-2 display-4">If you don't measure it, you can't improve it. </p>
 
 <div class="mx-auto mt-5">
  {{< blocks/link-down color="info" >}}
 </div>
</div>
{{< /blocks/cover >}}

{{% blocks/lead color="primary" %}}
Butler SOS is an open source (free!!) tool that provides real-time monitoring of Qlik Sense Enterprise environments.<br>
One server or 40? No problem.

Runs on Windows, Linux, Mac OS, in Docker or as a Kubernetes service.

Eager to try it out? The [getting started](docs/getting_started/) pages will tell you everything you need.
{{% /blocks/lead %}}

{{% blocks/lead color="dark" %}}
**--- Why is monitoring important? ---**

Good question!

For starters, if you are responsible for a Sense environment and hear about issues from your end users - that's a bad position to be in.
You should be the first to know when something breaks. Only then are you able to fix things quickly, ideally even before end users realize there has been an incident.

Additionally, having access to real-time metrics makes it much easier to incrementally tweak and tune your Sense environment.
{{% /blocks/lead %}}

{{% blocks/lead color="orange" %}}
**--- Can I get alerts when some metric go out of bounds? ---**

Yes! Butler SOS stores all data in an InfluxDB and/or Prometheus database, from where it is visualized using Grafana.

Both are best-in-class, open source products for storing and visualizing time-series data.

Grafana is incredibly feature rich, including a powerful alerting feature that can send alerts to email, IM tools (Slack etc), PagerDuty and more.
{{% /blocks/lead %}}

{{% blocks/lead color="info" %}}
**--- Can I get alerts when errors or warnings occur in Qlik Sense? ---**

Yes! In version 7 Butler SOS added a new, unique feature: Real-time monitoring of Qlik Sense log events.

This means that you get notifications about warnings or errors within seconds of them happening in your Sense server(s). You can take action within minutes rather than hours or days.

The same concept also works for user events. Need to track sessions over time or alert when a users from a certain department logs on? No problem.

Butler SOS version 9 takes this concept even further, enabling forwarding of select log and user events to the New Relic monitoring service.

With version 10.2, Butler SOS can also categorize according to your specific needs, making it **_much_** easier to understand what is happening in your Sense environment - as it happens.
{{% /blocks/lead %}}

{{% blocks/lead color="success" %}}
**--- What operating systems and browsers are used to access my Qlik Sense environment ? ---**

Glad you asked!<br>
Butler SOS can help you with that too.

Butler SOS version 9.7 added a new feature that tracks user agents of all users  
accessing your Sense environment.<br>

This data is stored in InfluxDB, NewRelic and is sent as MQTT messages.
{{% /blocks/lead %}}

{{% blocks/lead color="primary" %}}
**--- We use system \<_our-preferred-monitoring–tool_\> for monitoring. Can it be used with Butler SOS? ---**

Yes, most likely. Butler SOS supports both InfluxDB, Prometheus and New Relic, but also optionally sends metrics as MQTT messages.  
If your main monitoring tool can use either of these as a data source, it can read data extracted by Butler SOS.

If not natively supporting InfluxDB, Prometheus, New Relic or MQTT, it is usually pretty easy to create a small tool that acts as a bridge to other systems.

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

Example: Easy to see which users will be affected by a server restart. Connect this data to your IM tool and notify users before restarts happen.
{{% /blocks/feature %}}

{{% blocks/feature icon="fa-archive" title="Logging revisited" %}}
The Sense log database is gone as of second half of 2021, but with log events forwarded to Butler SOS - then visualized in Grafana or New Relic - you get real-time insight into errors and warnings as they happen.

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

Butler SOS can categorize log entries into any number of categories, making it much easier to understand what is happening in your Sense environment.

Suddenly it's easy to find the important log entries among all those non-critical events.
{{% /blocks/feature %}}

{{% /blocks/section %}}

{{< blocks/section type="row">}}

{{% blocks/feature icon="fa-lightbulb" title="Latest release: 12.0.1" %}}

New systemInfo configuration setting for enhanced security control.  
Conditional validation - disabled features no longer validate their config settings.
Enhanced security scanning and SBOM features for better supply chain security.

Plus all the existing features: detailed performance metrics for individual apps, sheets and charts, real-time alerts for slow apps and charts, and data model performance monitoring.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-download" title="Download" %}}

Available on [GitHub](https://github.com/ptarmiganlabs/butler-sos/releases).

{{% /blocks/feature %}}

{{% blocks/feature icon="fab fa-github" title="Contributions welcome!"%}}
We use a [Pull Request](https://github.com/ptarmiganlabs/butler-sos/pulls) contributions workflow on GitHub.  
New developers are always welcome!

Or submit a feature suggestion, or maybe a bug report.  
It's all done over at [GitHub](https://github.com/ptarmiganlabs/butler-sos/issues/new/choose).
{{% /blocks/feature %}}

{{< /blocks/section >}}
