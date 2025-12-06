---
outline: deep
---

# New Relic Dashboards

New Relic is a complete SaaS product that offers both data storage and powerful, yet easy to set up and use visualizations.

## Overview

In this dashboard most of the data comes from Butler SOS, but the failed reload pie chart and table at the top are created using data from the [Butler](https://butler.ptarmiganlabs.com) tool.

New Relic does not give you nearly the same level control as Grafana does, for example when it comes to fine-tuning visual details of charts, tables etc.

That can feel a bit limiting at first, but as New Relic's query language is very powerful and is very well integrated in the chart editor, it's not really a problem.
A benefit of New Relic's dashboards is that their dashboard editor very effectively guides you through the creation of charts, using the various kinds of data (metrics, events, logs) you have sent - and are sending - to their database.

## Sample Dashboards

The following screenshots show a New Relic dashboard with data from both Butler SOS and Butler:

![New Relic Dashboard Part 1](/img/examples/new-relic-dashboard-1.png)
_New Relic dashboard with data from both Butler SOS and Butler (part 1)._

![New Relic Dashboard Part 2](/img/examples/new-relic-dashboard-2.png)
_New Relic dashboard with data from both Butler SOS and Butler (part 2)._

![Failed Reload Logs](/img/examples/new-relic-dashboard-3.png)
_Viewing failed reload logs from within New Relic can save lots of time when investigating incidents._

## Key Features

New Relic dashboards offer several advantages:

- **Integrated data exploration** - Query language is tightly integrated with the chart editor
- **Multiple data types** - Work with metrics, events, and logs in a unified interface
- **Guided dashboard creation** - The editor helps you discover and use your data effectively
- **SaaS convenience** - No infrastructure to manage for the visualization layer

## Getting Started

To use New Relic with Butler SOS:

1. Set up Butler SOS to send data to New Relic (see [Data Destinations: New Relic](/docs/concepts/data-destinations/new-relic))
2. Log in to your New Relic account
3. Create a new dashboard and add charts using the query builder
4. Use NRQL (New Relic Query Language) to query Butler SOS metrics

## Related Topics

- [Data Destinations: New Relic](/docs/concepts/data-destinations/new-relic) - Configuration details
- [Available Metrics: New Relic](/docs/reference/available-metrics/new-relic) - Metrics reference
