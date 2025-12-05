---
outline: deep
---

# Sessions & Connections

What are user sessions and why are they important?

Who is using the Sense environment right now?

This is a very basic question a sysadmin will ask over and over again.  
This question is answered in great detail by the excellent Operations Monitor app that comes with Qlik Sense out of the box.  
But that app gives a retrospective view of the data - it does not provide real-time insights.

Butler SOS focuses on the opposite: Give as close to real-time insights as possible into what's happening in the Sense environment.

User behavior is then an important metric to track, more on this below.

## Proxy sessions

A _session_, or more precisely a _proxy session_ starts when a user logs into Sense and ends when the user logs out or the session inactivity timeout is reached.  
There may be some additional corner-case variants, but the above is the basic, high-level definition of a proxy session.

::: tip
Some useful lingo: The events that can happen for sessions are that they can _start_ and _stop_.

They can also _timeout_ if the user is inactive long enough (the exact time depends on settings in the QMC).
:::

As long as a user uses the same web browser and doesn't use incognito mode or similar, the user will reuse the same session for all access to Sense.  
On the other hand: If a user uses different browsers, incognito mode etc., multiple sessions will be registered for the user in question. There is a [limit to how many sessions a user can have at any given time](https://community.qlik.com/t5/Knowledge-Base/Increase-max-parallel-SessionCount-for-Qlik-Sense-end-user/ta-p/1717086).

Mashups and similar scenarios where Sense objects are embedded into web apps may result in multiple sessions being created. Whether or not this happens largely depends on how the mashup was created.

A good overview of what constitutes a session is found [here](https://community.qlik.com/t5/Knowledge-Base/How-to-count-sessions-in-Qlik-Sense/ta-p/1714209).

### Proxy session vs engine sessions

The proxy service is responsible for handling users connecting to Qlik Sense.

When a user connects, a _proxy session_ is created - assuming the user has permissions to access Sense.

When interacting with individual charts in a Sense app, _engine sessions_ are used to interact with the engine service.

A user typically thus has one (or a few) proxy sessions and then a larger number of transient engine sessions.

More info [here](https://help.qlik.com/en-US/sense-developer/May2024/Subsystems/Platform/Content/Sense_PlatformOverview/Concepts/sessions.htm).

## Connections

A user may open more than one _connection_ within a session.

A connection is opened when the user opens an app in a browser tab, or when a user opens a mashup which in turn triggers a connection to a Sense app to be set up.  
Closing the browser tab will close the connection.

::: tip
Some useful lingo: The events that can happen for connections are that they can be _opened_ and _closed_.  
:::

## User events

Butler SOS offers a way to monitor individual session and connection events, as they happen.

This is done by Butler SOS hooking into the logging framework of Qlik Sense, which will notify Butler SOS when users start/stop sessions or connections are being opened/closed.  
The concept is identical to how Butler SOS gets metrics and log events from Sense.

A blacklist in the main config file provides a way to exclude some users (e.g. system accounts) from the user event monitoring.

Configuration of user events monitoring is done in the main config file's `Butler-SOS.userEvents` section.  
More info about the config file is available [here](/docs/reference/config_file_format/). (TODO)

On an aggregated level, this information is useful to understand how often users log in/out, when peak hours are etc.  
On a detailed level, this information is extremely useful when trying to understand which users had active sessions when some error occurred.  
Think investigations such as "who caused that 250 GB drop in RAM we were just alerted about?".

<ResponsiveImage
  src="/img/concepts/sessions-connections/butler-sos-user-events-graph-1.png"
  alt="User events in Grafana dashboard"
  caption="User events in Grafana dashboard"
/>
