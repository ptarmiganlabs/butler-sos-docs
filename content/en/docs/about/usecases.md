+++ 
title = "Use cases" 
description = "How can Butler SOS be used?"
weight = 30
+++

Below follow an overview of what Butler SOS can be used for.

A complete list of metrics is available in the [reference section](/docs/reference/available_metrics/).

## Monitor server metrics

Some basic server metrics are monitored by Butler SOS. You may have other, dedicated server monitoring tools too - Butler SOS does not replace these.  
It's however often convenient to have both server and Sense metrics side by side, thus Butler SOS includes some of the more important server metrics in addition to the Sense ones.

These metrics are only stored in InfluxDB, i.e. not sent as MQTT messages.

### Available memory/RAM

As Qlik Sense is an in-memory analytics tool you *really* want to ensure that there is always available memory for users' apps.  
If your Sense server runs out of memory it's basically game over.
Now, Sense is usually does a very good job to reclaim unused memory, but it's still critically important to monitor memory usage.  

One error scenario that's hard or impossible to catch without Butler SOS style monitoring is that of apps with cartesian products in them.  
They can easily consume tens of hundreds GByte of RAM within seconds, bringing a Sense server to a halt.  
Butler SOS has more than once proven its value when debugging this specific issue.

### CPU load

If a server is heavily loaded it will eventually be seen as slow(er) by end users, with associated badwill accumulating.  

## Monitor Qlik Sense metrics

This is the main use case for Butler SOS, with a large number of monitored metrics.  
Butler SOS can be configured to store these metrics in InfluxDB and/or send them as MQTT messages.

### Session count

A session is essentially a user logging into Sense.  
Knowing how many users are logged at any given time gives a Sense admin an understanding of when peak hours are, when service windows should be planed, whether the server(s) is too small or too big etc.

The session metrics are arguably among the most important ones provided by Butler SOS

### Applications

Butler SOS tracks how many and what applications (IDs and app names) are in loaded into the monitored Qlik engine(s).
In-memory and active applications are also tracked in the same way.

These metrics provide useful insights into the degree to which loaded apps are actually used and to what degree caching is in effect.

A couple of bonus metrics are also included: Number of calls made to the Qlik associative engine and number of selections done by users in the engine. Not really useful as such, but they do serve as a good relative measurement of how active users are between days/weeks/months. 

### User events

### Cache status

The cachine of applications in RAM is one of Qlik's classic selling points. But is it really working?

Butler SOS provides a set of metrics (bytes added to cache, lookups, cache hits/misses etc) that give hard numbers to the question of whether the cache is working or not.

While this is probably not as interesting from an operational perspective as user session counts, RAM usage and errors/warnings from the Sense logs, the cache metrics should definitely be monitored over medium timespans.

For example, if the cache hit ration goes down over weeks or months, that could mean a poorer user experience over that same time period.

## Qlik Sense errors & warning

The Sense logs are always available on the Sense servers, the problem is that they are hard to reach there - at least in real time.

Butler SOS pulls errors and/or warnings from the log database and store them in InfluxDB.  
This can be increadibly useful information when used in Grafana dashboars: Visuallu seeing lots of errors arriving in a short time period is a strong indication something is not right.  

Add Grafana alerts and you have a very close to real-time error/warning monitoring solution.
