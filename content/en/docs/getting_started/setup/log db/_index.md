---
title: "Configuring the log database"
linkTitle: "Log db"
weight: 80
description:
---

{{% alert title="Optional" color="primary" %}}
These settings are optional.

If you don't do anything extraction of events from the Sense log database is turned off by default.
{{% /alert %}}

## What's this?

Up until mid 2021 Qlik Sense Enterprise on Windows included a logging database to which log events were sent.
It was removed from the product due to mainly performance reasons - it could be difficult to scale properly for large Sense clusters.

Butler SOS offers a replacement for log db, in the form of [log events](/docs/getting_started/setup/log-events/).

There may cases where using log db is still preferred though, for example for Sense cluster running older versions of QSEoW. For that reason it's still possible to configure and use log db from Butler SOS.  

{{< notice warning >}}
Future versions of Butler SOS are likely to remove support for log db.  
It can thus be a good idea to migrate to Butler SOS log events already now.
{{< /notice >}}

The Sense log db contains a subset of the log events that appear in Sense's log files on disk.  
Not all Sense subsystems send logs to log db, but those who do typically sent info, warnings, errors and fatal messages to the database. The logging level is configured in the QMC.

The log db integration rely on one thing to work:

1. Settings in the Butler SOS main config file.

These settings are described below.

## Tech deep-dive

- Butler SOS queries log db with a certain interval, set by the `pollingInterval` setting.
- Each query will get log events going back a certain time, controlled by the `queryPeriod` setting.
  - `queryPeriod` should be longer than the polling interval! If it's not there is a risk that log events won't be retrieved to Butler SOS.

## Settings in main config file

{{< notice tip >}}
The config snippet below comes from the [production_template.yaml](https://github.com/ptarmiganlabs/butler-sos/blob/master/src/config/production_template.yaml) file.

Being a template, it contains examples on how configuration *may* be done - not necessarily how it *should* be done.  
For example, the `env/DEV` and `foo/bar` tags are optional and can be changed to something else, or removed all together if not used.
{{< /notice >}}

{{< notice warning >}}
Enabling `info` level logs in the query done towards log db will result in **lots** of log events being stored in Butler SOS' InfluxDB database. This can cause performance issues in large Sense environments.
{{< /notice >}}

```yaml
---
Butler-SOS:
  ...
  ...
  # Qlik Sense logging db config parameters
  logdb:
    enable: true
    # Items below are mandatory if logdb.enable=true
    pollingInterval: 60000            # How often (milliseconds) should Postgres log db be queried for warnings and errors?
    queryPeriod: 5 minutes            # How far back should Butler SOS query for log entries? Default is 5 min
    host: <IP or FQDN of Qlik Sense logging db>   # E.g. 10.5.23.7 or sense.mycompany.com
    port: 4432                        # 4432 if using default Sense setup 
    qlogsReaderUser: qlogs_reader
    qlogsReaderPwd: <pwd>
    extractErrors: true               # Should error level entries be extracted from log db into Influxdb?
    extractWarnings: true             # Should warn level entries be extracted from log db into Influxdb?
    extractInfo: false                # Should info level entries be extracted from log db into Influxdb? 
                                      # Warning! Seting this to true will result in LOTS of log messages 
                                      # being retrrieved by Butler SOS!
  ...
  ...
```
