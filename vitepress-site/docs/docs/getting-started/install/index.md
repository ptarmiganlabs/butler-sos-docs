# Installation

The steps needed for installing and configuring vary slightly depending on what platform you use.

:::warning InfluxDB Version Support
Butler SOS can store data in InfluxDB 1.x or 2.x databases.

**InfluxDB 3.x is currently not supported.**
:::

<!-- TODO Make sure the contents of the target page is up-to-date -->

:::tip Getting Started Tips
There is a [Tips & Tricks to get started with Butler SOS](https://github.com/ptarmiganlabs/butler-sos/discussions/201) document on the Butler SOS forums.

It contains descriptions of issues people have faced when installing Butler SOS, as well as solutions to them.
:::

## Recommended: Docker Installation

If in doubt on how to install Butler SOS, please consider Docker (or Kubernetes if available) as the first alternative.

### Why Docker?

Several reasons make Docker the preferred installation method:

- **Quick Setup**: Usually it takes just a few minutes to set up a Butler SOS instance in Docker.
- **Safe Testing**: Docker is a great way to test new tools without installing them on your actual servers. If you decide the tool is not for you - just delete the Docker container. Your servers remain 100% the same as before the test.
- **Complete Ecosystem**: The previous point is true not only for Butler SOS, but also its companion tools:

  - [InfluxDB](https://www.influxdata.com/products/influxdb-overview/)
  - [Prometheus](https://prometheus.io)
  - [Grafana](https://grafana.com/)
  - [MQTT](https://en.wikipedia.org/wiki/MQTT) (via for example the [Mosquitto MQTT broker](https://mosquitto.org/))

  You can run all of these tools in their own Docker containers, and not install a single piece of new, native applications during your evaluation of Butler SOS.

- **Production Ready**: Make use of your existing Docker runtime environments, or use those offered by Amazon, Google, Microsoft etc.
- **Monitoring & Deployment**: Benefit from the comprehensive tools ecosystem (monitoring, deployment etc) that is available for Docker.
- **Easy Updates**: Updating Butler SOS to the latest version (assuming no config file changes are needed for that particular upgrade) is as easy as:
  1. Stopping the container
  2. Running `docker compose pull`
  3. Restarting the container again using a `docker compose up -d` command.

## Alternative: Standalone Binaries

If Docker is not an option, the pre-built, stand-alone binaries for Windows, Linux and macOS are good alternatives.  
They offer a download-configure-execute approach to running Butler SOS.

This will be the easiest way to use Butler SOS if you are not familiar with Docker or if you are on a Windows server without Docker support.

## Installation Considerations

But even with the above recommendations, Butler SOS can be deployed in lots of different configurations.

It is therefore difficult to give precise instructions that will work everywhere, for everyone. Especially the fact that Butler SOS uses certificates to authenticate with Sense is a complicating factor. Certificates are (when correctly used) great for securing systems, but they can also cause headaches.

### Understanding Qlik Sense Certificates

First we must recognize that Sense uses [self signed certificates](https://en.wikipedia.org/wiki/Self-signed_certificate). This is fine, and as long as you work on a server where Sense Enterprise is installed, that server will have the Sense-provided certificates and Certificate Authority (CA) installed.

This means that the easiest option for getting Butler SOS up and running is usually to install it on one of your Sense servers.

That said, it is probably better system design to run Butler SOS (and maybe other members of the [Butler family](/docs/about/butler-family)) on their own server, maybe using some flavour of Linux (lower cost compared to Windows). Windows servers work equally well though.

In this case you might want to consider exporting the Sense CA certificate from one of your Sense servers, and then install it on the Linux server.
This _should_ technically not be needed for Butler SOS to work correctly - as long as you specify the correct `root.pem` file in the Butler SOS config file, you should be ok.

### Common Certificate Errors

#### Incorrect CA Certificate

If you specify an incorrect root CA certificate file in the `clientCertCA` config option, you will get an error like this:

```bash
2018-05-23T20:36:44.393Z - error: Error: Error: unable to verify the first certificate
    at TLSSocket.<anonymous> (_tls_wrap.js:1105:38)
    at emitNone (events.js:106:13)
    at TLSSocket.emit (events.js:208:7)
    at TLSSocket._finishInit (_tls_wrap.js:639:8)
    at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:469:38)
2018-05-23T20:36:49.164Z - verbose: Event started: Query log db
2018-05-23T20:36:49.180Z - verbose: Event started: Statistics collection
```

#### Hostname Mismatch

A general note on host names is also relevant.  
If you specify a server name of "myserver.company.com" while exporting certificates from the QMC, you should use that same server name in the Butler SOS config file. Failing to do so will (most likely) result in an error:

```bash
2018-05-23T19:51:03.087Z - error: Error: Error: Hostname/IP doesn't match certificate's altnames: "Host: serveralias.company.net. is not in the cert's altnames: DNS:myserver.company.com"
    at Object.checkServerIdentity (tls.js:223:17)
    at TLSSocket.<anonymous> (_tls_wrap.js:1111:29)
    at emitNone (events.js:106:13)
    at TLSSocket.emit (events.js:208:7)
    at TLSSocket._finishInit (_tls_wrap.js:639:8)
    at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:469:38)
2018-05-23T19:51:07.701Z - verbose: Event started: Statistics collection
```

## Installation Guides

Choose your installation platform:

- [Docker Installation](/docs/getting-started/install/docker)
- [Windows, Linux, macOS Installation](/docs/getting-started/install/windows)
- [InfluxDB & Grafana Setup](/docs/getting-started/install/influxdb-grafana)
- [Prometheus & Grafana Setup](/docs/getting-started/install/prometheus-grafana)

## Next Steps

After installation, proceed to:

- [Day 2 Operations](/docs/getting-started/operations/)
- [Configuration Reference](/docs/reference/config-file-format)
