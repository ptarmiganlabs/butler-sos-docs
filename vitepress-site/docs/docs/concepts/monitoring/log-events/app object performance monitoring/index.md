---
outline: deep
---

# App performance monitoring

Users complain about an app being slow to open, or that a certain chart is slow to update.

Butler SOS can help you understand what's going on by providing very detailed, real-time performance metrics for all apps or just a few, for all charts or just some.

## Knowing is better than guessing

Monitoring a Qlik Sense environment - or any system - comes down to knowing what's going on.

- If you don't know what's going on, you're guessing.
- And if you're guessing, you're not in control.
- If you're not in control, well - that's a bad place to be.

### Qlik's performance analysis apps

Qlik has a couple of apps that can be used to analyze performance data from Qlik Sense Enterprise on Windows.

First, the **Operations Monitor** app ships with every instance of Qlik Sense Enterprise on Windows.  
This app is the go-to tool for retrospective analysis of what's going on in a Sense environment.

The app puts all the great features of Qlik Sense to good use on top of the Sense logs it has access to.  
What apps were reloaded when, which reload tasks failed most, which users are most active, etc.

Then there's the **Telemetry Dashboard** app.

It uses the same data as Butler SOS, but as it's a Sense app it must be reloaded in order to get updated data.  
Butler SOS on the other hand uses real-time delivery of the events from Sense's Log4Net logging framework.

