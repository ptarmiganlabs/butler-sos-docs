---
title: "Command line options"
linkTitle: "Command line options"
weight: 5
description: >
  Description of Butler SOS' command line options.
---

<!-- {{% pageinfo %}}
This is a placeholder page that shows you how to use this template site.
{{% /pageinfo %}} -->

## Command line options

When starting Butler SOS, you can pass command line options to customize its behavior.  
Looks like this:

```shell
Usage: butler-sos [options]

Butler SenseOps Stats ("Butler-SOS") is a microservice publishing operational Qlik Sense metrics to InfluxDB, Prometheus and New Relic.
User events and log events can be forwarded from Sense to Butler SOS and then acted upon there. Events can be stored in InfluxDB and sent to New Relic.
Add Grafana for great looking dashboards and you get real-time monitoring of what happens inside a Qlik Sense environment.

Options:
  -V, --version                        output the version number
  -c, --configfile <file>              path to config file
  -l, --loglevel <level>               log level (choices: "error", "warn", "info", "verbose", "debug", "silly")
  --new-relic-account-name  <name...>  New Relic account name. Used within Butler SOS to differentiate between different target New Relic accounts
  --new-relic-api-key <key...>         insert API key to use with New Relic
  --new-relic-account-id <id...>       New Relic account ID
  --skip-config-verification           Disable config file verification (default: false)
  -h, --help                           display help for command
```

## -V, --version

Output the version number of Butler SOS.

## -c, --configfile

Specifies the configuration file to use.

Valid values: A path to a configuration file.

Default: Whatever is specified in the `NODE_ENV` environment variable, with a .yaml extension added. Butler SOS will look for that file in the `./config` directory.

Example:

- `-c` or `--configfile` are not specified. `NODE_ENV` is set to `production`. Butler SOS will try to read settings from `./config/production.yaml`.

## -l, --loglevel

Specifies the log level to use.  
When set, this overrides the log level specified in the configuration file.

Valid values: 'error', 'warn', 'info', 'verbose', 'debug', 'silly'

Default: 'info'

## New Relic related options

When using New Relic as backend for storing metrics, you can specify New Relic credentials in the config file - but that is not ideal from a security perspective.

To avoid that, you can specify the New Relic credentials on the command line using the following options.

### --new-relic-account-name

List of New Relic account names. Used within Butler SOS to differentiate between different target New Relic accounts to which data can be sent. This name has nothing to do with the account name used in New Relic - it's purely for Butler SOS' internal use.  
Specifically, it's at multiple places in the config file where you can specify to which New Relic account to send data.

Enclose account names in quotes if they contain spaces.  
Separate multiple account names with a space.

Example: `--new-relic-account-name "Account 1" "Account 2"`

### --new-relic-api-key

List of New Relic API keys. Used to authenticate with New Relic.

Enclose API keys in quotes if they contain spaces.  
Separate multiple API keys with a space. Note that the order of the API keys must match the order of the account names, i.e. the first API key corresponds to the first account name, the second API key corresponds to the second account name, and so on.

Example: `--new-relic-api-key "API key 1" "API key 2"`

### --new-relic-account-id

List of New Relic account IDs. Used to identify the New Relic account to which data should be sent.

Enclose account IDs in quotes if they contain spaces.  
Separate multiple account IDs with a space. Note that the order of the account IDs must match the order of the account names, i.e. the first account ID corresponds to the first account name, the second account ID corresponds to the second account name, and so on.

## --skip-config-verification

Disable config file verification.

By default, Butler SOS verifies the config file when it starts. If the config file is invalid, Butler SOS will log an error and exit.  
Use this option to disable config file verification.

## -h, --help

Display help for command.
