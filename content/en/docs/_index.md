---
title: "Documentation"
linkTitle: "Documentation"
weight: 20
menu:
  main:
    weight: 20
---

{{% pageinfo %}}

### What's new in version 5.2

* **Extract app names** for all apps currently loaded in the Qlik Sense server's memory. This is probably the single most requested feature over the past couple of years. Being able to look at a list of what apps are currently loaded into RAM (showing the actual app names!) makes it a lot easier to understand what might be causing high server load or RAM usage.
* When setting the log level to debug or silly, Butler SOS will now **log its own RAM usage** to the log files. This is useful when you want to understand how much memory Butler SOS itself uses, and to make sure its memory usage doesn't increase over time (i.e. to ensure there are no memory leaks).
* When setting the log level to verbose, debug or silly, Butler SOS will nog **log its current uptime** to the log files. I.e. tell in human readable form that Butler SOS has been running for "x days, y hours, z minutes". Useful to determine if there have been any unexpected restarts.
* Butler SOS can now (optionally) **send heartbeat messages to infrastructure monitoring tools**. This is a key feature when it comes to making Butler SOS enterprise grade: It's now possible to alert when Butler SOS for some reason goes offline.
* **Replace the Request Node.js library with Axios**. Request was sunset, while Axios is a more modern option for getting stuff from http APIs.
* **Update all dependencies** to latest versions, to ensure security concerns are adressed.

{{% /pageinfo %}}
