---
outline: deep
---

# User Sessions

Butler SOS can poll Qlik Sense servers to retrieve a snapshot of currently active user sessions.

This is different from [User Events](./user-events), which provides real-time notifications when sessions start and stop.

::: tip Polling vs Events
**User Sessions** = Periodic snapshots of who is connected right now  
**User Events** = Real-time stream of session start/stop activity
:::

For background on what sessions are and how they work, see [Sessions & Connections](/docs/concepts/sessions%20connections/).

## What data is collected?

For each virtual proxy configured for monitoring, Butler SOS tracks:

- Total session count
- Per-user session information (optional)
- Session details including user directory and user ID

## Configuration

User session monitoring is configured in two places in the config file:

### 1. General settings

```yaml
Butler-SOS:
  userSessions:
    enableSessionExtract: true # Query unique user IDs with open sessions
    pollingInterval: 30000 # How often (ms) to poll session data
    excludeUser: # Optional blacklist of users to ignore
      - directory: LAB
        userId: testuser1
```

### 2. Per-server settings

For each monitored server, specify which virtual proxies to monitor:

```yaml
Butler-SOS:
  serversToMonitor:
    servers:
      - host: sense1.company.com
        userSessions:
          enable: true
          host: sense1.company.com:4243
          virtualProxies:
            - virtualProxy: /
            - virtualProxy: /sales
```

::: warning Important
You need to configure both the general `userSessions` section AND the per-server `userSessions` settings to get user session data.
:::

## Use cases

Session data is valuable for:

- **Capacity planning** - Understanding peak usage times and user load
- **License management** - Tracking concurrent users
- **Troubleshooting** - Identifying which users had active sessions when issues occurred
- **Server maintenance** - Knowing which users will be affected by a server restart
