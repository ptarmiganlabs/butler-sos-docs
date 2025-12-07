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
- arm64: Arm servers are now available from most cloud providers and offer very competitive price/performance. Apple's M-series CPUs also use arm64, as does the newer Raspberry Pi models.
- arm/v7: An older Arm architecture found in previous-gen Raspberry Pis, for example.

All images are available on [Docker Hub](https://hub.docker.com/r/ptarmiganlabs/butler-sos/tags?page=1&ordering=last_updated).
{{< /notice >}}

Docker is great in that it runs on many different platforms.  
This means that as long as the Docker runtime environment is installed, you can run Butler SOS on your Mac laptop, on a Linux server or on a Windows server.  
Or in a Kubernetes cluster to get enterprise grade process monitoring of Butler SOS.

## Installation

### Docker runtime

Installing Docker is beyond the scope of this document, but there are plenty of online tutorials covering this.

### Butler SOS installation and configuration

When using Docker there is no installation in the traditional sense.  
Instead we (in this case) use a docker-compose file to define how Butler SOS should be executed within a Docker container. There are also other ways to start Docker containers, but docker-compose is usually a good and robust starting point.

Configuration of Butler specific settings is then done using Butler's own JSON/YAML config file.

### Install & configure - walkthrough

Create a directory for Butler SOS. Config files and logs will be stored here.  
This example uses macOS but the commands will be very similar on Linux.  
Docker on Windows is another story - it's there and works great, but not always identical to Linux/macOS.

```bash
➜  butler-sos-demo mkdir -p butler-sos-docker/config/certificate
➜  butler-sos-demo mkdir -p butler-sos-docker/log
➜  butler-sos-demo cd butler-sos-docker
➜  butler-sos-docker
```

1. Copy [docker-compose.yml](https://github.com/ptarmiganlabs/butler-sos/blob/master/docs/docker-compose/docker-compose.yml) from the GitHub repository to the Butler SOS directory that was created above. The directory where the docker-compose file is stored is the 'root' directory of Butler SOS - everything else is relative to this directory.

2. Adapt the docker-compose file as needed (usually no changes are needed if you want to run the latest version of Butler SOS).

3. Copy the [YAML config file](https://github.com/ptarmiganlabs/butler-sos/blob/master/src/config/production_template.yaml) from the GitHub repository into the ./config directory, rename it to `production.yaml` (or something else, as long as it matches the NODE_ENV environment variable set in the `docker-compose.yml` file) and edit it as needed. Note that for the Docker setup the path to certificates (as specified in the YAML config file) should be `/nodeapp/config/certificate/` (this is the Docker container's internal path to the certificate directory).

4. Edit the config file above as needed, with respect to your local Sense environment, folder paths etc. The provided template file has reasonable default settings where possible, but there are also a number of paths, passwords etc that must be configured.

5. Export certificates from the QMC in Qlik Sense Enterprise, place them in the `./config/certificate` directory (i.e. in a subdirectory to the directory where the docker-compose file is stored). The certificates can in theory be placed anywhere, as long as they are made available to the Docker container via a volume mount in the docker-compose.yaml file (e.g. `- "./config:/nodeapp/config"`).

Let's do this one step at a time.  
Here we will bring up a single container with Butler SOS in it.  
The Butler SOS config file is called `production.yaml`.

First, what files are there?

```bash
➜  butler-sos-docker ls -la
total 8
drwxr-xr-x  5 goran  staff   160 Aug 21 19:08 .
drwxr-xr-x  3 goran  staff    96 Aug 21 18:49 ..
drwxr-xr-x  4 goran  staff   128 Aug 21 19:08 config
-rw-r--r--  1 goran  staff  1505 Aug 21 19:01 docker-compose.yml
drwxr-xr-x  2 goran  staff    64 Aug 21 18:49 log
➜  butler-sos-docker
➜  butler-sos-docker ls -la config
total 48
drwxr-xr-x  4 goran  staff    128 Aug 21 19:08 .
drwxr-xr-x  5 goran  staff    160 Aug 21 19:08 ..
drwxr-xr-x  5 goran  staff    160 Aug 21 19:08 certificate
-rw-r--r--  1 goran  staff  21903 Aug 21 19:08 production.yaml
➜  butler-sos-docker
➜  butler-sos-docker ls -la config/certificate
total 24
drwxr-xr-x  5 goran  staff   160 Aug 21 19:08 .
drwxr-xr-x  4 goran  staff   128 Aug 21 19:08 ..
-rw-r--r--@ 1 goran  staff  1170 Aug 21 19:06 client.pem
-rw-r--r--@ 1 goran  staff  1704 Aug 21 19:06 client_key.pem
-rw-r--r--@ 1 goran  staff  1224 Aug 21 19:06 root.pem
➜  butler-sos-docker
```

What does the docker-compose.yml file look like?

```bash
➜  butler-sos-docker cat docker-compose.yml
# docker-compose.yml
services:
    butler-sos:
        image: ptarmiganlabs/butler-sos:latest
        container_name: butler-sos
        restart: always
        volumes:
            # Make config file and log files accessible outside of container
            - "./config:/nodeapp/config"
            - "./log:/nodeapp/log"
        environment:
            - "NODE_ENV=production" # Means that Butler SOS will read config data from production.yaml
        logging:
            driver: "json-file"
            options:
                max-file: "5"
                max-size: "5m"
        networks:
            - senseops

networks:
    senseops:
        driver: bridge

➜  butler-sos-docker
```

Ok, all good. Let's start the container using docker-compose (the exact output will depend on what version of Butler SOS you are using and what features you have enabled in its YAML config file).

```bash
➜  butler-sos-docker docker-compose up
Creating network "butler-sos-docker_senseops" with driver "bridge"
Creating butler-sos ... done
Attaching to butler-sos
butler-sos    | 2022-08-23T03:45:28.754Z info: CONFIG: Influxdb enabled: true
butler-sos    | 2022-08-23T03:45:28.757Z info: CONFIG: Influxdb host IP: 192.168.100.20
butler-sos    | 2022-08-23T03:45:28.757Z info: CONFIG: Influxdb host port: 8086
butler-sos    | 2022-08-23T03:45:28.758Z info: CONFIG: Influxdb db name: senseops
butler-sos    | 2022-08-23T03:45:29.003Z info: CONFIG: Found InfluxDB database: senseops
butler-sos    | 2022-08-23T03:45:29.219Z info: --------------------------------------
butler-sos    | 2022-08-23T03:45:29.220Z info: Starting Butler SOS
butler-sos    | 2022-08-23T03:45:29.220Z info: Log level: verbose
butler-sos    | 2022-08-23T03:45:29.221Z info: App version: 9.2.0
butler-sos    | 2022-08-23T03:45:29.221Z info: Instance ID    : 87b978019ae........
butler-sos    | 2022-08-23T03:45:29.222Z info:
butler-sos    | 2022-08-23T03:45:29.223Z info: Node version   : v18.7.0
butler-sos    | 2022-08-23T03:45:29.223Z info: Architecture   : x64
butler-sos    | 2022-08-23T03:45:29.224Z info: Platform       : linux
butler-sos    | 2022-08-23T03:45:29.224Z info: Release        : 11
butler-sos    | 2022-08-23T03:45:29.224Z info: Distro         : Debian GNU/Linux
butler-sos    | 2022-08-23T03:45:29.224Z info: Codename       : bullseye
butler-sos    | 2022-08-23T03:45:29.224Z info: Virtual        : false
butler-sos    | 2022-08-23T03:45:29.225Z info: Processors     : 4
butler-sos    | 2022-08-23T03:45:29.225Z info: Physical cores : 4
butler-sos    | 2022-08-23T03:45:29.225Z info: Cores          : 4
butler-sos    | 2022-08-23T03:45:29.226Z info: Docker arch.   : undefined
butler-sos    | 2022-08-23T03:45:29.226Z info: Total memory   : 6233055232
butler-sos    | 2022-08-23T03:45:29.226Z info: Standalone app : false
butler-sos    | 2022-08-23T03:45:29.226Z info: --------------------------------------
butler-sos    | 2022-08-23T03:45:29.226Z info: Client cert: /nodeapp/config/certificate/client.pem
butler-sos    | 2022-08-23T03:45:29.227Z info: Client cert key: /nodeapp/config/certificate/client_key.pem
butler-sos    | 2022-08-23T03:45:29.227Z info: CA cert: /nodeapp/config/certificate/root.pem
butler-sos    | 2022-08-23T03:45:29.250Z verbose: MAIN: Anonymous telemetry reporting has been set up.
butler-sos    | 2022-08-23T03:45:29.252Z verbose: MAIN: Starting Docker healthcheck server...
butler-sos    | 2022-08-23T03:45:29.257Z info: USER EVENT: UDP server listening on 0.0.0.0:9997
butler-sos    | 2022-08-23T03:45:29.257Z info: LOG EVENT: UDP server listening on 0.0.0.0:9996
butler-sos    | 2022-08-23T03:45:29.290Z info: MAIN: Started Docker healthcheck server on port 12398.
butler-sos    | 2022-08-23T03:45:29.290Z info: MAIN: Starting Prometheus Butler SOS endpoint on 0.0.0.0:9842.
butler-sos    | 2022-08-23T03:45:29.291Z verbose: PROM: Setting up Prometheus client for server: sense1
butler-sos    | 2022-08-23T03:45:29.292Z verbose: PROM: Setting up Prometheus client for server: sense2
butler-sos    | 2022-08-23T03:45:29.310Z info: PROM: Prometheus Butler SOS metrics server now listening on port 9842
butler-sos    | 2022-08-23T03:45:29.311Z info: PROM: Prometheus Node.js metrics server now listening on port 0.0.0.0:9001
butler-sos    | 2022-08-23T03:45:30.911Z verbose: --------------------------------
butler-sos    | 2022-08-23T03:45:30.911Z verbose: Iteration # 1, Uptime: 0 months, 0 days, 0 hours, 0 minutes, 2.005 seconds, Heap used 33.26 MB of total heap 58.39 MB. External (off-heap): 3.57 MB. Memory allocated to process: 92.45 MB.
butler-sos    | 2022-08-23T03:45:31.051Z verbose: UPTIME NEW RELIC: Sent Butler SOS memory usage data to New Relic account 123456789 ("Ptarmigan Labs NR account")
butler-sos    | 2022-08-23T03:45:31.269Z verbose: MEMORY USAGE INFLUXDB: Sent Butler SOS memory usage data to InfluxDB
...
```

Once everything everything looks good you can stop the containers (ctrl-C), then start them again in daemon mode (i.e. running unattended in the background):

```bash
➜  butler-sos-docker docker-compose up -d
Starting butler-sos ... done
➜  butler-sos-docker
```

Setting the log level to info in the config file will reduce log output.

The Docker container implements Docker healthchecks, which means you can run `docker ps` to see whether the container is healthy or not (assuming Docker healthchecks are enabled in the config file, of course):

```bash
➜  butler-sos-docker docker ps
CONTAINER ID   IMAGE                             COMMAND                  CREATED              STATUS                    PORTS     NAMES
9d2253511a24   ptarmiganlabs/butler-sos:latest   "docker-entrypoint.s…"   About a minute ago   Up 17 seconds (healthy)             butler-sos
➜  butler-sos-docker
```
