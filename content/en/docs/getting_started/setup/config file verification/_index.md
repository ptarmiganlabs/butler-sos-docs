---
title: "Config file verification"
linkTitle: "Verify config file"
weight: 13
description: >
  How to verify that the Butler SOS config file is valid.
---

A description of the config file format is available [here](/docs/reference/config_file_format/).

Configuring the Butler SOS config file is usually the most challenging part of setting up Butler SOS.  
The config file is written in an easy to read YAML format, but given the number of settings that can be configured, it can be a bit daunting to get it right.

Starting with version 9.6.0, Butler SOS comes with a built-in config file verification tool that can be used to verify that the config file is valid.

## Verify the config file

Config file verification is enabled by default.  

Verification is done when Butler SOS is started, and if the config file is not valid, Butler SOS will not start.

{{< notice info >}}
All settings in the config file are mandatory.  
If you don't want to use a specific Butler SOS feature, you must still include its settings in the config file, but you are free to disable the feature and set its setting to empty strings/values/arrays.
{{< /notice >}}

## Skipping config file verification

If you want to skip config file verification, you can do so by starting Butler SOS with the '--skip-config-verification` setting to `true` in the config file.

This will bypass all checks of the config file's validity, and Butler SOS will try to start with the provided config file.  
This can be useful if you are in the process of setting up Butler SOS and want to start it before the config file is complete, but for production scenarios it is recommended to leave config file verification enabled.
