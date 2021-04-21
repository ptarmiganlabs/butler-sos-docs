---
title: "Setting up MQTT messaging"
linkTitle: "MQTT"
weight: 190
description: >
  Butler SOS can use MQTT as a channel for pub-sub style M2M (machine to machine) messages. This page describes how to configure MQTT in Butler SOS.
---

{{% alert title="Optional" color="primary" %}}
These settings are optional.

If you don't need the MQTT feature, just disable it and leave the default values in the config as they are.

Do note though that Butler expects the configuration properties below to exist in the config file, but will *ignore their values* if the related features are disabled.
{{% /alert %}}

## What's this?

[MQTT](https://mqtt.org/) is a light weight messaging protocol based on a publish-subscribe metaphore. It is widely used in Internet of Things and telecom sectors.

MQTT has features such as guaranteed delivery of messages, which makes it very useful for communicating between Sense and both up- and downstream source/destination systems.

Butler SOS can be configured to forward metrics and events from Sense as MQTT messages.

## Settings in main config file

```yaml
Butler-SOS:
  ...
  ...
  # MQTT config parameters
  mqttConfig:
    enable: false
    # Items below are mandatory if mqttConfig.enable=true
    brokerHost: <IP of MQTT broker/server>
    brokerPort: 1883
    baseTopic: butler-sos/          # Topic should end with /
  ...
  ...
```
