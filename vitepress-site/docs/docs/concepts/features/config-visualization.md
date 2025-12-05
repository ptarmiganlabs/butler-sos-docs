---
outline: deep
---

# Config File Visualization

Butler SOS can serve a web page showing its configuration file, making it easy to review and troubleshoot settings.

## What it does

When enabled, Butler SOS starts an internal web server that displays the current configuration in a browser-friendly format.

Features:

- **JSON and YAML views** - Switch between formats
- **Obfuscation** - Optionally hide sensitive values
- **Download** - Export the config for sharing or backup

## Use cases

- **Troubleshooting** - Quickly review current settings
- **Support requests** - Share obfuscated config when asking for help
- **Documentation** - Verify configuration matches documentation

## Configuration

```yaml
Butler-SOS:
  configVisualisation:
    enable: true
    host: localhost
    port: 3100
    obfuscate: true
```

| Setting | Description |
|---------|-------------|
| `enable` | Enable/disable the web server |
| `host` | IP address or hostname to bind to (use `localhost` for local-only access) |
| `port` | Port number for the web server |
| `obfuscate` | Hide sensitive values like passwords, tokens, IP addresses |

## Accessing the web page

Once enabled, open a browser and navigate to:

```text
http://localhost:3100
```

(Adjust host and port based on your configuration)

## JSON vs YAML views

The web page offers two views:

- **JSON** - Useful for copying into validators or other tools
- **YAML** - Easier to read, matches the config file format

## Obfuscation

When obfuscation is enabled, sensitive values are replaced with placeholder text. This makes it safe to share your configuration when asking for support.

::: warning
Obfuscation is not foolproof. Always review the obfuscated output before sharing to ensure no sensitive information is visible.
:::

### What gets obfuscated

- IP addresses and hostnames
- Usernames and passwords
- API keys and tokens
- Certificate paths and passphrases
- Other potentially sensitive values

## Security considerations

::: danger
Only bind to `localhost` unless you have a specific need to expose the config visualization to other machines. Exposing your configuration (even obfuscated) to a network could reveal information about your infrastructure.
:::

If you need remote access, consider:

- Using a reverse proxy with authentication
- Limiting access via firewall rules
- Only enabling temporarily when needed
