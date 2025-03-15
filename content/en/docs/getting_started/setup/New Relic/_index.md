---
title: "Setting up the New Relic integration"
linkTitle: "New Relic"
weight: 135
description: >
  Butler SOS can send metrics and events to New Relic.  

  This way it's possible use their SaaS solution for storing and visualizing Butler SOS data.
---

{{% alert title="Optional" color="primary" %}}
These settings are optional.

If you don't need the New Relic feature, just disable it and leave the default values in the config as they are.

Do note though that Butler expects the configuration properties below to exist in the config file, but will _ignore their values_ if the related features are disabled.
{{% /alert %}}

## What's this?

[New Relic](https://newrelic.com) offers a suite of online/SaaS products that collectively form a very complete observability stack.

From a Butler SOS perspective the interesting parts are metrics, event and log handling.  
By forwarding such data to New Relic it's not necessary to run local InfluxDB and Grafana instances.

That said, New Relic is a commercial service and while their free tier is very generous, there will be a trade-off between a local/lower cost InfluxDB/Grafana setup and using New Relic.  
With InfluxDB/Grafana you also get more fine grained control over both data storage and visualizations, while New Relic offer ease of setup and no need to host InfluxDB/Grafana yourself.

Below the settings for sending Qlik Sense health metrics to New Relic are described.

## Tagging of data

The following attributes (which is New Relic lingo for tags) are added.

Note: Attributes defined further down in the list will overwrite already defined attributes if their names match.  
To avoid problems you should make sure not to use already defined attributes.

### Tags for Qlik Sense health metrics

1. Static attributes defined in the config file's `Butler-SOS.newRelic.metric.attribute.static` section.
2. Dynamic attributes
   1. `butlerSosVersion`: Butler SOS version
3. Dynamic attributes based on whether each item in `Butler-SOS.newRelic.metric.dynamic` section is enabled/disabled.
   1. If `Butler-SOS.newRelic.metric.dynamic.engine.memory` section is enabled
      1. `qs_memCommited`
      2. `qs_memAllocated`
      3. `qs_memFree`
   2. If `Butler-SOS.newRelic.metric.dynamic.engine.cpu` section is enabled
      1. `qs_cpuTotal`
   3. If `Butler-SOS.newRelic.metric.dynamic.engine.calls` section is enabled
      1. `qs_engineCalls`
   4. If `Butler-SOS.newRelic.metric.dynamic.engine.selections` section is enabled
      1. `qs_engineSelections`
   5. If `Butler-SOS.newRelic.metric.dynamic.engine.sessions` section is enabled
      1. `qs_engineSessionsActive`
      2. `qs_engineSessionsTotal`
   6. If `Butler-SOS.newRelic.metric.dynamic.engine.users` section is enabled
      1. `qs_engineUsersActive`
      2. `qs_engineUsersTotal`
   7. If `Butler-SOS.newRelic.metric.dynamic.engine.saturated` section is enabled
      1. `qs_engineSaturated`
   8. If `Butler-SOS.newRelic.metric.dynamic.apps.docCount` section is enabled
      1. `qs_docsActiveCount`
      2. `qs_docsLoadedCount`
      3. `qs_docsInMemoryCount`
   9. If `Butler-SOS.newRelic.metric.dynamic.cache.cache` section is enabled
      1. `qs_cacheHits`
      2. `qs_cacheLookups`
      3. `qs_cacheaAdded`
      4. `qs_cacheReplaced`
      5. `qs_cacheBytesAdded`

### Tags for Qlik Sense proxy session metrics

If and how Butler SOS should extract proxy session metrics is controlled in the `Butler-SOS.userSessions` section of the config file.

1. Static attributes defined in the config file's `Butler-SOS.newRelic.metric.attribute.static` section.
2. Dynamic attributes
   1. `butlerSosVersion`: Butler SOS version

## Settings in main config file

```yaml
Butler-SOS:
  ...
  ...
  # New Relic config
  # If enabled, select Butler SOS metrics will be sent to New Relic.
  newRelic:
    enable: false
    event:
      # There are different URLs depending on whther you have an EU or US region New Relic account.
      # The available URLs are listed here: https://docs.newrelic.com/docs/accounts/accounts-billing/account-setup/choose-your-data-center/
      #
      # Note that the URL path should *not* be included in the url setting below!
      # As of this writing the valid options are
      # https://insights-collector.eu01.nr-data.net
      # https://insights-collector.newrelic.com
      url: https://insights-collector.eu01.nr-data.net
      header:                   # Custom http headers
        - name: X-My-Header
          value: Header value
      attribute:
        static:                 # Static attributes/dimensions to attach to the events sent to New Relic.
          - name: service
            value: butler-sos
          - name: environment
            value: prod
        dynamic:
          butlerSosVersion:
            enable: true       # Should the Butler SOS version be included in the events sent to New Relic?
    metric:
      destinationAccount:
        - First NR account
        - Second NR account
      # There are different URLs depending on whther you have an EU or US region New Relic account.
      # The available URLs are listed here: https://docs.newrelic.com/docs/accounts/accounts-billing/account-setup/choose-your-data-center/
      # As of this writing the options for the New Relic metrics API are
      # https://insights-collector.eu01.nr-data.net/metric/v1
      # https://metric-api.newrelic.com/metric/v1
      url: https://insights-collector.eu01.nr-data.net/metric/v1   # Where should uptime data be sent?
      header:                   # Custom http headers
        - name: X-My-Header
          value: Header value
      dynamic:
        engine:
          memory:               # Engine RAM (free/committed/allocated).
            enable: true
          cpu:                  # Engine CPU.
            enable: true
          calls:                # Total number of requests made to the engine.
            enable: true
          selections:           # Total number of selections made to the engine.
            enable: true
          sessions:             # Engine session metrics (active and total number of engine sessions).
            enable: true
          users:                # Engine user metrics (active and total number of users in engine.
            enable: true
          saturated:            # Engine saturation status (tracks whether engine has high or low load).
            enable: true
        apps:
          docCount:
            enable: true
        cache:
          cache:                # Cache metrics.
            enable: true
        proxy:
          sessions:             # Session metrics as reported by the Sense proxy service
            enable: true
      attribute:
        static:                 # Static attributes/dimensions to attach to the data sent to New Relic.
          - name: service
            value: butler-sos
          - name: environment
            value: prod
        dynamic:
          butlerSosVersion:
            enable: true       # Should the Butler SOS version be included in the data sent to New Relic?
  ...
  ...
```
