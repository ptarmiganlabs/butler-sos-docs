---
title: "Visualise Butler SOS config file"
linkTitle: "Visualise config file"
weight: 100
description: >
  Butler SOS has a built-in web server that can be used to visualise the configuration file, either as YAML or JSON.


  Sensitive config values can be optionally be obfuscated in the visualization.
---

## What is the current configuration?

When Butler SOS starts up, it reads its configuration from a file.  
This file is the source of truth for the Butler SOS configuration, so when in doubt about what Butler SOS is doing, this is the place to look.

The config file can be hard to get to though, especially if Butler SOS is running in a container or on a remote machine.  
To make it easier to see what the current configuration is, Butler SOS has a built-in web server that can be used to visualise the configuration file, either as YAML or JSON.

{{< notice info >}}
This feature is described in the setup guide, [here](/docs/getting_started/setup/config-file-visualisation/).
{{< /notice >}}
