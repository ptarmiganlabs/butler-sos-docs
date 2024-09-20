---
title: Butler SOS
linkTitle: Butler SOS
description: An introduction to Butler SOS.
weight: 10
aliases: ['/docs/', '/docs/about/', '/docs/butler-sos/']
---

The Butler SOS project is about adding best-in-class monitoring to the client-managed Windows version of Qlik Sense Enterprise, also known as QSEoW (Qlik Sense Enterprise on Windows).  

The goal is to provide a close to real-time view into what's happening in a Qlik Sense environment.

At different times different metrics will be of interest.  
For that reason Butler SOS stores all metrics from Sense in a time-series databse (InfluxDB and Prometheus both supported), from which dashboards, reports etc can be created using tools such as Grafana.  
Grafana is an open source, world-class visualisation tool for time series data. It also has great alerting features and integrate with all kinds of alerting solutions, email, Teams, Slack and more.

If you don't fancy InfluxDB or Prometheus, Qlik Sense metrics and events can also be sent to New Relic for storage and visualisation.  
They offer a free tier that will go a long way towards testing out a cloud-based visualisation solution for Butler SOS.

Metrics are a major component of operational monitoring, but it's also important to keep on top of what errors and warning occur in the system.  
As of late 2021 the log database is no longer part of QSEoW, with the log files the only place where you can find those errors and warnings.  

Butler SOS address this by sending log events in real-time from QSEoW to Butler SOS, which then stores them in InfluxDB, and/or send them to New Relic, and/or re-publish them as MQTT messages.  
This basically means you will very rarely have to plow through endless log files to find information about warnings and errors that have occured.  
Warnings and errors can alse be categorised by Butler SOS, making it *much* easier to understand what is happening in your Sense environment.

By listening in on the Qlik Sense log events from the associative engine, Butler SOS gets very detailed information about what is happening in the engine (which is where the magic happens).  
This means you get very detailed information about what is happening in your Sense apps, sheets and charts - as it happens.  
A chart that takes too long to render, an app that opens slowly, a sheet that is slow to load - all these things can be monitored in real-time.

Butler SOS also tracks user agents of all users accessing your Sense environment.
This means you get real-time insights into what operating systems and browsers are used to access your Sense environment.

There is a clear goal that Butler SOS should be very configurable.  
In practice this means that features can be turned on/off as needed, improving security and lowering memory usage.

Butler SOS is written in [Node.js](https://nodejs.org/en/) and runs on most modern operating systems.  
Stand-alone binary files are created for Windows, Linux and macOS.  
Windows and macOS binaries are signed with a code-signing certificates, making it easier to install and run on those platforms.

You can run Butler SOS on the same server as Qlik Sense, in a Docker container on a Linux server, in Kubernetes, on Mac OS, on Raspberry Pi (not a good idea.. but possible and proven to work).

Butler SOS is a member of a group of tools collectively referred to as the "Butler family", more info is available [here](/docs/about/butler-family).
