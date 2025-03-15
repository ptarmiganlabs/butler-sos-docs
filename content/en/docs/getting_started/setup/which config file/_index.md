---
title: "Which config file to use"
linkTitle: "Which config file?"
weight: 10
description: >
  Butler SOS can use multiple config files. Here you learn to control which one is used by Butler SOS.
---

A description of the config file format is available [here](/docs/reference/config_file_format/).

## Select which config file to use

Butler SOS uses configuration files in YAML format.

Butler SOS comes with a default config file called `production_template.yaml`.  
Make a copy of it, then rename the copy to `butler-sos-config-prod.yaml`, `production.yaml`, `staging.yaml` or something else suitable to your specific use case.

Update the config file as needed (see the [config file reference page](/docs/reference/config_file_format/) for details).

Trying to run Butler SOS with the default config file (the one included in the files download from GitHub) will not work - you _must_ adapt it to your server environment. For example, you need to enter the IP or host name of you Sense server(s), the IP or host name where Butler SOS is running, where the Sense certificates are stored etc.

The name of the config file matters. Unless you specifically name which config to use when starting Butler SOS, it will look for an environment variable called "NODE_ENV" and then try to load a config file named with the value found in NODE_ENV.

Example 1:

- Environment variable `NODE_ENV` = `production`
- Butler SOS is started without specifying a config file: `butler.exe --loglevel info`
- Butler SOS will look for a config file `config/production.yaml`.

Example 2:

- Butler SOS is started with a command line option specifying a config file: `butler.exe --configfile d:\some\path\butler-sos-config-prod.yaml --loglevel info`
- Butler SOS will not look at the `NODE_ENV` environment variable. Settings will be loaded from the `butler-sos-config-prod.yaml` instead.

### Running several Butler SOS instances in parallel

If you have several Sense clusters (for example DEV, TEST and PROD environments) you can either monitor them all from a single Butler SOS instance, or set up separate instances for each Sense cluster.  
The second case is implemented by creating several config files: `butler-sos-dev.yaml`, `butler-sos-test.yaml` and `butler-sos-prod.yaml`.

In this scenario three instances of Butler SOS should be started, each given a different config file by setting the NODE_ENV variable as needed when starting Butler SOS.  
Or (this option is usually much easier!) use the `--configfile` command line option when starting Butler SOS.

Note: If running several Butler SOS instances in parallel, you must also ensure that each one uses unique port numbers for their respective UDP servers etc.

### Setting environment variables

The method for setting environment variables varies between operating systems:

On Windows:

    set NODE_ENV=production

Mac OS or Linux

    export NODE_ENV=production

If using Docker, the NODE_ENV environment variable is set in the docker-compose.yml file (as already done in the [template docker-compose files](https://github.com/ptarmiganlabs/butler-sos/tree/master/docs/docker-compose).)
