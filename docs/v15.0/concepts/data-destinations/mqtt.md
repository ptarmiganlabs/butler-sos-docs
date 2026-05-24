---
outline: deep
---

# MQTT

MQTT is a lightweight messaging protocol commonly used for IoT and machine-to-machine (M2M) communication. Butler SOS can publish metrics and events to an MQTT broker for integration with other systems.

## Why MQTT?

- **Lightweight** - Minimal overhead, efficient for high-volume messaging
- **Pub/sub model** - Decouple data producers from consumers
- **Guaranteed delivery** - QoS levels ensure messages arrive
- **Wide adoption** - Supported by IoT platforms, automation tools, and more
- **Real-time** - Events are published as they happen

## Use cases

- **Integration** - Forward Sense metrics to custom applications
- **Automation** - Trigger workflows based on Sense events
- **IoT platforms** - Connect to platforms like Home Assistant, Node-RED
- **Custom dashboards** - Build real-time displays
- **Alerting** - Route events to notification systems

## How it works

```text
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ Butler SOS  │ ──────► │ MQTT Broker │ ──────► │ Subscribers │
│             │ publish │  (Mosquitto │ deliver │  (Apps,     │
│             │         │   etc.)     │         │   tools)    │
└─────────────┘         └─────────────┘         └─────────────┘
```

1. Butler SOS connects to an MQTT broker
2. Metrics and events are published to configured topics
3. Any subscriber listening to those topics receives the messages

## Configuration

### Basic MQTT settings

```yaml
Butler-SOS:
  mqttConfig:
    enable: true
    brokerHost: mqtt.mycompany.com
    brokerPort: 1883
    baseTopic: butler-sos/
```

| Setting      | Description                                              |
| ------------ | -------------------------------------------------------- |
| `enable`     | Enable/disable MQTT publishing                           |
| `brokerHost` | Hostname or IP of the MQTT broker                        |
| `brokerPort` | Port number (default: 1883, or 8883 for TLS)             |
| `baseTopic`  | Base topic prefix for all messages (should end with `/`) |

### Per-feature MQTT settings

MQTT publishing is also controlled per feature. For example, user events:

```yaml
Butler-SOS:
  userEvents:
    enable: true
    sendToMQTT:
      enable: true
      postTo:
        everythingTopic:
          enable: true
          topic: qliksense/userevent
```

## Topics

Messages are published to topics under the base topic. Common patterns:

| Data Type      | Example Topic                       |
| -------------- | ----------------------------------- |
| Health metrics | `butler-sos/health/<server>`        |
| User events    | `butler-sos/userevent/<event-type>` |
| Log events     | `butler-sos/logevent/<source>`      |

## Message format

Messages are published as JSON, making them easy to parse:

```json
{
  "server": "sense1.company.com",
  "timestamp": "2024-01-15T10:30:00Z",
  "cpu": 15.2,
  "memory": {
    "committed": 8589934592,
    "allocated": 6442450944,
    "free": 2147483648
  }
}
```

## MQTT brokers

Popular MQTT broker options:

| Broker        | Description                                   |
| ------------- | --------------------------------------------- |
| **Mosquitto** | Open source, lightweight, easy to set up      |
| **HiveMQ**    | Enterprise features, cloud offering available |
| **EMQX**      | High performance, scalable                    |
| **RabbitMQ**  | Full-featured message broker with MQTT plugin |

## Example: Mosquitto setup

Quick Docker setup for testing:

```bash
docker run -d \
  --name mosquitto \
  -p 1883:1883 \
  -p 9001:9001 \
  eclipse-mosquitto
```

Then configure Butler SOS:

```yaml
Butler-SOS:
  mqttConfig:
    enable: true
    brokerHost: localhost
    brokerPort: 1883
    baseTopic: butler-sos/
```

## Subscribing to messages

Use any MQTT client to subscribe. Example with `mosquitto_sub`:

```bash
mosquitto_sub -h localhost -t "butler-sos/#" -v
```

This subscribes to all Butler SOS topics and prints messages as they arrive.
