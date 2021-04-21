---
title: "Configuring user sessions"
linkTitle: "User sessions"
weight: 120
description:
---

{{% alert title="Optional" color="primary" %}}
These settings are optional.

If you don't do anything user session metrics are turned on by default.
{{% /alert %}}

## What's this?

A description of what user sessions are is available in the [Concepts section](/docs/concepts/sessions-connections/#sessions).

Detailed user session metrics are retrieved for all virtual proxies specified in the `Butler-SOS.serversToMonitor.servers[].userSessions.VirtualProxies[]` array.

In other words: For each monitored Sense server it is possible to specify which of the server's proxy service's virtual proxies should be monitored with respect to per-user session metrics.  
Right, that's a long sentence...  

Let's try again: For each monitored Sense server, decide which virtual proxies should be monitored.  
Enter those proxies in the `Butler-SOS.serversToMonitor.servers[].userSessions.VirtualProxies[]` array for the server in question. 

{{< notice note >}}
In order to get detailed, per-user and virtual proxy session info you need to

1. Configure the `Butler-SOS.userSessions` section of the config file with general parameters about how often sessions should be polled, user blacklist etc.  
   Don't forget to set `Butler-SOS.userSessions.enableSessionExtract` to true.
2. For each server then set `Butler-SOS.serversToMonitor.servers[].userSessions.enable` to true and specify which virtual proxies should be monitored.

You will only get user session info if you configure both the points above.
{{< /notice >}}

## Settings in main config file

```yaml
Butler-SOS:
  ...
  ...
  # Sessions per virtual proxy
  userSessions:
    enableSessionExtract: true      # Query unique user IDs of what users have sessions open (true/false)?
    # Items below are mandatory if enableSessionExtract=true    
    pollingInterval: 30000        # How often (milliseconds) should session data be polled?
    excludeUser:                  # Optional blacklist of users that should be disregarded when it comes to session monitoring.
                                  # Blacklist is only applied to data in InfluxDB. All session data will be sent to MQTT.
      - directory: LAB
        userId: testuser1
      - directory: LAB
        userId: testuser2
  ...
  ...
  serversToMonitor:
    ...
    ...
    # Sense Servers that should be queried for healthcheck data 
    servers:
      - host: <server1.my.domain>:4747
        serverName: <server1>
        serverDescription: <description>
        logDbHost: <host name as used in QLogs db>
        userSessions:
          enable: true
          # Items below are mandatory if userSessions.enable=true
          host: <server1.my.domain>:4243
          virtualProxies:
            - virtualProxy: /                 # Default virtual proxy
            - virtualProxy: /hdr              # "hdr" virtual proxy
            - virtualProxy: /sales            # "sales" virtual proxy
  ...
  ...
```
