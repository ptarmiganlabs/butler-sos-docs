---
outline: deep
---

# Audit.qs

Butler SOS now serves as the backend for **Audit.qs** - a comprehensive auditing solution for both Qlik Sense Enterprise on Windows and Qlik Sense Cloud.

## Overview

Audit.qs consists of a Qlik Sense extension that monitors user activity within Sense apps. When users interact with charts, make selections, or navigate between sheets, those events are captured and sent to Butler SOS for storage and analysis.

## What is Captured

Audit.qs captures detailed user activity:

- **Sheet Navigation**: Which sheets users visit and how long they stay
- **Selections**: What data selections users make
- **Visualizations**: What visualizations users view
- **Viewing Duration**: How long users look at specific objects

## Storage Destinations

Audit data can be stored in:

- **InfluxDB**: For real-time analysis in Grafana
- **QVD Files**: For direct loading into Qlik Sense
- **Parquet Files**: For long-term storage and data lake integration

## Coming Soon

Audit.qs is currently being finalized. [Contact Ptarmigan Labs](mailto:info@ptarmiganlabs.com) for more information about availability and pricing.