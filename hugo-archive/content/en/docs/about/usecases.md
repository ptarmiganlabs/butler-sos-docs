+++ 
title = "Use cases" 
description = "How can Butler SOS be used?"
weight = 30
+++

A complete list of metrics is available in the [reference section](/docs/reference/available_metrics/).

## Monitor Qlik Sense metrics

This is the main use case for Butler SOS, with a large number of monitored metrics.  
Butler SOS can be configured to store these metrics in InfluxDB/Prometheus and/or send them as MQTT messages.

### Session count

A session (or more specifically, a "proxy session") is created when a user logs into Sense.  
The session is typically reused when a user opens additional Sense apps from the same browser.  
Knowing how many users are logged at any given time gives a Sense admin an understanding of when peak hours are, when service windows should be planed, whether the server(s) is too small or too big etc.

The session metrics are arguably among the most important ones provided by Butler SOS

### Applications

Butler SOS tracks how many and what applications (IDs and app names) are in loaded into the monitored Qlik engine(s).
In-memory and active applications are also tracked in the same way.

These metrics provide useful insights into the degree to which loaded apps are actually used and to what degree caching is in effect.

A couple of bonus metrics are also included: Number of calls made to the Qlik associative engine and number of selections done by users in the engine. Not really useful as such, but they do serve as a good relative measurement of how active users are between days/weeks/months.

### Cache status

The caching of applications in RAM is one of Qlik's classic selling points. But is it really working?

Butler SOS provides a set of metrics (bytes added to cache, lookups, cache hits/misses etc) that give hard numbers to the question of whether the cache is working or not.

While this is probably not as interesting from an operational perspective as user session counts, RAM usage and errors/warnings from the Sense logs, the cache metrics should definitely be monitored over medium timespans.

For example, if the cache hit ration goes down over weeks or months, that could mean a poorer user experience over that same time period.

## Monitor server metrics

Some basic server metrics (free RAM and CPU load) are monitored by Butler SOS. You may have other, dedicated server monitoring tools too - Butler SOS does not replace these.  
It's however often convenient to have both server and Sense metrics side by side, thus Butler SOS includes some of the more important server metrics in addition to the Sense ones.

These metrics are only stored in InfluxDB/Prometheus, i.e. not sent as MQTT messages.

### Available memory/RAM

As Qlik Sense is an in-memory analytics tool you _really_ want to ensure that there is always available memory for users' apps.  
If your Sense server runs out of memory it's basically game over.
Now, Sense usually does a very good job reclaiming unused memory, but it's still critically important to monitor memory usage.

One error scenario that's hard or impossible to catch without Butler SOS style monitoring is that of apps with Cartesian products in them.  
They can easily consume tens of hundreds GByte of RAM within seconds, bringing a Sense server to a halt.  
Butler SOS has more than once proven its value when debugging this specific issue.

### CPU load

If a server is heavily loaded it will eventually be seen as slow(er) by end users, with associated badwill accumulating.

## Log events: Qlik Sense errors & warning

The Sense logs are always available on the Sense servers, the problem is that they are hard to reach there - at least in real time.  
Retrospective analysis is also cumbersome, you basically have to manually dig up the specific log files of interest and then search them for the needed information.  
Qlik _does_ provide good analysis apps for the logs, but they are not real-time and they must be reloaded (which tends to be slow and resource intensive) to show new data.

Butler SOS simplifies this greatly by having select log events (warnings, errors and fatals by default) sent from the Sense servers to Butler SOS.  
Once such a log event message arrives, Butler SOS will store it in its database (for example InfluxDB or New Relic), from where the log event can be visualized using Grafana or within New Relic.

Log events from several Qlik Sense services can selectively be forwarded to Butler SOS:

- Engine
- Proxy
- Repository
- Scheduler

A sample use case of log events:

1. Create a Grafana or New Relic real-time chart showing number of warnings/errors per 5-minute window.
2. Set up an alert in those tools to notify you when number of events during past 5 minutes go above some limit.

