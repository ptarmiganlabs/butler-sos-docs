---
title: "Configure which Sense servers to monitor"
linkTitle: "Servers to monitor"
weight: 220
description:
---

{{% alert title="Mandatory" color="warning" %}}
These settings are mandatory.  
They must exist in the config file and be correctly set for Butler SOS to work.
{{% /alert %}}

## What's this?

This part of the config file contains information on what Sense servers should be monitored and details about those servers.

Note that there is a dependency to the `Butler-SOS.userSessions` section. Please see the [Configuring user sessions](/docs/getting_started/setup/user-sessions/) page for more info.

### Tags

It's possible to define server specific tags that will be stored together with the Sense metrics in InfluxDB.  
The tags can then be used when creating Grafana dashboards, for example to distinguish between DEV, TEST and PROD servers, where servers are located physically etc.

You can define zero or more tags in the `Butler-SOS.serversToMonitor.serverTagsDefinition` section.  
Those tags are then given values for each server.

If a tag is defined it *must* in fact be given a value for each server!  
If nothing else just set it to an empty string or a hyphen, '-'.

## Settings in main config file

{{< notice tip >}}
The config snippet below comes from the [production_template.yaml](https://github.com/ptarmiganlabs/butler-sos/blob/master/src/config/production_template.yaml) file.

Being a template, it contains examples on how configuration *may* be done - not necessarily how it *should* be done.  
For example, the list `serverTagsDefinition` is optional and can be changed to something else, or removed all together if not used.

Same thing for the list of servers and virtual proxies. Update them so they match your own Sense environment.
{{< /notice >}}

```yaml
Butler-SOS:
  ...
  ...
  serversToMonitor:
    pollingInterval: 30000          # How often (milliseconds) should the healthcheck API be polled?

    # If false, Butler SOS will accept TLS certificates on the server without verifying them with the CA. 
    # If true, data will only be retrieved from the Sense server if that server's TLS cert verifies 
    # successfuully against the list of CAs available on the computer where Butler SOS is running.
    rejectUnauthorized: true 

    # List of extra tags for each server. Useful for creating more advanced Grafana dashboards.
    # Each server below MUST include these tags in its serverTags property.
    # The tags below are just examples - define your own as needed
    serverTagsDefinition: 
      - server_group
      - serverLocation
      - server-type
      - serverBrand
    # Sense Servers that should be queried for healthcheck data 
    servers:
      - host: <server1.my.domain>:4747        # Example: 10.34.3.45:4747
        serverName: <server1>
        serverDescription: <description>
        logDbHost: <host name as used in QLogs db>
        userSessions:
          enable: true
          # Items below are mandatory if userSessions.enable=true
          host: <server1.my.domain>:4243      # Example: 10.34.3.45:4243
          virtualProxies:
            - virtualProxy: /                 # Default virtual proxy
            - virtualProxy: /hdr              # "hdr" virtual proxy
            - virtualProxy: /sales            # "sales" virtual proxy
        serverTags:
          server_group: DEV
          serverLocation: Asia
          server-type: virtual
          serverBrand: Dell
      - host: <server2.my.domain>:4747        # Example: 10.34.3.46:4747
        serverName: <server2>
        serverDescription: <description>
        logDbHost: <host name as used in QLogs db>
        userSessions:
          enable: true
          # Items below are mandatory if userSessions.enable=true
          host: <server2.my.domain>:4243
          virtualProxies:
            - virtualProxy: /finance          # "finance" virtual proxy
        serverTags:
          server_group: PROD
          serverLocation: Europe
          server-type: physical
          serverBrand: HP
  ...
  ...
```
