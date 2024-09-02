---
title: "Upgrade"
linkTitle: "Upgrade"
weight: 40
description: >
  Upgrading Butler SOS to a new version?<br>
  Here's how to do it.
---

## First: Don't panic

Upgrading Butler SOS is usually a smooth process.  
Stop the service, replace the Butler SOS binary with the new version, start the service. Done.

There are a few things to consider though:

- Make a backup of your YAML configuration file before upgrading. Just... do it.
- Some new Butler SOS versions introduce new features that bring changes to the configuration file.
  - When in doubt what the config file should look like, check the [example config file](https://raw.githubusercontent.com/ptarmiganlabs/butler-sos/master/src/config/production_template.yaml).
  - That file is also included in the Butler SOS ZIP file available on the [download page](https://github.com/ptarmiganlabs/butler-sos/releases).
  - A more in-depth description of the config file is available in the [Reference docs > Config file format](/docs/reference/config_file_format/) section of the documentation.
- All entries in the config file are mandatory, even if the feature they control is not used.
- If some config file entry is missing, Butler SOS will show what is missing and refuse to start.
  - Fix the missing entries, then try starting Butler SOS again.

## Then: Butler SOS won't start with a bad config file

When Butler SOS starts, it checks the config file for correctness.

If some entries are missing, Butler SOS will show what is missing and refuse to start.  
No checks are done on the currectness of the actual *values* of the entries, only that they are present.

Missing entries are shown in the startup log, like this:

``` bash
2024-09-02T12:17:33.919Z error: VERIFY CONFIG FILE: Errors found in config file. Exiting.
2024-09-02T12:17:33.920Z error: Tip: Start Butler SOS with --no-config-file-verify option to skip this check and start with provided config file. 
2024-09-02T12:17:33.920Z error: /home/goran/code/butler-sos/src/config/production.yaml is not following the correct structure, missing:,Butler-SOS.configVisualisation.enable
```

In the example above the `Butler-SOS.configVisualisation.enable` entry is missing.  
Adding that entry to the config file should make Butler SOS start.

## Finally: Check the logs

After starting Butler SOS, check the logs.

If some setting has an invalid value that will likely result in a warning or error in the logs.

It's worth checking also the INFO level log messages, as they contain useful information about what Butler SOS is doing.
