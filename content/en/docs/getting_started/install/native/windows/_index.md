---
title: "Windows"
linkTitle: "Windows"
weight: 50
description: >
  Running Butler SOS in Windows.
---

## Installation

There are two options: Run Butler SOS as a standalone binary or as a Node.js app.
The first is by far easier to set up and maintain and thus recommended.

### Using the pre-built, standalone app

The pre-build binaries are available from the [releases page](https://github.com/ptarmiganlabs/butler-sos/releases).

1. Download the Windows binary
2. "Unblock" the downloaded zip file
   1. Right-click the zip file
   2. Select "properties"
   3. Mark the "Unblock" check box in the lower right part of the properties window
   4. Click the "Apply" button, then "Ok" to close the properties window
3. Unzip the zip file
4. Move the extracted `butler-sos.exe` file to desired location, for example `d:\tools\butler-sos`
5. Use [nssm](https://nssm.cc/download) or similar tool to install Butler SOS as a Windows service

{{< imgproc unblock-butler-sos-windows-1.png Resize "400x" >}}
Unblocking the Butler SOS zip file on Windows Server
{{< /imgproc >}}

### Using Node.js

In this scenario you will use the Butler SOS source code together with the standard Node.js runtime libraries.

The result is the same as with the stand-alone binaries, you just have to do more of the work yourself.  
This is usually *not* preferred, but if you want to add new features to (or modify existone ones) Butler SOS, this option is for you

### 1. Install Node.js

The [latest LTS version](https://nodejs.org/en/download/) is usually a good choice.

### 2. Select a directory from which Butler SOS will be run

This can be pretty much anywhere, in this example d:\tools\butler-sos will be used.

### 3. Get Butler SOS

Get the desired [Butler SOS version](https://github.com/ptarmiganlabs/butler-sos/releases) and extract it into the directory above.

Get the latest available version unless you have a *really* good reason to use an older version.  
New features are added, bugs fixed and security updates are applied in each version - it's simply a good idea to use the latest version.

Do not just clone the Butler SOS repository as that will give you the latest development version, which may not yet be fully tested and packaged.  
The exception is of course if you want to contribute to Butler SOS development - then forking and cloning the repository is the right thing to do.

### 4. Install Node.js dependencies

From d:\tools\butler-sos\src, run `npm i` to install the various Node.js modules used by Butler SOS. Depending on your server configuration you may get some warnings about (for example) Python not being installed, these can usually be ignored.

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
