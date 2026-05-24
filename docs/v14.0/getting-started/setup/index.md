---
outline: deep
---

# Setup

Everything you need to know about Butler SOS configuration.

## Overview

Once Butler SOS is [installed](/v14.0/getting-started/install/), you need to configure it to work with your Qlik Sense environment.

Butler SOS uses a YAML configuration file that controls all aspects of its operation. The configuration file is comprehensive and allows you to:

- Connect to your Qlik Sense server(s)
- Configure which metrics to collect
- Set up data destinations (InfluxDB, Prometheus, New Relic, MQTT)
- Enable/disable various features
- Configure logging and monitoring of Butler SOS itself

## Butler SOS 12.0 Features

Butler SOS 12.0 includes important configuration options for enhanced security and operational flexibility:

### systemInfo Configuration Setting

The `Butler-SOS.systemInfo.enable` setting allows you to control whether Butler SOS gathers detailed system information about the host it's running on. This setting addresses enterprise security concerns where the underlying `systeminformation` npm package executes OS commands that may be flagged by security monitoring tools.

**Key points:**

- **Default value:** `true` (maintains backward compatibility)
- **Security consideration:** Set to `false` in environments where OS command execution is restricted
- **Telemetry dependency:** If telemetry is enabled, systemInfo must also be enabled

For detailed configuration information, see the [Configuration File Format](/v14.0/reference/config-file-format) reference.

### Conditional Validation

Butler SOS 12.0 also introduces conditional validation, meaning that configuration settings for disabled features are no longer validated. This allows you to leave placeholder values from production templates for features you have disabled without encountering validation errors.

## Configuration Topics

The setup section is organized into the following topics:

### Basic Configuration

- [Which Config File?](/v14.0/getting-started/setup/which-config-file) - How Butler SOS selects its configuration file
- [Verify Config File](/v14.0/getting-started/setup/verify-config-file) - How to validate your configuration
- [Config Visualization](/v14.0/getting-started/setup/config-visualization) - Visualize the active configuration
- [Logging](/v14.0/getting-started/setup/logging) - Configure Butler SOS logging
- [Crash Dump](/v14.0/getting-started/setup/crash-dump) - Configure crash dump file creation

### Monitoring & Health

- [Heartbeats](/v14.0/getting-started/setup/heartbeats) - Send heartbeat messages to monitoring tools
- [Docker Healthcheck](/v14.0/getting-started/setup/docker-healthcheck) - Docker container health checks
- [Uptime Monitor](/v14.0/getting-started/setup/uptime-monitor) - Track Butler SOS uptime and memory usage

### Qlik Sense Connection

- [Sense Server Settings](/v14.0/getting-started/setup/sense-server-settings) - Connect to Qlik Sense
- [Audit Screenshots](/v14.0/getting-started/setup/audit-screenshots) - Configure Audit.qs screenshot downloads, ticket auth, and allowed hosts
- [Servers to Monitor](/v14.0/getting-started/setup/servers-to-monitor) - Configure which servers to monitor
- [App Names](/v14.0/getting-started/setup/app-names) - Configure app name extraction
- [User Sessions](/v14.0/getting-started/setup/user-sessions) - Configure user session monitoring

### Data Destinations

- [InfluxDB](/v14.0/getting-started/setup/influxdb) - Store metrics in InfluxDB
- [Prometheus](/v14.0/getting-started/setup/prometheus) - Expose metrics for Prometheus
- [New Relic](/v14.0/getting-started/setup/new-relic) - Send data to New Relic
- [MQTT](/v14.0/getting-started/setup/mqtt) - Publish metrics via MQTT
- [Credentials](/v14.0/getting-started/setup/credentials) - Manage third-party service credentials

### Qlik Sense Events

- [Qlik Sense Events Overview](/v14.0/getting-started/setup/qlik-sense-events/) - General event settings
- [Log Events](/v14.0/getting-started/setup/qlik-sense-events/log-events) - Capture log events
- [Performance Log Events](/v14.0/getting-started/setup/qlik-sense-events/performance-log-events) - Detailed engine performance data
- [User Events](/v14.0/getting-started/setup/qlik-sense-events/user-events) - Track user activity

### Other Settings

- [Error Tracking](/v14.0/getting-started/setup/error-tracking) - Track and log errors across Butler SOS
- [Telemetry](/v14.0/getting-started/setup/telemetry) - Anonymous telemetry configuration
