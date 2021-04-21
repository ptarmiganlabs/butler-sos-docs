---
title: "Installing Butler SOS"
linkTitle: "Installing Butler SOS"
weight: 30
description: >
  The steps needed for installing and configuring vary slightly depending on what platform you use. The details are found here.
---

{{< notice warning >}}
Butler SOS was developed with InfluxDB version 1.x in mind.  

InfluxDB is currently available in version 2.x and while this version brings lots of new goodies, it's not out-of-the-box compatible with Butler SOS.  
For that reason you should use the latest 1.x version of InfluxDB, which at the time of this writing is 1.8.4.

In due time Butler SOS will be updated to support InfluxDB 2.x too.
{{< /notice >}}

{{% pageinfo %}}
If in doubt on how to install Butler SOS, please consider Docker as the first alternative.  
Why? Several reasons:

- Very quick to get started. Usually it takes just a few minutes to set up a Butler SOS instance in Docker.
- Using Docker is a great way to test new tools without having to install the tool on one of your actual servers. If you decide the tool in question is not for you - just delete the Docker container. Your servers remain 100% the same as before the test.
- The previous point is true not only for Butler SOS, but also its companion tools [InfluxDB](https://www.influxdata.com/products/influxdb-overview/), [Grafana](https://grafana.com/) and [MQTT](https://en.wikipedia.org/wiki/MQTT) (via for example the [Mosquitto MQTT broker](https://mosquitto.org/)). You can run all of these tools in their own Docker containers, and not install a single piece of new, native applications during your evaluation of Butler SOS.
- No need to install Node.js on your server(s). Less security, performance and maintenance concerns.
- Make use of your existing Docker runtime environments, or use those offered by Amazon, Google, Microsoft etc.
- Benefit from the extremely comprehensive tools ecosystem (monitoring, deployment etc) that is available for Docker.
- Updating Butler SOS to the latest version (assuming no config file changes are needed for that particular upgrade) is as easy as stopping the container, doing a "docker pull ptarmiganlabs/butler-sos:latest", and finally starting the container again.
{{% /pageinfo %}}

But even with the above Docker recommendation, Butler SOS *can* be deployed in lots of different configurations.  
It is therefore difficult to give precise instructions that will work for all configurations. Especially the fact that Butler SOS uses certificates to authenticate with Sense is a complicating factor. Certificates are (when correctly used) great for securing systems, but they can alse cause headaches.

First we must recognize that Sense uses [self signed certificates](https://en.wikipedia.org/wiki/Self-signed_certificate). This is fine, and as long as you work on a server where Sense Enterprise is installed, that server will have the Sense-provided Certificate Authority (CA) certificate installed.

This means that the easiest option for getting Butler SOS up and running is usually to install it on one of your Sense servers.

That said, it is probably better system design to run Butler SOS (and maybe other members of the [Butler family](https://github.com/ptarmiganlabs)) on their own server, maybe using some flavour of Linux (lower cost compared to Windows).  
In this case you might want to consider exporting the Sense CA certificate from one of your Sense servers, and then install it on the Linux server.
This *should* technically not be needed for Butler SOS to work correctly - as long as you specify the correct root.pem file in the Butler SOS config file, you should be ok.

If you specify an incorrect root CA certificate file in the ```clientCertCA``` config option, you will get an error like this:

``` bash
2018-05-23T20:36:44.393Z - error: Error: Error: unable to verify the first certificate
    at TLSSocket.<anonymous> (_tls_wrap.js:1105:38)
    at emitNone (events.js:106:13)
    at TLSSocket.emit (events.js:208:7)
    at TLSSocket._finishInit (_tls_wrap.js:639:8)
    at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:469:38)
2018-05-23T20:36:49.164Z - verbose: Event started: Query log db
2018-05-23T20:36:49.180Z - verbose: Event started: Statistics collection
```

A general note on host names is also relevant.  
If you specify a server name of "myserver.company.com" while exporting certificates from the QMC, you should use that same server name in the Butler SOS config file.  Failing to do so will (most likely) result in an error:

``` bash
2018-05-23T19:51:03.087Z - error: Error: Error: Hostname/IP doesn't match certificate's altnames: "Host: serveralias.company.net. is not in the cert's altnames: DNS:myserver.company.com"
    at Object.checkServerIdentity (tls.js:223:17)
    at TLSSocket.<anonymous> (_tls_wrap.js:1111:29)
    at emitNone (events.js:106:13)
    at TLSSocket.emit (events.js:208:7)
    at TLSSocket._finishInit (_tls_wrap.js:639:8)
    at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:469:38)
2018-05-23T19:51:07.701Z - verbose: Event started: Statistics collection
```
