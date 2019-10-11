
---
title: "Documentation"
linkTitle: "Documentation"
weight: 20
menu:
  main:
    weight: 20
---

{{% pageinfo %}}
### What's new in version 5.0

* Extract **detailed user session data** for specific virtual proxies. Previously it was only possible to see how many users/sessions were using Sense in total - no info on what specific users or what virtual proxies they use were extracted.  
  The new features make it possible to see exactly what users are connected right now, how many sessions each user has open, and what virtual proxies they are connected via.
* Data extracted by Butler SOS can now be stored in **password protected** InfluxDB databases.
* All data stored in InfluxDB is accompanied by a **InfluxDB retention policy**. This means there is now a way to make sure that the InfluxDB database does not grow beyond reasonable limits. Put differently: You can save detailed, fine-grained Sense metrics and specify that it should only be kept for (for example) 4 weeks. Any data older than the threshold is automatically purged from InfluxDB. 
* **Improved logging** throughout the app makes it easier to debug and solve configuration issues that may arise.

Thes new features mean that Butler SOS' configuration file has a slightly new format. When upgrading to v5.0 from earlier versions you must ensure that your YAML config file meets the v5.0 format.

{{% /pageinfo %}}
