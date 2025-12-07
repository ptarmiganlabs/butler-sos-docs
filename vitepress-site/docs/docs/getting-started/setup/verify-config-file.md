---
outline: deep
---

# Config File Verification

How to verify that the Butler SOS config file is valid.

A description of the config file format is available in the [Configuration File Format](/docs/reference/config-file-format) reference.

## Verify the Config File

Config file verification is enabled by default.

Verification is done when Butler SOS is started, and if the config file is not valid, Butler SOS will not start.

::: info All settings are mandatory
All settings in the config file are mandatory.

If you don't want to use a specific Butler SOS feature, you must still include its settings in the config file, but you are free to disable the feature and set its settings to empty strings/values/arrays, or just leave the default values in place.
:::

## Skipping Config File Verification

If you want to skip config file verification, you can do so by setting the `--skip-config-verification` command line option to `true` when starting Butler SOS.

This will bypass all checks of the config file's validity, and Butler SOS will try to start with the provided config file.

This can be useful if you are in the process of setting up Butler SOS and want to start it before the config file is complete, but for production scenarios it is recommended to leave config file verification enabled.
