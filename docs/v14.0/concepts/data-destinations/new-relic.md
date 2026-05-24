---
outline: deep
---

# New Relic

New Relic is a SaaS observability platform that can receive metrics and events from Butler SOS. This eliminates the need to run your own InfluxDB and Grafana instances.

## Why New Relic?

- **No infrastructure** - No databases or visualization tools to manage
- **Built-in dashboards** - Create dashboards directly in New Relic
- **Alerting** - Configure alerts without additional tools
- **Free tier** - Generous free tier for smaller deployments
- **Enterprise scale** - Handles large data volumes effortlessly

## Trade-offs

| New Relic                                   | InfluxDB + Grafana                 |
| ------------------------------------------- | ---------------------------------- |
| ✅ No infrastructure to manage              | ✅ Full control over data          |
| ✅ Quick setup                              | ✅ No external dependencies        |
| ✅ Built-in alerting                        | ✅ Works offline / air-gapped      |
| ⚠️ Commercial service (free tier available) | ✅ No ongoing costs beyond hosting |
| ⚠️ Less customization                       | ✅ Highly customizable             |

## Data sent to New Relic

Butler SOS can send:

- **Metrics** - Health metrics from Qlik Sense servers
- **Events** - User events, log events
- **Attributes** - Tags/dimensions for filtering and grouping

## Configuration

```yaml
Butler-SOS:
  newRelic:
    enable: true
    event:
      url: https://insights-collector.eu01.nr-data.net
      header:
        - name: X-My-Header
          value: Header value
      attribute:
        static:
          - name: service
            value: butler-sos
          - name: environment
            value: prod
        dynamic:
          butlerSosVersion:
            enable: true

    metric:
      destinationAccount:
        - First NR account
        - Second NR account
      url: https://insights-collector.eu01.nr-data.net/metric/v1
      header:
        - name: X-My-Header
          value: Header value
      dynamic:
        engine:
          memory:
            enable: true
          cpu:
            enable: true
          calls:
            enable: true
          selections:
            enable: true
          sessions:
            enable: true
          users:
            enable: true
          saturated:
            enable: true
        apps:
          docCount:
            enable: true
        cache:
          cache:
            enable: true
        proxy:
          sessions:
            enable: true
      attribute:
        static:
          - name: service
            value: butler-sos
          - name: environment
            value: prod
        dynamic:
          butlerSosVersion:
            enable: true
```

## API endpoints

New Relic has different API endpoints depending on your account region:

| Region | Event API                                     | Metric API                                              |
| ------ | --------------------------------------------- | ------------------------------------------------------- |
| **EU** | `https://insights-collector.eu01.nr-data.net` | `https://insights-collector.eu01.nr-data.net/metric/v1` |
| **US** | `https://insights-collector.newrelic.com`     | `https://metric-api.newrelic.com/metric/v1`             |

::: warning
Do not include the URL path in the event URL setting - only the base URL.
:::

## Metrics control

You can enable/disable specific metric categories:

| Category            | Metrics included                                                   |
| ------------------- | ------------------------------------------------------------------ |
| `engine.memory`     | `qs_memCommited`, `qs_memAllocated`, `qs_memFree`                  |
| `engine.cpu`        | `qs_cpuTotal`                                                      |
| `engine.calls`      | `qs_engineCalls`                                                   |
| `engine.selections` | `qs_engineSelections`                                              |
| `engine.sessions`   | `qs_engineSessionsActive`, `qs_engineSessionsTotal`                |
| `engine.users`      | `qs_engineUsersActive`, `qs_engineUsersTotal`                      |
| `engine.saturated`  | `qs_engineSaturated`                                               |
| `apps.docCount`     | `qs_docsActiveCount`, `qs_docsLoadedCount`, `qs_docsInMemoryCount` |
| `cache.cache`       | `qs_cacheHits`, `qs_cacheLookups`, `qs_cacheAdded`, etc.           |
| `proxy.sessions`    | Proxy session metrics                                              |

## Attributes (tags)

Attributes help you filter and group data in New Relic.

### Static attributes

Define fixed key-value pairs in the config file:

```yaml
attribute:
  static:
    - name: environment
      value: production
    - name: datacenter
      value: eu-west-1
```

### Dynamic attributes

Automatically added based on the data:

- `butlerSosVersion` - Butler SOS version (optional)
- Various `qs_*` attributes based on enabled metric categories

::: tip
Static attributes defined later in the list will overwrite earlier ones with the same name. Avoid using names that conflict with dynamic attributes.
:::
