---
outline: deep
---

# Config File Visualization

Butler SOS can visualize its config file on a web page, using an internal web server.

This can be useful for troubleshooting and understanding how Butler SOS is configured.

The configuration can optionally be obfuscated to hide sensitive information.

## What's This?

Butler SOS can visualize its config file on a web page, using an internal web server. This can be useful for troubleshooting and understanding how Butler SOS is configured.

If enabled, the web server will serve a web page on the IP address and port specified in the config file. The default IP address is `localhost` and the default port is `3100`.

### JSON and YAML

The web page will show the config file in both JSON and YAML format.

The JSON format is useful if you want to copy the config file and paste it into a JSON validator, for example. The YAML format is easier to read and understand for humans, and is also the format used in the config file.

### Obfuscation

The configuration can optionally be obfuscated to hide sensitive information. This is useful if you need to share the config file with someone else, but don't want to share sensitive information like IP addresses, user names or passwords. Obfuscation is enabled/disabled in the config file.

For example, if asking for support on the [Butler SOS forum](https://github.com/ptarmiganlabs/butler-sos/discussions), you can share the obfuscated config file without revealing sensitive information.

::: warning Disclaimer
Obfuscation is not foolproof, but it should be good enough for most use cases. Always check the obfuscated config file before sharing it.
:::

## Settings in Config File

```yaml
Butler-SOS:
  ...
  ...
  # Should Butler SOS start a web server that serves an obfuscated view of the Butler SOS config file?
  configVisualisation:
    enable: true
    host: localhost       # Hostname or IP address where the web server will listen. Should be localhost in most cases.
    port: 3100            # Port where the web server will listen. Change if port 3100 is already in use.
    obfuscate: true       # Should the config file shown in the web UI be obfuscated?
  ...
  ...
```
