---
title: "Configuring the log database"
linkTitle: "Log db"
weight: 80
description:
---

{{< notice warning >}}
Support for Qlik Sense log db was removed in Butler SOS version 11.0.0.

It's recommended to use [log events](/docs/getting_started/setup/log-events/) instead, they provide a more flexible and scalable way to capture log events from Qlik Sense.
{{< /notice >}}

## What's this?

Up until mid 2021 Qlik Sense Enterprise on Windows included a logging database to which log events were sent.
It was removed from the product due to mainly performance reasons - it could be difficult to scale properly for large Sense clusters.

Butler SOS offers a replacement for log db, in the form of [log events](/docs/getting_started/setup/log-events/).
