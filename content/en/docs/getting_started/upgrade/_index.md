---
title: "Upgrade"
linkTitle: "Upgrade"
weight: 80
description: >
  Upgrading Butler SOS to a new version?<br>

  Here's how to do it.
---

## First: Don't panic

Upgrading Butler SOS is usually a smooth process:

- Get the new version from the assets section on the [download page](https://github.com/ptarmiganlabs/butler-sos/releases). Extract the ZIP file.
- Back up your existing Butler SOS configuration file.
- Edit the configuration file to match the new version's requirements.
- Stop the Butler SOS process/service.
- Replace the Butler SOS binary with the new version.
- Start the process/service.
- 🥳 Celebrate!

## Then: The details

### Version number hints

Different kind of upgrades (usually) result in different levels on modifications needed in the main config file.

- "Small" upgrades move from one patch version to another, without changing the feature version.  
  Example: Upgrading from 7.3.0 > 7.3.4.
- "Medium" upgrades involves moving from one minor version to another, without changing the major version.
  Example: Upgrading from 7.2.3 > 7.3.0
- "Major" upgrades is when you move to a new major version.
  Example: 7.4.2 > 8.0.0

{{< notice warning >}}
You should always upgrade to the latest available version.  
That version has the latest features, bug fixes and security patches.
{{< /notice >}}

#### Minor upgrades

The new release includes bug fixes, security patches, minor updates to documentation etc - but no new features.

In theory there should never be any changes to the config files when doing a minor upgrade.

#### Medium upgrades

This scenario means that new features are added to Butler SOS.  
Usually there are also various bug fixes included.

Most new features need to be configured somehow, meaning that medium upgrades usually require modification to the config files.  
The most common change by far is that it's the main config file that needs to be modified, but a new scheduler related feature could for example mean that the scheduler config file must be modified too.

The changes needed to the config files are _usually_ additive in nature, i.e. some settings must be added to the config file, but the existing settings and general structure of the file remain the same.

#### Major upgrades

This scenario involves breaking changes of some kind.

These almost certainly require changes to the config files, sometimes even significant ones in the sense that the structure of the config file may have changed.

If **very** major rework has been done to Butler SOS, this may also result in a major version bump.

### Know your config file

Butler SOS is entirely driven by its YAML-formatted configuration file, with an [example file](https://raw.githubusercontent.com/ptarmiganlabs/butler-sos/master/src/config/production_template.yaml) serving as a good starting point.

### InfluxDB considerations

Some versions include changes to the InfluxDB schema, meaning that you need to do some manual work in order to upgrade to the new schema.

The easiest way to do this is to delete the InfluxDB database used by Butler SOS, then let Butler SOS re-create it using the new schema.  
If the InfluxDB database specified in the Butler SOS config file does not exist, Butler SOS will automatically create it for you.

Deleting the InfluxDB database "senseops" can be done with a command similar to this:

```bash
influx --host <ip-where-influxdb-is-running> --port <influxdb-port-usually-8086>
drop database senseops
exit
```

### Upgrade checklist

{{< notice info >}}
Butler SOS always checks that the config file has the correct format when starting.

This means that if you forget to add or change some setting in the main YAML config file, Butler SOS will tell you what's missing and refuse to start.  
A consequence of this is that all settings are now mandatory, even if you don't use them.
{{< /notice >}}

1. Make a backup of your YAML configuration file before upgrading. Just... do it.
2. Look at the [release notes](https://github.com/ptarmiganlabs/butler-sos/releases) to get a general feeling for what is new and what has changed.  
   Those are the areas that may require changes in the config file.
3. Compare your existing main config file with the [template config file](https://raw.githubusercontent.com/ptarmiganlabs/butler-sos/master/src/config/production_template.yaml) available on GitHub.  
   This comparison is a manual process and can be a bit tedious, but knowing your config file is really needed in order to make full and correct use of Butler SOS.
   1. That file is also included in the Butler SOS ZIP file available on the [download page](https://github.com/ptarmiganlabs/butler-sos/releases).
   2. A more in-depth description of the config file is available in the [Reference docs > Config file format](/docs/reference/config_file_format/) section of the documentation.
4. The result of the comparison will show you what parts of the config file are new (for medium-sized upgrades) and which parts have changed in a significant way (for major upgrades).
5. Get the binaries for the new Butler SOS version from the [download page](https://github.com/ptarmiganlabs/butler-sos/releases).
6. Start the new Butler SOS version and let it run for a few minutes.
   1. Review the console logs (or the log files) to make sure there are no warnings or errors.
   2. If there are warnings or errors it can be helpful to start Butler SOS with more verbose logging.  
      Adding `--log-level verbose` or even `--log-level debug` will give you more details on what Butler SOS is doing and what might be causing the problems you are experiencing.

## Finally: When things aren't working - check the logs

By far the most common problem when upgrading to a new Butler SOS version (or doing a fresh install) is an incorrect config file.

All config entries are mandatory, even if you don't use them.  
This may seem a bit harsh, but this way Butler SOS can tell you exactly what is missing in the config file.

Missing entries are shown in the startup log, like this:

```bash
2024-09-02T12:17:33.919Z error: VERIFY CONFIG FILE: Errors found in config file. Exiting.
2024-09-02T12:17:33.920Z error: Tip: Start Butler SOS with --no-config-file-verify option to skip this check and start with provided config file.
2024-09-02T12:17:33.920Z error: /home/goran/code/butler-sos/src/config/production.yaml is not following the correct structure, missing:,Butler-SOS.configVisualisation.enable
```

In the example above the `Butler-SOS.configVisualisation.enable` entry is missing.  
Adding that entry to the config file should make Butler SOS start.

Butler SOS is pretty good at figuring out what is wrong with the config file, but there may be cases where it's not obvious what is wrong.

Thus, double check your config file, then triple check it.

Then start Butler SOS and read the logs carefully.  
If you need more details, start Butler SOS with the `--log-level verbose` or even `--log-level debug` options to get more details on what's going on.

If things still don't work you can post a question in the [Butler SOS forums](https://github.com/ptarmiganlabs/butler-sos/discussions/categories/q-a).

By sharing your installation and upgrade challenges/issues you enable future improvements, which will benefit both yourself and others.
