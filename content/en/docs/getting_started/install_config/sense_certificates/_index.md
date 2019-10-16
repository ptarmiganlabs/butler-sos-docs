---
title: "Export Sense certificates"
linkTitle: "Get certificates"
weight: 2
description: >
  Running Butler SOS in Windows. Installation and configuration.
---

## Installation

In this scenario, Butler SOS will run as a Node.js app on the Windows server itself.  

### 1. Install Node.js

Any recent Node version should work fine, but if in doubt the [latest LTS version](https://nodejs.org/en/download/) is usually a good idea.

### 2. Select a directory from which Butler SOS will be run

This can be pretty much anywhere, in this example d:\tools\butler-sos will be used.

### 3. Get Butler SOS

Get the desired [Butler SOS version](https://github.com/ptarmiganlabs/butler-sos/releases) and extract it into the directory above.

### 4. Install Node.js dependencies

From d:\tools\butler-sos\src, run `npm i` to install the various Node.js modules used by Butler SOS. Depending on your server configuration you may get some warnings about (for example) Python not being installed, these can usually be ignored.

## Configuration

The configuration file is used the same way as when Butler SOS runs on Docker, with one exception:

The path to the certificates used to authenticate with Sense must be specified in the config file. With Docker the certificate path is fixed, but with Windows you need to specify it. 

For example, if the certificate files exported from Sense are stored in d:\secrets\sensecert, the config file would look like this when used on Windows:


```yaml
  ...
  # Certificates to use when querying Sense for healthcheck data. Get these from the Certificate Export in QMC.
  cert:
    clientCert: d:\secrets\sensecert\client.pem
    clientCertKey: d:\secrets\sensecert\client_key.pem
    clientCertCA: d:\secrets\sensecert\root.pem

```


## Running

A tool like Butler SOS should of course start automatically when the server it runs on is restarted. This can be achieved in at least a couple of ways:

1. A Node process monitor such as [pm2]() can be used to monitor the Butler SOS process, and restart it if it for some reason crashes.

2. Use a tool to wrap Butler SOS into a Windows service. There are various tools for doing this, with [nssm] being one of the better ones.

The second option is usually preferred, as you then manage Butler SOS the same way as other system critical Windows services.
