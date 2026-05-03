---
outline: deep
---

# Audit.qs Events

Audit.qs events provide detailed insights into user activity within Qlik Sense apps.

## Event Types

Audit.qs captures several types of events:

### Sheet Navigation Events

Track when users move between sheets in a Sense app. Includes:
- Sheet ID and name
- Timestamp
- User information

### Selection Events

Capture user selections in visualizations:
- Field name and selected values
- Timestamp
- Correlation ID for linking to other events

### Visualization Events

Record when visualizations are rendered:
- Object ID and type
- Rendering completion time
- Session information

## Monitoring in Grafana

Audit.qs data stored in InfluxDB can be visualized in Grafana dashboards. Common visualizations include:

- User activity over time
- Most viewed sheets
- Popular visualizations
- Session duration metrics

## Coming Soon

Audit.qs integration documentation will be expanded when the feature is publicly released. [Contact Ptarmigan Labs](mailto:info@ptarmiganlabs.com) for more information.