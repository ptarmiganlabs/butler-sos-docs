---
outline: deep
---

# Data Destinations

Butler SOS can send metrics and events to multiple destinations, giving you flexibility in how you store and visualize your Qlik Sense monitoring data.

## Available destinations

| Destination                    | Type                 | Use Case                                                          |
| ------------------------------ | -------------------- | ----------------------------------------------------------------- |
| **[InfluxDB](./influxdb)**     | Time-series database | Most common choice. Store metrics locally, visualize with Grafana |
| **[Prometheus](./prometheus)** | Metrics scraping     | Cloud-native environments, Kubernetes deployments                 |
| **[New Relic](./new-relic)**   | SaaS observability   | No infrastructure to manage, powerful built-in analytics          |
| **[MQTT](./mqtt)**             | Message broker       | Integration with other systems, IoT scenarios                     |

## Choosing a destination

### InfluxDB + Grafana (Recommended for most users)

The most popular setup. You run InfluxDB and Grafana locally (or in Docker), giving you:

- Full control over data retention
- Highly customizable dashboards
- No ongoing costs beyond hosting
- Works offline / in air-gapped environments

### Prometheus + Grafana

Ideal if you already use Prometheus in your organization:

- Pull-based metrics (Prometheus scrapes Butler SOS)
- Native integration with Kubernetes and cloud platforms
- Powerful query language (PromQL)
- Alerting capabilities

### New Relic

Best when you want zero infrastructure management:

- No databases to manage
- Built-in dashboards and alerting
- Generous free tier
- Enterprise-grade scalability

### MQTT

Use MQTT when you need to integrate with other systems:

- Forward metrics to custom applications
- Integrate with IoT platforms
- Build event-driven workflows
- Real-time data streaming

## Multiple destinations

Butler SOS can send data to multiple destinations simultaneously. For example, you might:

- Store metrics in InfluxDB for Grafana dashboards
- Forward events to MQTT for integration with other tools
- Send data to New Relic for team members who prefer their interface

Each destination is configured independently in the Butler SOS config file.
