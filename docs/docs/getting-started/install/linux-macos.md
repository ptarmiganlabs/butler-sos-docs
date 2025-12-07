---
title: Linux and Mac OS
description: Running Butler SOS in Linux and Mac OS. Installation and configuration.
---

## Installation

### Using the pre-built, standalone app

The pre-built binaries are available from the [releases page](https://github.com/ptarmiganlabs/butler-sos/releases).

1. Download the Linux/macOS binary
2. Move the extracted `butler-sos` file to desired location.
3. Use the process monitor of choice (see below) to make sure Butler SOS is always running

## Configuration

Once again, same thing as [on Windows](/docs/getting-started/install/windows).

## Stayin' alive

A Node process monitor can be used on Linux or Mac OS too.  
Tools like [PM2](http://pm2.keymetrics.io/) in fact usually work better on Linux/Mac OS than on Windows.

You could also use Linux' standard service layer to start Butler SOS.
