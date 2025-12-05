---
outline: deep
---

# User Agents

Butler SOS tracks the user agents of all users accessing your Qlik Sense environment, providing real-time insights into what operating systems and browsers are being used.

## What is a user agent?

A user agent is a string that web browsers send to servers identifying themselves. It typically contains information about:

- **Browser** - Name and version (Chrome, Firefox, Edge, Safari, etc.)
- **Operating system** - Name and version (Windows, macOS, Linux, iOS, Android, etc.)
- **Device type** - Desktop, mobile, tablet

## Why track user agents?

Understanding what clients are used to access Sense helps with:

- **Compatibility planning** - Know which browsers to test and support
- **Security** - Identify outdated or potentially vulnerable browsers
- **Troubleshooting** - Correlate issues with specific browser/OS combinations
- **Usage patterns** - Understand if users access from mobile devices

## How it works

User agent information is captured as part of [user events](./user-events):

1. When a user connects to Qlik Sense, the browser sends its user agent string
2. Qlik Sense logs this information as part of the session start event
3. Butler SOS receives the event and parses the user agent string
4. The parsed data is stored with fields for browser name, version, OS, etc.

## Data captured

For each user event with user agent information, Butler SOS extracts:

| Field                 | Example |
| --------------------- | ------- |
| Browser name          | Chrome  |
| Browser major version | 119     |
| OS name               | Windows |
| OS version            | 10      |

## Configuration

User agent tracking is automatically enabled when [user events](./user-events) are configured. No additional configuration is needed.

The user agent data is included as tags in the user event data sent to InfluxDB and New Relic.

### InfluxDB tags

When user events include browser user agent information, the following tags are added:

- `qs_uaBrowserName` - Browser name
- `qs_uaBrowserMajorVersion` - Browser major version
- `qs_uaOsName` - Operating system name
- `qs_uaOsVersion` - Operating system version

### New Relic attributes

The same information is added as attributes in New Relic:

- `qs_uaBrowserName`
- `qs_uaBrowserMajorVersion`
- `qs_uaOsName`
- `qs_uaOsVersion`

## Grafana visualization

You can create Grafana dashboards to visualize user agent data:

- **Pie charts** - Distribution of browsers or operating systems
- **Tables** - Detailed breakdown of browser/OS combinations
- **Time series** - Trends in browser usage over time

Example Grafana queries for InfluxDB:

```sql
-- Browser distribution
SELECT count("value") FROM "user_events"
WHERE $timeFilter
GROUP BY "qs_uaBrowserName"

-- OS distribution
SELECT count("value") FROM "user_events"
WHERE $timeFilter
GROUP BY "qs_uaOsName"
```

## Related concepts

- [User Events](./user-events) - How user agent data is captured
- [User Sessions](./user-sessions) - Session tracking overview
