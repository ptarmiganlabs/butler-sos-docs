---
outline: deep
---

# Heartbeats

Heartbeats provide a way to monitor that Butler SOS itself is running and working as intended.

## Why heartbeats?

Butler SOS monitors your Qlik Sense environment - but what monitors Butler SOS?

If Butler SOS crashes or stops working, you might not notice until you check your dashboards and find missing data. Heartbeats solve this by having Butler SOS periodically "check in" with a monitoring tool.

If the monitoring tool doesn't receive a heartbeat within the expected timeframe, it can alert you that something is wrong with Butler SOS.

## How it works

1. Butler SOS sends an HTTP request to a configured URL at regular intervals
2. The receiving tool tracks these check-ins
3. If a check-in is missed, the tool can send an alert

```text
┌─────────────┐         ┌─────────────────┐         ┌─────────────┐
│ Butler SOS  │ ──────► │ Monitoring Tool │ ──────► │   Alert     │
│             │  HTTP   │ (Healthchecks,  │ missed  │  (Email,    │
│             │  ping   │  Uptime Kuma)   │ ping    │   Slack)    │
└─────────────┘         └─────────────────┘         └─────────────┘
```

## Monitoring tools

Popular tools that work with Butler SOS heartbeats:

| Tool                                                       | Description                         |
| ---------------------------------------------------------- | ----------------------------------- |
| **[Healthchecks.io](https://healthchecks.io/)**            | Open source, self-hosted or SaaS    |
| **[Uptime Kuma](https://github.com/louislam/uptime-kuma)** | Open source, self-hosted, modern UI |

Both tools can send alerts via email, Slack, Teams, and many other channels.

## Configuration

```yaml
Butler-SOS:
  heartbeat:
    enable: true
    remoteURL: http://my.monitoring.server/some/path/
    frequency: every 1 hour
```

| Setting     | Description                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `enable`    | Enable/disable heartbeat feature                                                                                   |
| `remoteURL` | URL to ping (provided by your monitoring tool)                                                                     |
| `frequency` | How often to send heartbeats. Uses [later.js text parser](https://bunkat.github.io/later/parsers.html#text) syntax |

### Frequency examples

| Setting            | Meaning          |
| ------------------ | ---------------- |
| `every 1 hour`     | Once per hour    |
| `every 5 minutes`  | Every 5 minutes  |
| `every 30 seconds` | Every 30 seconds |

::: tip
Match the heartbeat frequency to your monitoring tool's expected check-in interval. If you send heartbeats every hour, configure the monitoring tool to alert after 1.5-2 hours of no check-ins.
:::