This is trivial to set up, but gives you a very capable, close to real-time error/warning monitoring solution.

Log events can also be re-published as MQTT messages. This makes it possible for 3rd party systems to trigger actions when certain log events occur in Qlik Sense.

### Categorization of log events

By categorizing log events, Butler SOS makes it much easier to understand what is happening in your Sense environment.  
For example, if you categorize log events as follows:

- reload failures as "reload_failures"
- engine related errors/warnings as"engine"
- Active Directory related errors as "active_directory"
- permission denied related messages as "permission"

...you can then easily create Grafana charts that show number of warnings/errors per category, and also clearly show how many unknown log events there are.  
It's also easy to track volume of warnings/errors over time, and to set up alerts when number of events go above some threshold.

### Engine performance log events

Butler SOS can also process performance log events from the Qlik associative engine (the "Qix" engine as it was called in older versions of Sense).

These events provide _very_ detailed insights into how the engine is performing, including how long it takes to calculate expressions, how long it takes to open apps, how long it takes to calculate charts etc.  
And how much memory each of those operations consume.

This is a very powerful feature, but when enabled in Qlik Sense (from the QMC) it will generate _a lot_ of data that will all be store in the Sense log files.

By configuring Qlik Sense to send these events to Butler SOS instead of storing it in ever growing log files, you gain several advantages:

- The data is stored in a time series database, making it easy to visualise, analyze and alert on in real time.
- By applying retention policies in the database, you keep only the most recent data, thus saving (_lots of!_) disk space compared to storing all data in log files on the Sense servers.

Let's look at a few examples of what data volumes are generated by these events:

- A user opening a Sense app will generate 15-20 log events.
- Making a selection in a chart will generate 10-15 log events.
- A scheduled reload will generate 5-10 initial log events, then one progress event every 2 seconds, and finally 5-10 log events when the reload is done. For long running reloads this can easily generate 1000+ log events.

When enabled via the QMC, the associated Sense log files can easily reach millions of lines per day week even on a relatively small Sense environment.  
Butler SOS lets you handle this data in a more efficient way.

## The log database

The log database in Qlik Sense Enterprise on Windows is deprecated as of late 2021.  
Butler SOS still maintains support for older QSEoW versions. At some point in the future this support is however likely to be removed.

This feature relies on Butler SOS querying log db with certain intervals (typically every few minutes).  
A list of recent log events are returned to Butler SOS. The events are de-duplicated before stored in InfluxDB.

This essentially achieve the same thing as the more modern log event feature of Butler SOS - but with longer delays.
The log event model is almost instantaneous whereas the log db polling will be its very nature result in non real-time data.

## User activity events

Detailed events are available for all users:

- Session start
- Session stop
- Connection open
- Connection close

These events are both stored in InfluxDB and re-published as MQTT messages.

Usually it's enough to track how many users are currently using the Qlik Sense system.  
Exactly _what_ users are usually of less interest.

At times you may want more detailed insights though. Then these events are incredibly useful.

For example:

- Sometimes network issues cause some users' browsers to start many new sessions instead of re-using existing sessions.  
  This can result in the proxy service overloading and making access to Sense slow for all users.  
  Butler SOS makes it easy to detect this. Just create a Grafana chart that shows number of `session start` events over time, attach an alert that goes off if number of new sessions per minute is too high.
- Let's say a specific user has troubles using Sense apps as intended, or a user is suspected of causing excessive RAM/CPU usage.  
  Subscribe to the MQTT user activity messages coming from Butler SOS, filtering out just the user(s) of interest.  
  Get a notification the very moment the user connects to Sense after which you can follow in real time what happens with the system. Does CPU go up? Free RAM goes down? Which apps are loaded?

You can also use the MQTT message to create your personal disco light, controlled by your Sense users connecting and dropping off the Sense server...

Green = User opening a connection to Sense  
Red = User closing connection to Sense

From [YouTube](https://www.youtube.com/watch?v=T_IxQYdoqJA).

{{< youtube id="T_IxQYdoqJA" modestbranding=true color="red">}}
