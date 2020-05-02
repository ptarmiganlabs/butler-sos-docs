---
title: "Choosing a platform - what are the options?"
linkTitle: "Choose a platform"
date: 2019-09-16
weight: 2
description: >
  You can run Butler SOS on several platforms, each with their own pros and cons.
  This section should help you decide which hosting platform is right for you.
---


<!-- {{% pageinfo %}}
This is a placeholder page. Replace it with your own content.
{{% /pageinfo %}} -->

As Butler SOS is written in Node.js, the tool in theory runs on all platforms where Node.js is available.
The tool is also available as a [Docker image](https://hub.docker.com/r/ptarmiganlabs/butler-sos).

Docker is **by far** the preferred way of running Butler SOS, mainly because it gives you a very nice, production grade (stable, scalable, monitorable etc) execution environment.  

Other platforms can be used too, of course - let's look at the pros and cons of some of the more commonly used platforms:

| Platform | Pros  | Cons |
| -------- | ----- | ---- |
| Docker | - Easy to set up Butler SOS in Docker <br>- Easy to test new versions of Butler SOS <br>- Use existing Docker infrastructure<br>- Monitoring, restarts etc built into Docker<br> - Runs on low cost hardware | - Docker environment needed (if not already available). Setting up and running Docker is not hard, but does require somewhat other skills than those needed to run a Sense environment |
| Windows server | - Butler SOS can run on same server as Qlik Sense, saving hardware/server costs | - Running Butler SOS natively on the Sense server is a potential risk (usually a good idea to isolate systems to their own servers/environments whenever possible)<br>- More difficult (compared to Docker) to production grade setup (auto restarts etc) |
| Linux | - No cost for operating system (at least not for most Linux versions)<br>- Runs on low cost hardware | - More difficult (compared to Docker) to production grade setup (auto restarts etc) |
| Mac OS | - For development, if you want to extend or modify Butler SOS | - Not a server grade operating system, i.e. not for production use |
| Windows (desktop) | - For development, if you want to extend or modify Butler SOS | - Not a server grade operating system, i.e. not for production use |
