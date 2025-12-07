---
outline: deep
---

# Errors & Warnings

⚠️ Warnings lead to errors.  
❌ Errors lead to unhappy users.  
📞 Unhappy users call you.

Wouldn't you rather get the warnings yourself, before anyone else?

## Sense log events

Sense creates a large number of log files for the various parts of the larger Qlik Sense Enterprise environment.  
Those logs track more or less everything - from extensions being installed, users logging in, to incorrect structure of Active Directory user directories.

Butler SOS monitors select parts of these logs and provides a way to get an aggregated, close-to-real-time view into warnings and errors.

The [log events overview page](/docs/concepts/monitoring/log-events/log%20events%20overview/) has more info on this.

## Grafana dashboards

Butler SOS stores the log events in InfluxDB together with all other metrics.  
It is therefore possible to create Grafana dashboards that combine both operational metrics (apps, sessions, server RAM/CPU etc.) with warning and error related charts and tables.

Showing warnings and errors visually is often an effective way to quickly identify developing or recurring issues.

### Example 1: Circular Active Directory references

Here is an example where bursts of warnings tell us visually that something is not quite right.  
50-60 warnings arriving in bursts every few minutes - something is not right.  
There is also a single error during this time period - what's going on there?

We can then look at the actual warnings (log events) to see what's going on.

In this case it turns out to be circular references in the Active Directory data used in Qlik Sense. Not a problem with Sense per se, but still something worth looking into:

<ResponsiveImage
  src="/img/concepts/log-events/errors/butler-sos-warnings-errors-graph-1.png"
  alt="Warnings and errors from Qlik Sense in Grafana dashboard"
  caption="Warnings and errors from Qlik Sense in Grafana dashboard"
/>

<ResponsiveImage
  src="/img/concepts/log-events/errors/butler-sos-warnings-table-1.png"
  alt="Warnings from Qlik Sense in Grafana table"
  caption="Warnings from Qlik Sense in Grafana table"
/>

Looking at that single error then, it turns out it's caused by a task already running when it was scheduled to start:

<ResponsiveImage
  src="/img/concepts/log-events/errors/butler-sos-errors-table-1.png"
  alt="Errors from Qlik Sense in Grafana table"
  caption="Errors from Qlik Sense in Grafana table"
/>

### Example 2: Session bursts causing proxy overload

This example would have been hard or impossible to investigate without Butler SOS.

The problem was that the Sense environment from time to time became very slow or even unresponsive. A restart solved the problem.

Grafana was set up to send alerts when session count increased very rapidly. Thanks to this, actions could be taken within minutes of the incident occurring.

Looking in the Grafana dashboard could then show something like below.  
New sessions started every few seconds, all coming from a single client. The effect for this Sense user was that Sense was unresponsive.

The log events section of the Grafana dashboard showed that this user had been given 5 proxy sessions, after which further access to Sense internal resources (engine etc.) was denied.

<ResponsiveImage
  src="/img/concepts/log-events/errors/butler-sos-session-runaway-1.png"
  alt="Sessions increasing very quickly"
  caption="Qlik Sense sessions increasing very quickly"
/>

In this case the problem was caused by a mashup using iframes that when recovering from session timeouts caused race conditions, trying to re-establish a session to Sense over and over again.

## Alerts

Both New Relic and Grafana include a set of built-in alert features that can be used to set up alerts as well as forward them to destinations such as Slack, MS Teams, email, Discord, Kafka, Webhooks, PagerDuty and others.

More info about Grafana alerts can be found in the [Grafana documentation](https://grafana.com/docs/grafana/latest/alerting/notifications/).  
New Relic alerts are described in the [New Relic documentation](https://docs.newrelic.com/docs/alerts-applied-intelligence/new-relic-alerts/learn-alerts/introduction-alerts/).
