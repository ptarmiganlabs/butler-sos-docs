---
title: "Docker"
linkTitle: "Docker"
weight: 40
description: >
  Running Butler SOS in Docker. Installation and configuration.
---

{{< notice tip >}}
Butler SOS Docker images are automatically built for several architectures:

- amd64: This is by far the most common platform - your typical Intel based server use amd64.
- arm64: Arm servers are now available from most cloud providers and offer very competetive price/performance. Apple's new M1 CPUs also use arm64, as does the newer Raspberry Pi models.
- arm/v7: An older Arm architecture found in previous-gen Raspberry Pis, for example.

All images are available on [Docker Hub](https://hub.docker.com/r/ptarmiganlabs/butler-sos/tags?page=1&ordering=last_updated).
{{< /notice >}}

Docker is great in that it runs on many different platforms.  
This means that as long as the Docker runtime environment is installed, you can run Butler SOS on your Mac laptop, on a Linux server or on a Windows server.

## Installation

### Docker runtime

Installing Docker is beyond the scope of this document, but there are plenty of online tutorials covering this.

### Butler SOS installation and configuration

When using Docker there is no installation in the traditional sense.  
Instead we (in this case) use a docker-compose file to define how Butler SOS should be executed within a Docker container. There are also other ways to start Docker containers, but docker-compose is usually a good and robust starting point.  

Configuration of Butler specific settings is then done using Butler's own JSON/YAML config file.

### Install & configure - walkthrough

Create a directory for Butler SOS. Config files and logs will be stored here.

```bash

proton:code goran$ mkdir -p butler-sos-docker/config/certificate
proton:code goran$ mkdir -p butler-sos-docker/logs
proton:code goran$ cd butler-sos-docker
proton:butler-sos-docker goran$

```

1. Copy [docker-compose.yml](https://github.com/ptarmiganlabs/butler-sos/blob/master/src/docker-compose.yml) from the GitHub repository to the main Butler SOS directory. The directory where the docker-compose file is stored is the 'root' directory of Butler SOS - everything else is relative to this directory.

2. Adapt the docker-compose file as needed (usually no changes are needed if you want to run the latest version of Butler SOS).

3. Copy the [YAML config file](https://github.com/ptarmiganlabs/butler-sos/blob/master/src/config/production_template.yaml) from the GitHub repository into the ./config directory, rename it to `production.yaml` (or something else, as long as it matches the NODE_ENV environment variable set in the `docker-compose.yml` file) and edit it as needed. Note that for the Docker setup the path to certificates (as specified in the YAML config file) should be `/nodeapp/config/certificate/` (this is the Docker container's internal path to the certificate directory).

4. Edit the config file above as needed, with respect to your local Sense environment, folder paths etc. The provided template file has reasonable defualt settings where possible, but there are also a number of paths, passwords etc that must be configured. 

5. Export certifiates from the QMC in Qlik Sense Enterprise, place them in the `./config/certificate` directory (i.e. in a subdirectory to the directory where the docker-comspose file is stored). The certificates can in theory be placed anywhere, as long as they are made available to the Docker container via a volume mount in the docker-compose.yaml file (e.g. ```- "./config:/nodeapp/config"```).  

Let's do this one step at a time.  
What files are there?

```bash
proton:butler-sos-docker goran$ ls -la
total 8
drwxr-xr-x   4 goran  staff   128 Oct 14 17:10 .
drwxr-xr-x  51 goran  staff  1632 Oct 14 17:08 ..
drwxr-xr-x   3 goran  staff    96 Oct 14 17:08 config
-rw-r--r--@  1 goran  staff   357 Oct 14 17:10 docker-compose.yml
proton:butler-sos-docker goran$
proton:butler-sos-docker goran$ ls -la config/
total 8
drwxr-xr-x  4 goran  staff   128 Oct 14 17:11 .
drwxr-xr-x  4 goran  staff   128 Oct 14 17:10 ..
drwxr-xr-x  2 goran  staff    64 Oct 14 17:08 certificate
-rw-r--r--@ 1 goran  staff  1335 Oct 14 17:11 production.yaml
proton:butler-sos-docker goran$
proton:butler-sos-docker goran$ ls -la config/certificate/
total 24
drwxr-xr-x  5 goran  staff   160 Oct 14 17:13 .
drwxr-xr-x  4 goran  staff   128 Oct 14 17:11 ..
-rw-r--r--@ 1 goran  staff  1166 Oct 14 17:13 client.pem
-rw-r--r--@ 1 goran  staff  1702 Oct 14 17:13 client_key.pem
-rw-r--r--@ 1 goran  staff  1192 Oct 14 17:13 root.pem
proton:butler-sos-docker goran$
```

What does the docker-compose.yml file look like?

```bash
proton:butler-sos-docker goran$ cat docker-compose.yml
# docker-compose.yml
version: '3.3'
services:
  butler-sos:
    image: ptarmiganlabs/butler-sos:latest
    container_name: butler-sos
    restart: always
    volumes:
      # Make config file accessible outside of container
      - "./config:/nodeapp/config"
      - "./log:/nodeapp/log"
    environment:
      - "NODE_ENV=production"         # Means that Butler SOS will read config data from production.yaml 
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "5m"
proton:butler-sos-docker goran$
```

Ok, all good. Let's start Butler SOS using docker-compose (the exact output will depend on what version of Butler SOS you are using and what features you have enabled in the JSON/YAML config file):

```bash
➜  butler-sos docker-compose up
Recreating butler-sos ... done
Attaching to butler-sos
butler-sos    | 2021-09-08T06:43:27.890Z info: CONFIG: Influxdb enabled: true
butler-sos    | 2021-09-08T06:43:27.892Z info: CONFIG: Influxdb host IP: 192.168.100.20
butler-sos    | 2021-09-08T06:43:27.892Z info: CONFIG: Influxdb host port: 8086
butler-sos    | 2021-09-08T06:43:27.892Z info: CONFIG: Influxdb db name: senseops
butler-sos    | 2021-09-08T06:43:28.127Z info: --------------------------------------
butler-sos    | 2021-09-08T06:43:28.127Z info: Starting Butler SOS
butler-sos    | 2021-09-08T06:43:28.128Z info: Log level: info
butler-sos    | 2021-09-08T06:43:28.128Z info: App version: 6.0.1
butler-sos    | 2021-09-08T06:43:28.129Z info:
butler-sos    | 2021-09-08T06:43:28.129Z info: Node version   : v14.17.6
butler-sos    | 2021-09-08T06:43:28.129Z info: Architecture   : x64
butler-sos    | 2021-09-08T06:43:28.130Z info: Platform       : linux
butler-sos    | 2021-09-08T06:43:28.130Z info: Release        : 9
butler-sos    | 2021-09-08T06:43:28.131Z info: Distro         : Debian GNU/Linux
butler-sos    | 2021-09-08T06:43:28.131Z info: Codename       : stretch
butler-sos    | 2021-09-08T06:43:28.131Z info: Virtual        : false
butler-sos    | 2021-09-08T06:43:28.131Z info: Processors     : 4
butler-sos    | 2021-09-08T06:43:28.131Z info: Physical cores : 4
butler-sos    | 2021-09-08T06:43:28.132Z info: Cores          : 4
butler-sos    | 2021-09-08T06:43:28.132Z info: Docker arch.   : undefined
butler-sos    | 2021-09-08T06:43:28.132Z info: Total memory   : 6233116672
butler-sos    | 2021-09-08T06:43:28.132Z info: --------------------------------------
butler-sos    | 2021-09-08T06:43:28.133Z info: Client cert: /nodeapp/config/certificate/client.pem
butler-sos    | 2021-09-08T06:43:28.133Z info: Client cert key: /nodeapp/config/certificate/client_key.pem
butler-sos    | 2021-09-08T06:43:28.133Z info: CA cert: /nodeapp/config/certificate/root.pem
butler-sos    | 2021-09-08T06:43:28.138Z info: USER ACTIVITY: UDP server listening on 0.0.0.0:9997
butler-sos    | 2021-09-08T06:43:28.151Z info: MAIN: Started Docker healthcheck server on port 12398.
butler-sos    | 2021-09-08T06:43:28.152Z info: MAIN: Starting Prometheus Butler SOS endpoint on 0.0.0.0:9842.
butler-sos    | 2021-09-08T06:43:28.160Z info: PROM: Prometheus Butler SOS metrics server now listening on port 9842
butler-sos    | 2021-09-08T06:43:28.161Z info: PROM: Prometheus Node.js metrics server now listening on port 0.0.0.0:9001...
...
```

Once everything everything looks good you can stop the container (ctrl-C), then start it again in daemon mode (i.e. running unattended in the background):

```bash
➜ docker-compose up -d
Creating network "butler-sos_default" with the default driver
Creating butler-sos ... done
➜ 
```

Setting the log level to info in the config file will reduce log output.

The Docker container implements Docker healthchecks, which means you can run `docker ps` to see whether the container is healthy or not (assuming Docker healthchecks are enabled in the config file, of course):

```bash
➜ docker ps
CONTAINER ID   IMAGE                             COMMAND                  CREATED          STATUS                    PORTS                                                                                                                 NAMES
6a924aa395e1   ptarmiganlabs/butler-sos:latest   "docker-entrypoint.s…"   39 seconds ago   Up 38 seconds (healthy)                                                                                                                         butler-sos
```