If you want to do retrospective analysis of detailed performance data, the [Telemetry Dashboard app](https://adminplaybook.qlik-poc.com/docs/tooling/telemetry_dashboard.html) is an excellent choice.

[This page](https://help.qlik.com/en-US/sense-admin/May2024/Subsystems/DeployAdministerQSE/Content/Sense_DeployAdminister/QSEoW/Deploy_QSEoW/telemetry-logging.htm) provides additional info about the telemetry logging available in Qlik Sense.

## Lots of use cases

Categorization of events can be done in different ways depending on what you want to achieve.  
Here are some examples of what can be done using Butler SOS:

- You want high-level insights into how long various app actions take for all apps.
  - Turn on engine performance monitoring in general, but no need for app details
  - Enable tracking of rejected performance log events. This will capture high-level metrics (such as time used and number of events) for all methods/commands used in the engine.
  - Create a Grafana dashboard that shows the average time taken for each method/command.
  - 🎉 You get immediate, visual insight into how fast (or slow) apps open.
- Users complain about an app being slow to open.
  - Turn on performance logging for app open events from that particular app. Store data in InfluxDB.
  - Create a Grafana dashboard that shows a histogram of app open times for that app.
  - 🎉 You get hard numbers on how long the app usually takes to open, and what the outliers are.
- A certain chart is slow to update.
  - Turn on performance logging for that specific app and chart. Store data in InfluxDB.
  - Create a Grafana dashboard that shows a histogram of chart update times for that chart. Or add a new chart to an existing dashboard.
  - Define alerts in Grafana so you get notified if rendering time for the chart exceeds some threshold.
  - Use Butler SOS' user events features to keep track of what users access the app when the chart is slow.
  - 🎉 You know in real-time how many and which users were impacted, and get a notification when it happens.
- You suspect that an app has a poorly designed data model.
  - Enable detailed performance monitoring for that specific app
  - Create a Grafana dashboard that
    - tracks the "traverse_time" metric. This metric shows how long it takes to traverse the data model. A poorly designed data model tends to have longer traverse times. Break it down by app object and proxy session.
    - tracks the render time for each chart and table in the app. Slow charts and tables _may_ be caused by a bad data model, but not always. Lots of (complex) data may also be a reason.
  - 🎉 You get real-time insight into which objects are slow for what users, due to a bad data model in that specific app.

## Performance log events

A "performance log event" is a log event that originates from the Qlik Sense engine, more specifically from the "QixPerformance.Engine.Engine" subsystem.  
They are sent to Butler SOS as UDP messages, just like regular log events (using the same port).

The performance log events have `INFO` log level in the Sense logs but still provide _very_ detailed information about what the engine is doing.

::: warning QIX Performance Log Level Requirement
For Butler SOS to receive detailed app object performance monitoring data, the **QIX performance log level** setting in the Qlik Management Console (QMC) must be set to **`debug`**.

This requirement is the same for other tools that use this performance data, such as Qlik's Telemetry Dashboard app.

To configure this setting:

1. Open the QMC
2. Go to Engines > [Your Engine Node] > Logging
3. Set "QIX performance log level" to "debug"
4. Apply the changes

Without this setting, Butler SOS will not receive the performance log events needed for detailed app object monitoring.

Also - keep in mind that the performance log events can generate **a lot** of data, so make sure to have a reasonable retention period for the InfluxDB database where the data is stored.
:::

::: warning
The XML appender files that ship with Butler SOS don't do any filtering of log events.

This means that all events from the "QixPerformance.Engine.Engine" subsystem are sent to Butler SOS, regardless of what they are about.  
The filtering is then done (if configured) by Butler SOS.

For large Sense environments, there can therefore be a lot of UDP messages sent to Butler SOS.  
This is usually not a problem, but at some point Butler SOS may become overwhelmed and start dropping messages.

Use the log message counter feature in Butler SOS to keep track of how many messages are received - this can be a good indicator of how close Butler SOS is to its limits.
:::

### Accepted vs rejected performance log events

Due to the potential high volume of performance log events sent by Qlik Sense, Butler SOS has a filtering feature that can be used to only store the events that are of interest.

Events that meet the filtering criteria are called "accepted" events, and events that don't are "rejected" events.

Accepted events are stored in InfluxDB, including detailed performance metrics for the event.  
Details on what is stored for accepted events can be found in the [reference section](/docs/reference/available-metrics/influxdb#accepted-performance-events).

Rejected events are not stored in InfluxDB, but are still _counted_ by Butler SOS.  
This feature can be enabled/disabled in the Butler SOS config file. More info is available in the [config file reference](/docs/reference/config-file-format).

### Data available for accepted and rejected events

The full set of data stored for accepted events is described in the [reference section](/docs/reference/available-metrics/influxdb#accepted-performance-events).

## Suggested workflows for different use cases

For some high-level use cases, such as identifying apps that are slow to load, the data for rejected events may be sufficient.

Other use cases, such as monitoring the behavior of specific app objects (charts, tables etc.), require the detailed data stored for accepted events.

The recommended, general principle is:

> Start with the data captured via rejected events (counter and process_time), and then add detailed monitoring.  
> The detailed monitoring involves setting up filters to capture specific events for specific apps and/or app objects and/or engine methods.
>
> Also: make sure to have a reasonably short retention period (10-14 days are usually enough) for the InfluxDB database, as the performance log events can generate a lot of data that can easily affect the performance of the InfluxDB instance.

## Grafana dashboard examples

### High-level monitoring of app performance (rejected events)

<ResponsiveImage
  src="/img/concepts/log-events/app-performance/butler-sos-rejected-performance-log-events-1.png"
  alt="High level metrics (counters and process_time) for apps in a Sense environment."
  caption="High level metrics (counters and process_time) for apps in a Sense environment."
/>

<ResponsiveImage
src="/img/concepts/log-events/app-performance/butler-sos-rejected-performance-log-events-2.png"
alt="Average time opening apps in a Sense environment. Note the long time for the app &quot;Training - Field indexing DEV&quot;."
caption="Average time opening apps in a Sense environment. Note the long time for the app &quot;Training - Field indexing DEV&quot;."
/>

<ResponsiveImage
src="/img/concepts/log-events/app-performance/butler-sos-rejected-performance-log-events-3.png"
alt="Total time spent on different engine operations, across all apps that were accessed during the selected time interval. Note the long time for the &quot;Global::OpenApp&quot; operation - this comes from one or more apps being slow to open."
caption="Total time spent on different engine operations, across all apps that were accessed during the selected time interval. Note the long time for the &quot;Global::OpenApp&quot; operation - this comes from one or more apps being slow to open."
/>

<ResponsiveImage
  src="/img/concepts/log-events/app-performance/butler-sos-rejected-performance-log-events-4.png"
  alt="Min, medium and max time spent opening apps in a Sense environment. Here we again see that most apps open quickly, but one app takes a long time to open. We can also see that once that app is in memory, it&#39;s fast to open for subsequent users."
  caption="Min, medium and max time spent opening apps in a Sense environment. Here we again see that most apps open quickly, but one app takes a long time to open. We can also see that once that app is in memory, it&#39;s fast to open for subsequent users."
/>

### Detailed monitoring of app object performance (accepted events)

A large set of metrics are stored for accepted performance log events, the examples below highlight just a few of them.

<ResponsiveImage
src="/img/concepts/log-events/app-performance/butler-sos-accepted-performance-log-events-1.png"
alt="Detailed performance metrics for app objects in two different Sense apps. &quot;Work time&quot; (upper left) is the time spent by the engine doing the actual work, like calculating chart data after a selection is made by the user."
caption="Detailed performance metrics for app objects in two different Sense apps. &quot;Work time&quot; (upper left) is the time spent by the engine doing the actual work, like calculating chart data after a selection is made by the user."
/>

<ResponsiveImage
  src="/img/concepts/log-events/app-performance/butler-sos-accepted-performance-log-events-2.png"
  alt="Work time per app. The chart shows that one app dominates the work time."
  caption="Work time per app. The chart shows that one app dominates the work time."
/>

<ResponsiveImage
src="/img/concepts/log-events/app-performance/butler-sos-accepted-performance-log-events-3.png"
alt="Work time per object type, for all apps accessed during the chosen time interval. The chart shows that &quot;auto-chart&quot; and &quot;table&quot; objects take the most time to calculate. The &quot;Unknown&quot; object type is a catch-all for objects that Qlik Sense doesn&#39;t care to classify. It is also used in events sent during app reloads."
caption="Work time per object type, for all apps accessed during the chosen time interval. The chart shows that &quot;auto-chart&quot; and &quot;table&quot; objects take the most time to calculate. The &quot;Unknown&quot; object type is a catch-all for objects that Qlik Sense doesn&#39;t care to classify. It is also used in events sent during app reloads."
/>

<ResponsiveImage
  src="/img/concepts/log-events/app-performance/butler-sos-accepted-performance-log-events-4.png"
  alt="Detailed information about the various engine performance events that have been captured."
  caption="Detailed information about the various engine performance events that have been captured."
/>

<ResponsiveImage
  src="/img/concepts/log-events/app-performance/butler-sos-accepted-performance-log-events-5.png"
  alt="It is possible to inspect any value in the table, and easily copy it to the clipboard."
  caption="It is possible to inspect any value in the table, and easily copy it to the clipboard."
/>

<ResponsiveImage
src="/img/concepts/log-events/app-performance/butler-sos-accepted-performance-log-events-6.png"
alt="Work time per app object in the &quot;Test data - Meetup.com DEV&quot; app. Nothing stands out as particularly slow."
caption="Work time per app object in the &quot;Test data - Meetup.com DEV&quot; app. Nothing stands out as particularly slow."
/>

<ResponsiveImage
src="/img/concepts/log-events/app-performance/butler-sos-accepted-performance-log-events-7.png"
alt="Work time per app object in the &quot;Training - Field indexing&quot; app. The chart shows that two objects take on the order of 5 seconds each to calculate. This is worth investigating."
caption="Work time per app object in the &quot;Training - Field indexing&quot; app. The chart shows that two objects take on the order of 5 seconds each to calculate. This is worth investigating."
/>

<ResponsiveImage
  src="/img/concepts/log-events/app-performance/butler-sos-accepted-performance-log-events-8.png"
  alt="Looking at the app sheet where the two slow objects above are located, we can see that it&#39;s two tables, each containing strings with random characters. These are slow to index for the engine after a selection is done by the user (or when first opening the app), causing the high work time."
  caption="Looking at the app sheet where the two slow objects above are located, we can see that it&#39;s two tables, each containing strings with random characters. These are slow to index for the engine after a selection is done by the user (or when first opening the app), causing the high work time."
/>
