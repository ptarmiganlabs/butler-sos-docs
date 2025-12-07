---
outline: deep
---

# Configuring User Sessions

Configure how Butler SOS retrieves user session information from Qlik Sense.

::: info Optional
These settings are optional.

If you don't do anything user session metrics are turned on by default.
:::

## What's This?

A description of what user sessions are is available in the [Concepts section](/docs/concepts/sessions%20connections/).

Detailed user session metrics are retrieved for all virtual proxies specified in the `Butler-SOS.serversToMonitor.servers[].userSessions.virtualProxies[]` array.

In other words: For each monitored Sense server it is possible to specify which of the server's proxy service's virtual proxies should be monitored with respect to per-user session metrics.

Let's try again: For each monitored Sense server, decide which virtual proxies should be monitored. Enter those virtual proxies in the `Butler-SOS.serversToMonitor.servers[].userSessions.virtualProxies[]` array for the server in question.

::: tip Note
In order to get detailed, per-user and virtual proxy session info you need to:

1. Configure the `Butler-SOS.userSessions` section of the config file with general parameters about how often sessions should be polled, user blacklist etc. Don't forget to set `Butler-SOS.userSessions.enableSessionExtract` to true.

2. For each server then set `Butler-SOS.serversToMonitor.servers[].userSessions.enable` to true and specify which virtual proxies should be monitored.

You will only get user session info if you configure both points above.
:::

## Settings in Main Config File

::: tip
The config snippet below comes from the [production_template.yaml](https://github.com/ptarmiganlabs/butler-sos/blob/master/src/config/production_template.yaml) file.

Being a template, it contains examples on how configuration _may_ be done - not necessarily how it _should_ be done.

For example, the `LAB/testuser1` and `LAB/testuser2` users are optional and can be changed to something else, or removed altogether if not used.
:::

```yaml
Butler-SOS:
  ...
  ...
  # Sessions per virtual proxy
  userSessions:
    enableSessionExtract: true      # Query unique user IDs of what users have sessions open (true/false)?
    # Items below are mandatory if enableSessionExtract=true
    pollingInterval: 30000          # How often (milliseconds) should session data be polled?
    excludeUser:                    # Optional blacklist of users that should be disregarded when it comes to session monitoring.
                                    # Blacklist is only applied to data in InfluxDB. All session data will be sent to MQTT.
      - directory: LAB
        userId: testuser1
      - directory: LAB
        userId: testuser2
  ...
  ...
```
