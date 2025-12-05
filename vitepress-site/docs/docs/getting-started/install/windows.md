---
title: Windows
description: Running Butler SOS in Windows.
---

## Installation

### Using the pre-built, standalone app

The pre-built binaries are available from the [releases page](https://github.com/ptarmiganlabs/butler-sos/releases).

1. Download the Windows binary
2. "Unblock" the downloaded zip file
   1. Right-click the zip file
   2. Select "properties"
   3. Mark the "Unblock" check box in the lower right part of the properties window
   4. Click the "Apply" button, then "Ok" to close the properties window
3. Unzip the zip file
4. Move the extracted `butler-sos.exe` file to desired location, for example `d:\tools\butler-sos`
5. Use [nssm](https://nssm.cc/download) or similar tool to install Butler SOS as a Windows service

<ResponsiveImage
  src="./unblock-butler-sos-windows-1.png"
  alt="Unblocking the Butler SOS zip file on Windows Server"
  caption="Unblocking the Butler SOS zip file on Windows Server"
  maxWidth="450px"
/>

## Configuration

The configuration file is used the same way as when Butler SOS runs on Docker, with one exception:

The path to the certificates used to authenticate with Sense must be specified in the config file. With Docker the certificate path is always the same, but with Windows you need to specify where the certificate files are located.

For example, if the certificate files exported from Sense are stored in d:\secrets\sensecert, the config file would look like this when used on Windows:

```yaml
  ...
  # Certificates to use when querying Sense for healthcheck data. Get these from the Certificate Export in QMC.
  cert:
    clientCert: d:\secrets\sensecert\client.pem
    clientCertKey: d:\secrets\sensecert\client_key.pem
    clientCertCA: d:\secrets\sensecert\root.pem

```

## Stayin' alive

A tool like Butler SOS should of course start automatically when the server it runs on is restarted. This can be achieved in at least a couple of ways:

1. By far the best option is to turn Butler SOS into a Windows service. That way it will be started on server boot, restarted if it fails etc. There are various tools for doing this, with [NSSM](https://nssm.cc/) being a very good one. Butler SOS has been installed in lots of Sense environments this way.

2. You can also use a Node process monitor such as [PM2](http://pm2.keymetrics.io/) to monitor the Butler SOS process, and restart it if it for some reason crashes. PM2 is not entirely easy to use on Windows though.
