---
title: "Windows"
linkTitle: "Windows"
weight: 50
description: >
  Running Butler SOS in Windows.
---

## Installation

In this scenario, Butler SOS will run as a Node.js app on a Windows server.  

### 1. Install Node.js

Any recent Node version should work. If in doubt the [latest LTS version](https://nodejs.org/en/download/) is usually a good idea.

### 2. Select a directory from which Butler SOS will be run

This can be pretty much anywhere, in this example d:\tools\butler-sos will be used.

### 3. Get Butler SOS

Get the desired [Butler SOS version](https://github.com/ptarmiganlabs/butler-sos/releases) and extract it into the directory above.

Get the latest available version unless you have a *really* good reason to use an older version.  
New features are added, bugs fixed and security updates are applied in each version - it's simply a good idea to use the latest version.

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

1. By far the best option is to turn Butler SOS into a Windows service. That way it will be started on server boot, restarted if it fails etc. There are various tools for doing this, with [NSSM](https://nssm.cc/) being a very, very good one. Butler SOS has been installed in lots of Sense clusters this way.

2. You can also use a Node process monitor such as [PM2](http://pm2.keymetrics.io/) to monitor the Butler SOS process, and restart it if it for some reason crashes. PM2 is not entirely easy to use on Windows though.
