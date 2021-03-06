---
title: 'Day 2 operations'
linkTitle: 'Day 2 operations'
weight: 70
description: >
    Options for running Butler SOS.
---

## Running Butler SOS

How to start and keep Butler SOS running varies depending on whether you are using Docker or a native Node.js approach.

{{< tabs tabTotal="2" tabID="1" tabName1="Docker" tabName2="Native Node.js" >}}
{{< tab tabNum="1" >}}

Starting Butler SOS using Docker is easy.  

First configure the `docker-compose.yml` file as needed, then start the Docker container in interactive mode (with output sent to the screen).  
This is useful to ensure everything works as intended when first setting up Butler SOS.

    docker-compose up

Once Butler SIS has been verified to work as intended, hit `ctrl-c` to stop it.  
Then start Butler SOS in deameon (background) mode:

    docker-compose up -d

From here on the Docker enviromment will make sure Butler SOS is always running, including restarting it if it for some reason stops.

{{< /tab >}}
{{< tab tabNum="2" >}}
<br>
Starting Butler SOS as a Node.js on Windows could look like this:  

    d:
    cd \node\butler-sos\src
    node butler-sos.js

It is of course also possible to put those commands in a command file (.bat on Windows, .sh etc on other platforms) file and execute that file instead.

### Windows services & process monitors

As Butler SOS is the kind of service that (probably) should always be running on a server, it makes sense using a Node.js process monitor to keep it alive (if running Butler SOS as a Docker container you get this for free).

On Windows you can use the excellent [Nssm](https://nssm.cc/) tool to make Butler SOS run as a Windows Service, with all the benefits that follow (can be monitored using operations tools, automatic restarts etc).

If running Butler SOS as a Node.js app on Linux, [PM2](https://github.com/Unitech/pm2) and [Forever](https://github.com/foreverjs/forever) are two process monitors that both have been successfully tested with Butler SOS.

One caveat with these is that it can be hard to start them (and thus Butler SOS) when a Windows server is rebooted.
PM2 can be used to solve this challenge in a nice way, more info in [this blog post](https://ptarmiganlabs.com/blog/2017/07/12/monitoring-auto-starting-node-js-services-windows-server). On the other hand - just using Nssm is probably the easiest and best option for Windows.

{{< /tab >}}
{{< /tabs >}}
