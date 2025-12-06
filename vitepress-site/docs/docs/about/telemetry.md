# Telemetry

:::info Optional Feature
Sharing telemetry data from Butler SOS is optional.  
You can use all Butler SOS features without sharing telemetry data.

That said, if you find Butler SOS useful you are **strongly encouraged** to leave the telemetry feature turned on.  
Having access to this data greatly helps the Butler SOS developers when they design new features, fix bugs etc.

The Butler SOS developers care about you - sharing telemetry data is your way of showing you care about them.

**Sharing is caring!**
:::

## What's Telemetry

From [Wikipedia](https://en.wikipedia.org/wiki/Telemetry):

_Telemetry is the in situ collection of measurements or other data at remote points and their automatic transmission to receiving equipment (telecommunication) for monitoring._

In the context of software tools (including Butler SOS) telemetry is often used to describe the process of sending information about the tool itself to some monitoring system.

## Why Telemetry in Butler SOS?

This is a good question.

For several years there was no telemetry at all in Butler SOS.

Development of new features were driven mainly by what features were needed at the time.  
Or the fact that Qlik released some new feature in Sense and Butler SOS was a way to test that new feature from the perspective of the Sense APIs.

That's all good but today Butler SOS is a rather significant tool with features spanning monitoring, alerting and more.

This multitude of features is also one of the core reasons for adding telemetry to Butler SOS:

:::info Key Questions

- Which Butler SOS features are actually used out there?
- Which operating systems, Node.js versions and hardware platforms is Butler SOS running on?

:::

Without this information the Butler SOS developers will keep working in the dark, not really knowing where to focus their efforts.

On the other hand - **with** access to telemetry data a lot of possibilities open up for the Butler SOS developers:

- If telemetry shows that no one uses a particular feature, maybe that feature should be scheduled for deprecation?
- The opposite of the previous: If lots of users use a specific Butler SOS feature, then that feature is a candidate for future focus and development.
- Telemetry will show if lots of users run Butler SOS on old Node.js versions. Knowing this it's possible to set a migration schedule for what Node.js versions are supported - avoiding hard errors when some old Node.js version is no longer supported by Butler SOS.
- Same thing for understanding what operating systems Butler SOS runs (and should be supported) on.

## Configuration

Telemetry can be enabled/disabled in the Butler SOS configuration file using the `Butler-SOS.anonTelemetry` setting. See the [configuration file format reference](/docs/reference/config-file-format) for details.

### System Information Dependency

:::warning Important
**Butler SOS telemetry requires system information gathering to be enabled.**

Starting with Butler SOS 12.0.0, there is a configuration option `Butler-SOS.systemInfo.enable` that controls whether detailed system information is gathered. This information is required for telemetry to function properly.

- If you enable telemetry (`anonTelemetry: true`) but disable system information gathering (`systemInfo.enable: false`), Butler SOS will show an error and refuse to start.
- If your organization's security policies prevent OS command execution, you must disable both telemetry and system information gathering.

More details about the systemInfo setting can be found in the [configuration file documentation](/docs/reference/config-file-format).
:::

## The Details

:::tip What's Shared
The telemetry data includes the following:

1. **Information about what features are enabled and which are disabled.**  
   _Why: This tells the Butler SOS developers which features are used and which aren't.  
   This is critical information when it comes to planning where to focus future development efforts._

2. **Information about Butler SOS's execution environment** (operating system, hardware architecture, Node.js version etc).  
   _Why: Ideally the Butler SOS developers want to use as modern versions of Node.js as possible. But if telemetry shows that lots of Butler SOS instances use old Node.js versions or run on some (yet) untested/unverified Linux version - then maybe those older Node.js/Linux versions must be supported for yet some time._

:::

:::warning What's NOT Shared
The telemetry data will never include:

1. Data that can identify your Sense environment or the server on which Butler SOS runs. This includes IP/MAC addresses or other network information, server names, Docker container metadata or similar.
2. Any actual data handled by Butler SOS (user IDs, app names, number of users in your system etc).
3. Qlik Sense or other certificates in any shape or form.

:::

### Where is Telemetry Data Sent

Butler SOS uses PostHog to collect telemetry data.

PostHog is an open source telemetry platform that is used by many open source projects.  
The data is stored in the EU.

### Deleting Telemetry Data

Even though no-one (not even Ptarmigan Labs who runs the telemetry database!) has any way of ever connecting the data sent by _your_ Butler SOS instance to _you_ (it's all anonymized, remember?), there can be cases where telemetry data must be deleted.

The [legal page](/docs/legal-stuff#telemetry-data) has more information about this.

## Field Level Description

A telemetry message from Butler SOS contains the information below:

```json
{
  "system": {
    "id": "62f221c94dc72823ebba9488a74006ccf69da8f8c6cfaa896a60d9a02186cc2e",
    "arch": "x64",
    "platform": "linux",
    "release": "22.04.4 LTS",
    "distro": "Ubuntu",
    "codename": "jammy",
    "virtual": true,
    "isRunningInDocker": false,
    "nodeVersion": "v20.15.0"
  },
  "enabledFeatures": {
    "feature": {
      "heartbeat": true,
      "dockerHealthCheck": true,
      "uptimeMonitor": true,
      "uptimeMonitorNewRelic": false,
      "udpServer": true,
      "eventCount": true,
      "rejectedEventCount": true,
      "userEvents": true,
      "userEventsMQTT": true,
      "userEventsInfluxdb": true,
      "userEventsNewRelic": false,
      "logEventsProxy": true,
      "logEventsScheduler": true,
      "logEventsRepository": true,
      "logEventCategorise": true,
      "logEventCategoriseRuleCount": 4,
      "logEventCategoriseRuleDefault": true,
      "logEventEnginePerformanceMonitor": true,
      "logEventEnginePerformanceMonitorNameLookup": true,
      "logEventEnginePerformanceMonitorTrackRejected": true,
      "logEventsMQTT": true,
      "logEventsInfluxdb": true,
      "logEventsNewRelic": false,
      "logdb": false,
      "mqtt": true,
      "newRelic": false,
      "prometheus": true,
      "influxdb": true,
      "influxdbVersion": 2,
      "appNames": true,
      "userSessions": true
    }
  }
}
```

### The Anonymous ID Field

The `id` field deserves a bit more explanation.

Its purpose is to uniquely identify the Butler SOS instance - nothing else.  
If Butler SOS is stopped and started again the same ID will be used.  
If reinstalled on a new server, or if the server's network configuration changes, a new ID will be created.

Some sensitive information is used to create the ID, but as the ID is anonymized before sent as part of the telemetry data, _no sensitive information leaves your servers_.

The ID field is created as follows:

1. Combine the following information to a single string:

   - MAC address of default network interface
   - IPv4 address of default network interface
   - IP or FQDN of Sense server where repository service is running
   - System unique ID as reported by the OS. Not all OSs support this though, which is why the fields above are also needed to get a unique ID.

2. Run the created string through a [one-way hashing/message digest function](https://en.wikipedia.org/wiki/Cryptographic_hash_function).  
   Butler SOS uses Node.js' own [Crypto](https://nodejs.org/docs/latest-v15.x/api/crypto.html) library to create a [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hash, using the default network interface's MAC address as salt.  
   Security is increased due to the fact that the salt never leaves the server where Butler SOS is running.

   The bottom line is that it's impossible to reverse the process and get the IP, host name etc used in step 1 above.  
   Then again - this is cryptography, and there are no guarantees.  
   But if you trust the certificates securing Sense itself, then the ID anonymization in Butler SOS should be ok too. Both are built on the same concepts of one-way cryptographic functions.

3. The result is a string that uniquely identifies the Butler SOS instance at hand, without giving away any sensitive data about the system where Butler SOS is running.

The `id` field is always shown during Butler SOS startup.

### System Information Fields

The `system` section in the telemetry data contains information about Butler SOS's execution environment. This data is collected using the `systeminformation` npm package, which executes various OS commands to gather detailed host information.

**Important**: The collection of this system information can be controlled via the `Butler-SOS.systemInfo.enable` configuration setting. If system information gathering is disabled for security reasons, telemetry cannot function and must also be disabled. Butler SOS will refuse to start if telemetry is enabled but system information gathering is disabled.

## Telemetry FAQ

1. **What data is included in the telemetry messages?**  
   See above.  
   The telemetry includes information about which Butler SOS features are enabled vs disabled.
   A unique, anonymized ID is included too, it's unique to each Butler SOS instance and is used solely to distinguish between different Butler SOS instances.  
   Finally some information about Butler SOS's execution environment is included. Things like operating system, Node.js version used etc.

2. **Can my Sense environment be identified via telemetry data?**  
   Short answer: No.  
   Longer answer: No information about your Sense environment is sent as part of telemetry. No IP addresses or server names, no IDs of Sense apps/tasks/etc, no information about what actual data passed through Butler SOS, or any other data that can be linked to your Sense environment is included in the telemetry data.
