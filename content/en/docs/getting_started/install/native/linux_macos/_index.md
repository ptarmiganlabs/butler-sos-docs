---
title: "Linux and Mac OS"
linkTitle: "Linux, Mac OS"
weight: 60
description: >
  Running Butler SOS in Linux and Mac OS. Installation and configuration.
---

## Installation

There are two options: Run Butler SOS as a standalone binary or as a Node.js app.
The first is by far easier to set up and maintain and thus recommended.

### Using the pre-built, standalone app

The pre-build binaries are available from the [releases page](https://github.com/ptarmiganlabs/butler-sos/releases).

1. Download the Linux/macOS binary
2. Move the extracted `butler-sos` file to desired location.
3. Use the process monitor of choice (see below) to make sure Butler SOS is always running

### Using Node.js

This scenario is identical to the [Windows scenario](/docs/getting_started/install/native/windows/), please refer to that page for details. Keep in mind that the format of file systems paths differ between Windows and Linux/Mac OS.

## Configuration

Once again, same thing as [on Windows](/docs/getting_started/install/native/windows/).

## Stayin' alive

A Node process monitor can be used on Linux or Mac OS too.  
Tools like [PM2](http://pm2.keymetrics.io/) in fact usually work better on Linux/Mac OS than on Windows.

You can probably also use Linux' standard service layer to start Butler SOS, that has not been tested though.
