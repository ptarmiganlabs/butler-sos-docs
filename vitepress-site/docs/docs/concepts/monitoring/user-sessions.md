---
outline: deep
---

# User Sessions

Butler SOS provides detailed tracking of user sessions across your Qlik Sense environment.

## What are user sessions?

A _session_, or more precisely a _proxy session_, starts when a user logs into Qlik Sense and ends when the user logs out or the session inactivity timeout is reached.

::: tip Session events
Sessions can _start_ and _stop_. They can also _timeout_ if the user is inactive long enough (the exact time depends on settings in the QMC).
:::

### Session behavior

- **Same browser** - As long as a user uses the same web browser (without incognito mode), they will reuse the same session for all access to Sense.
- **Multiple browsers** - Using different browsers, incognito mode, etc. will result in multiple sessions for the same user.
- **Session limits** - There is a [limit to how many sessions](https://community.qlik.com/t5/Knowledge-Base/Increase-max-parallel-SessionCount-for-Qlik-Sense-end-user/ta-p/1717086) a user can have at any given time.
- **Mashups** - Scenarios where Sense objects are embedded into web apps may result in multiple sessions, depending on how the mashup was created.

A good overview of what constitutes a session is found [in this Qlik Community article](https://community.qlik.com/t5/Knowledge-Base/How-to-count-sessions-in-Qlik-Sense/ta-p/1714209).

### Proxy sessions vs engine sessions

| Session Type       | Description                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| **Proxy session**  | Created when a user connects to Qlik Sense (assuming they have permissions) |
| **Engine session** | Created when interacting with individual charts in a Sense app              |

A user typically has one (or a few) proxy sessions and then a larger number of transient engine sessions.

More info in the [Qlik documentation](https://help.qlik.com/en-US/sense-developer/May2024/Subsystems/Platform/Content/Sense_PlatformOverview/Concepts/sessions.htm).

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

## Related concepts

- [User Events](./user-events) - Real-time session start/stop events
- [Sessions & Connections](/docs/concepts/sessions%20connections/) - Deeper dive into session concepts
