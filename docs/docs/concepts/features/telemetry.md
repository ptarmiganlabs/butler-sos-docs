---
outline: deep
---

# Telemetry

Butler SOS can send anonymous telemetry data to help improve future development.

## What is telemetry?

Telemetry is anonymous usage data that helps the Butler SOS developers understand:

- What operating systems Butler SOS runs on
- What hardware configurations are common
- How Butler SOS is being used

This information guides development priorities and helps ensure Butler SOS works well across different environments.

## What data is collected?

The telemetry data is completely anonymous and includes:

- Operating system type and version
- Hardware information (CPU, memory)
- Butler SOS version
- Basic usage patterns

::: info
No sensitive information is ever collected - no IP addresses, hostnames, usernames, Qlik Sense data, or any configuration details.
:::

## Privacy

- All data is anonymous
- No personally identifiable information is collected
- No Qlik Sense data or credentials are transmitted
- You can disable telemetry at any time

## Configuration

```yaml
Butler-SOS:
  systemInfo:
    enable: true # Required for telemetry to work

  anonTelemetry: true # Enable/disable anonymous telemetry
```

| Setting             | Description                                    |
| ------------------- | ---------------------------------------------- |
| `anonTelemetry`     | `true` to enable telemetry, `false` to disable |
| `systemInfo.enable` | Must be `true` for telemetry to function       |

::: warning Important dependency
Telemetry requires `Butler-SOS.systemInfo.enable` to be `true`.

If you disable system information gathering (for security reasons), you must also disable telemetry. Butler SOS will refuse to start if telemetry is enabled but systemInfo is disabled.
:::

## Disabling telemetry

To disable telemetry, set:

```yaml
Butler-SOS:
  anonTelemetry: false
```

Or if you need to disable system information gathering entirely:

```yaml
Butler-SOS:
  systemInfo:
    enable: false
  anonTelemetry: false
```

::: tip Please consider leaving telemetry enabled
The anonymous data really helps guide Butler SOS development and ensures the tool continues to improve. If you're comfortable with it, please consider leaving telemetry enabled.
:::
