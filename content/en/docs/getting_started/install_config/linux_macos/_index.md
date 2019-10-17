---
title: "Linux and Mac OS"
linkTitle: "Linux, Mac OS"
weight: 6
description: >
  Running Butler SOS in Linux and Mac OS. Installation and configuration.
---

## Installation

This scenario is identical to the [Windows scenario](/docs/getting_started/install_config/windows/), please refer to that page for details. Keep in mind that the format of file systems paths differ between Windows and Linxu/Mac OS.

## Configuration

Once again, same thing as [on Windows](/docs/getting_started/install_config/windows/).

## Running

### Environment variables

There is a dependency between the name of the YAML configuration file and the NODE_ENV environment variable. 

The `production.yaml` file can be named anything, as long as it matches the value of the `NODE_ENV` environment variable.  
For example, if the config file is called `production.yaml`, the NODE_ENV environment variable should be set to 'production'.

In Linux you do this by `export NODE_ENV=production` in a shell prompt, or even better as a server wide setting.

### Stayin' alive
A Node process monitor can be used on Linux or Mac OS, just a on Windows.
Tools like [PM2](http://pm2.keymetrics.io/) in fact usually work better on Linux/Mac OS than on Windows..

You can probably also use Linux' standard service layer to start Butler SOS, that has not been tested though.
