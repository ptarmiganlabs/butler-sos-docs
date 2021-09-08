---
title: Telemetry
linkTitle: Telemetry
weight: 70
description: >
  What's telemetry and why is it important?
---

{{% pageinfo %}}
Sharing telemetry data from Butler SOS is optional.  
You can use all Butler SOS features without sharing telemetry data.

That said, if you find the Butler SOS tool useful you are **strongly encouraged** to leave the telemetry feature turned on.  
Having access to this data greatly helps the Butler developers when they design new features, fix bugs etc.

The Butler SOS developers care about you - sharing telemetry data is your way of showing you care about them.

Sharing is caring!

{{% /pageinfo %}}

## What's telemetry

From [Wikipedia](https://en.wikipedia.org/wiki/Telemetry):

_Telemetry is the in situ collection of measurements or other data at remote points and their automatic transmission to receiving equipment (telecommunication) for monitoring._

In the context of software tools (including Butler) telemetry is often used to describe the process of sending information about the tool itself to some monitoring system.

## Why telemetry in Butler SOS

This is a very, very good question.

For several years there was no telemetry at all in Butler SOS.

Development of new features were driven mainly by what features were needed at the time.  
Or the fact that Qlik released some new feature in Sense and Butler SOS was a way to test that new feature from the perspective of the Sense APIs.

That's all good but today Butler SOS is a rather significant tool with features spanning monitoring, alerting and more..

This multitude of features is also one of the core reasons for adding telemetry to Butler SOS:

{{% pageinfo color="info" %}}

- Which Butler SOS features are actually used out there?
- Which operating systems, Node.js versions and hardware platforms is Butler SOS running on?
  {{% /pageinfo %}}

Without this information the Butler SOS developers will keep working in the dark, not really knowing where to focus their efforts.

On the other hand - **with** access to telemetry data a lot of possibilities open up for the Butler SOS developers:

- If telemetry shows that no one uses a particular feature, maybe that feature should be scheduled for deprecation?
- The opposite of the previous: If lots of users use a specific Butler SOS feature, then that feature is a candidate for future focus and development.
- Telemetry will show if lots of users run Butler SOS on old Node.js versions. Knowing this its possible to set a migration schedule for what Node.js versions are supported - avoiding hard errors when some old Node.js version is no longer supported by Butler SOS.
- Same thing for understanding what operating systems Butler SOS runs (and should be supported) on.

### Configuring Butler SOS' telemetry

Instructions [here](/docs/getting_started/setup/telemetry/).

## The details

{{% alert title="What's shared" color="primary" %}}
The telemetry data includes the following:

1. **Information about what features are enabled and which are disabled.**  
   _Why: This tells the Butler SOS developers which features are used and which aren't. This is critical information when it comes to planning where to focus future development efforts._
2. **Information about Butler's execution environment** (operating system, hardware architecture, Node.js version etc).  
    _Why: Ideally the Butler SOS developers want to use as modern versions of Node.js as possible. But if telemetry shows that lots os Butler SOS instances use old Node.js versions or run on some (yet) untested/unverified Linux version - then maybe those older Node.js/Linux versions must be supported for yet some time._
   {{% /alert %}}

{{% alert title="What's not shared" color="warning" %}}
The telemetry data will never include:

1. Data that can identify your Sense environment or the server on which Butler SOS runs. This includes IP/MAC addresses or other network information, server names, Docker container metadata or similar.
2. Any actual data handled by Butler SOS (user IDs, app names, number of users in your system etc).
3. Qlik Sense or other certificates in any shape or form.
   {{% /alert %}}

### Where is telemetry data sent

The telemetry data is sent to an Azure server and then stored in a database operated by [Ptarmigan Labs](https://ptarmiganlabs.com) (which is the company sponsoring the Butler SOS project).

### Deleting telemetry data

Even though no-one (not even Ptarmigan Labs who runs the telemetry database!) has any way of ever connecting the data sent by _your_ Butler SOS instance to _you_ (it's all anonymized, remember?), there can be cases where telemetry data must be deleted.

The [legal page](/docs/legal_stuff/#telemetry-data) has more information about this.

### Field level description of telemetry data

A telemetry message from Butler SOS contains the information below.

```json
{
  "ts": "2021-04-16T13:43:02.467Z",
  "data": {
    "service": "butler-sos",
    "serviceVersion": "5.6.0",
    "system": {
      "id": "8e315a90cac0e447360697123002f23b2775cc61f93d6bc7a9138d94af057e5e",
      "arch": "x64",
      "platform": "darwin",
      "release": "11.2.2",
      "distro": "macOS",
      "codename": "macOS Big Sur",
      "virtual": false,
      "nodeVersion": "v14.15.4"
    },
    "enabledFeatures": {
      "feature": {
        "heartbeat": true,
        "dockerHealthCheck": false,
        "uptimeMonitor": true,
        "uptimeMonitor_storeInInfluxdb": true,
        "udpServer": true,
        "logdb": true,
        "mqtt": true,
        "influxdb": true,
        "prometheus": true,
        "appNames": true,
        "userSessions": true
      }
    }
  }
}
```

#### The anonymous ID field

The `id` field deserves a bit more explanation.  

It's purpose is to uniquely identify the Butler SOS instance - nothing else.  
If Butler SOS is stopped and started agagin the same ID should be generated.

Some sensitive information is used to create the ID, but as the ID is anonymized before sent as part of the telemetry data, *no sensitive information leaves your servers*.  

The ID field is created as follows:

1. Combine the following information to a single string
   1. MAC address of default network interface
   2. IPv4 address of default network interface
   3. IP or FQDN of Sense server where repository service is running
   4. System unique ID as reported by the OS. Not all OSs support this though, which is why field 1-3 above are also needed to get a unique ID.
2. Run the created string through a [one-way hashing/message digest function](https://en.wikipedia.org/wiki/Cryptographic_hash_function).
   Butler SOS uses Node.js' own [Crypto](https://nodejs.org/docs/latest-v15.x/api/crypto.html) library to create a [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hash, using the default network interface's MAC address as salt.  
   Security is increased due to the fact that the salt never leaves the server where Butler is running.

   The bottom line is that it's impossible to reverse the process and get the IP, host name etc used in step 1 above.  
   Then again - this is cryptografy and things change.  
   But if you trust the certificates securing Sense itself, then the ID anonymization in Butler SOS should be ok too. Both are built on the same concepts of one-way cryptographic functions.
3. The result is a string that uniquely identifies the Butler SOS instance at hand, without giving away any sensitive data about the system where Butler is running.

See above for an example of what the `id` field looks like.  
The `id` field is always shown during Butler startup.

## Telemetry FAQ

1. **_What data is included in the telemetry messages?_**  
   See above.  
   The telemetry includes information about which Butler SOS features are enabled vs disabled.
   A unique, anonymized ID is included too, it's unique to each Butler SOS instance and is used soley to distinguish between different Butler SOS instances.  
   Finally some information about Butler SOS's execution environment is included. Things like operating system, Node.js version used etc.

2. **_Can my Sense environment be identified via telemetry data?_**  
   Short answer: No.  
   Longer answer: No information about your Sense environment is sent as part of telemetry. No IP addresses or server names, no IDs of Sense apps/tasks/etc, no information about what actual data passed through Butler SOS, or any other data that can be linked to your Sense environment is included in the telemetry data.
