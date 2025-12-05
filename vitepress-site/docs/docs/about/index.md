# Butler SOS

Butler SOS provides real-time operational monitoring for Qlik Sense Enterprise on Windows (QSEoW).

The goal is to provide a close to real-time view into what's happening in a Qlik Sense environment.

## Why Butler SOS?

Anyone responsible for an IT system - large or small - can testify how frustrating it can be, **NOT** to be confident about the system's current status.

Butler SOS was born out of that frustration.

As a sysadmin, shouldn't _you_ be the first to know when something breaks - rather than be told about it by stressed-out end users?

## What is Butler SOS?

Qlik Sense Enterprise on Windows (QSEoW, client-managed Qlik Sense) is an awesome analytics platform.

In addition to being powerful - yet easy to use for end users - it also provides great APIs that make it possible to create all kinds of add-on tools that solve specific challenges.

Butler SOS is such a tool, aiming to provide best-in-class operational monitoring of Qlik Sense environments. It is open source and free to use.

Butler SOS works with client-managed Sense environments. Qlik Sense Cloud is not supported, simply because it does not provide the necessary APIs for getting real-time monitoring metrics (that's ok, the idea with a SaaS platform is that it should be managed and monitored by the provider, in this case Qlik).

## What does Butler SOS do?

Butler SOS extracts more than 30 metrics on both server health (CPU load, free memory) and Qlik Sense specifics (sessions, users, log entries, cache status etc).

These metrics are stored in a time-series database ([InfluxDB](https://www.influxdata.com/products/influxdb-overview/) and [Prometheus](https://prometheus.io) both supported) and optionally also sent to other services such as New Relic, or sent as MQTT messages.

Once the metrics are stored in the database/service of choice, [Grafana](https://grafana.com/) or [New Relic](https://newrelic.com/) (if data is stored there) can be used to create real-time visualizations and alerts.

Grafana is an open source, world-class visualization tool for time series data. It also has great alerting features and integrate with all kinds of alerting solutions, email, Teams, Slack and more.

If you don't fancy InfluxDB or Prometheus, Qlik Sense metrics and events can also be sent to New Relic for storage and visualization.  
They offer a free tier that will go a long way towards testing out a cloud-based visualization solution for Butler SOS.

## Log Events

Metrics are a major component of operational monitoring, but it's also important to keep on top of what errors and warning occur in the system.

As of late 2021 the log database is no longer part of QSEoW, with the log files the only place where you can find those errors and warnings.

Butler SOS addresses this by receiving log events in real-time from QSEoW and then stores them in InfluxDB, and/or sends them to New Relic, and/or re-publishes them as MQTT messages.

This basically means you will very rarely have to plow through endless log files to find information about warnings and errors that have occurred.  
Instead these events can be monitored in real-time in a nice Grafana dashboard.

Warnings and errors can also be categorized by Butler SOS, making it _much_ easier to understand what is happening in your Sense environment.

## Chart-level performance monitoring

By listening in on the Qlik Sense log events from the associative engine, Butler SOS gets very detailed information about what is happening in the engine (which is where the Qlik Sense magic happens).

This means you get very detailed information about what is happening in your Sense apps, sheets and charts - as it happens.

A chart that takes too long to render, an app that opens slowly, a sheet that is slow to load - all these things can be monitored in real-time.

Butler SOS also tracks user agents of all users accessing your Sense environment.
This means you get real-time insights into what operating systems and browsers are used to access your Sense environment.

## Configurability

There is a clear goal that Butler SOS should be very configurable.

In practice this means that features can be turned on/off as needed, improving security and lowering memory usage.

## Cross-Platform

Butler SOS is written in [Node.js](https://nodejs.org/en/) and runs on most modern operating systems.

Stand-alone binary files are created for Windows, Linux and macOS.  
Windows and macOS binaries are signed with code-signing certificates, making it easier to install and run on those platforms.

You can run Butler SOS on the same server as Qlik Sense, in a Docker container on a Linux server, in Kubernetes, on Mac OS, or even on Raspberry Pi (not recommended... but possible and proven to work).

## The Butler Family

Butler SOS is a member of a group of tools collectively referred to as the "Butler family", more info is available on the [Butler Family page](/docs/about/butler-family).

## Getting Help

Are you stuck on something while setting up Butler SOS? Got ideas for new features?

Don't hesitate to post your thoughts in the [Butler SOS forums](https://github.com/ptarmiganlabs/butler-sos/discussions).
