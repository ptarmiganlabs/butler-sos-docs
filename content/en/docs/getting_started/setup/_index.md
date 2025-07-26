---
title: "Setup"
linkTitle: "Setup"
weight: 50
description: >
  Everything you wanted to know about Butler SOS configuration but never dared to ask.
---

## New in Butler SOS 11.2

Butler SOS 11.2 introduces important new configuration options for enhanced security and operational flexibility:

### systemInfo Configuration Setting

The new `Butler-SOS.systemInfo.enable` setting allows you to control whether Butler SOS gathers detailed system information about the host it's running on. This setting addresses enterprise security concerns where the underlying `systeminformation` npm package executes OS commands that may be flagged by security monitoring tools.

**Key points:**
- **Default value:** `true` (maintains backward compatibility)
- **Security consideration:** Set to `false` in environments where OS command execution is restricted
- **Telemetry dependency:** If telemetry is enabled, systemInfo must also be enabled

For detailed configuration information, see the [Configuration File Format](/docs/reference/config_file_format/) reference.

### Conditional Validation

Butler SOS 11.2 also introduces conditional validation, meaning that configuration settings for disabled features are no longer validated. This allows you to leave placeholder values from production templates for features you have disabled without encountering validation errors.

