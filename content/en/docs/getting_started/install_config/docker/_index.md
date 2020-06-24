---
title: "Docker"
linkTitle: "Docker"
weight: 4
description: >
  Running Butler SOS in Docker. Installation and configuration.
---

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
      - "./logs:/nodeapp/logs"
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

proton:butler-sos-docker goran$ docker-compose up
➜ docker-compose up
Creating butler-sos ... done
Attaching to butler-sos
butler-sos    | 2020-06-24T21:38:43.386Z debug: CONFIG: Setting up new Influx database: Found server tag : server_group
butler-sos    | 2020-06-24T21:38:43.388Z debug: CONFIG: Setting up new Influx database: Found server tag : serverLocation
butler-sos    | 2020-06-24T21:38:43.388Z debug: CONFIG: Setting up new Influx database: Found server tag : server-type
butler-sos    | 2020-06-24T21:38:43.388Z debug: CONFIG: Setting up new Influx database: Found server tag : serverBrand
butler-sos    | 2020-06-24T21:38:43.388Z info: CONFIG: Influxdb enabled: true
butler-sos    | 2020-06-24T21:38:43.389Z info: CONFIG: Influxdb host IP: 192.168.100.20
butler-sos    | 2020-06-24T21:38:43.389Z info: CONFIG: Influxdb host port: 8086
butler-sos    | 2020-06-24T21:38:43.389Z info: CONFIG: Influxdb db name: SenseOps
butler-sos    | 2020-06-24T21:38:43.458Z debug: HEARTBEAT: Setting up heartbeat to remote: http://healthcheck.ptarmiganlabs.net:8000/ping/ddbcfb17-a2bb-42da-849d-d2a6f0cb28a1
butler-sos    | 2020-06-24T21:38:43.459Z info: --------------------------------------
butler-sos    | 2020-06-24T21:38:43.459Z info: Starting Butler SOS
butler-sos    | 2020-06-24T21:38:43.459Z info: Log level: debug
butler-sos    | 2020-06-24T21:38:43.460Z info: App version: 5.4.0
butler-sos    | 2020-06-24T21:38:43.460Z info: --------------------------------------
butler-sos    | 2020-06-24T21:38:43.460Z debug: Client cert: /Users/goran/code/secret/pro2win1-nopwd/client.pem
butler-sos    | 2020-06-24T21:38:43.460Z debug: Client cert key: /Users/goran/code/secret/pro2win1-nopwd/client_key.pem
butler-sos    | 2020-06-24T21:38:43.460Z debug: CA cert: /Users/goran/code/secret/pro2win1-nopwd/root.pem
butler-sos    | 2020-06-24T21:38:43.460Z debug: USER SESSIONS: Monitor user sessions for these servers/virtual proxies: [
butler-sos    |   {
butler-sos    |     "host": "pro2-win1.ptarmiganlabs.net:4747",
butler-sos    |     "serverName": "sense1",
butler-sos    |     "serverDescription": "Central",
butler-sos    |     "logDbHost": "pro2-win1",
butler-sos    |     "userSessions": {
butler-sos    |       "enable": true,
butler-sos    |       "host": "pro2-win1.ptarmiganlabs.net:4243",
butler-sos    |       "virtualProxies": [
butler-sos    |         {
butler-sos    |           "virtualProxy": "/"
butler-sos    |         },
butler-sos    |         {
butler-sos    |           "virtualProxy": "/hdr"
butler-sos    |         }
butler-sos    |       ]
butler-sos    |     },
butler-sos    |     "serverTags": {
butler-sos    |       "server_group": "CENTRAL",
butler-sos    |       "serverLocation": "Europe",
butler-sos    |       "server-type": "virtual",
butler-sos    |       "serverBrand": "HP"
butler-sos    |     }
butler-sos    |   }
butler-sos    | ]
butler-sos    | 2020-06-24T21:38:43.648Z info: CONFIG: Created new InfluxDB database: SenseOps
butler-sos    | 2020-06-24T21:38:43.679Z debug: HEARTBEAT: Sent heartbeat to http://healthcheck.ptarmiganlabs.net:8000/ping/ddbcfb17-a2bb-42da-849d-d2a6f0cb28a1
butler-sos    | 2020-06-24T21:38:43.771Z info: CONFIG: Created new InfluxDB retention policy: 10d
butler-sos    | 2020-06-24T21:38:50.459Z verbose: --------------------------------
butler-sos    | 2020-06-24T21:38:50.460Z verbose: Iteration # 1, Uptime: 7 seconds, Heap used 22.24 MB of total heap 56.43 MB. Memory allocated to process: 68.78 MB.
butler-sos    | 2020-06-24T21:38:50.461Z debug: MEMORY USAGE: Memory usage {
  "instanceTag": "DEV",
  "heapUsed": 22.24,
  "heapTotal": 56.43,
  "processMemory": 68.78
})
butler-sos    | 2020-06-24T21:38:51.462Z verbose: MEMORY USAGE: Sent Butler SOS memory usage data to InfluxDB
...
...

```

Once everything everything looks good you can stop the container (ctrl-C), then start it again in daemon mode (i.e. running unattended in the background):

```bash

proton:butler-sos-docker goran$ docker-compose up -d
Starting butler-sos ... done
proton:butler-sos-docker goran$

```

Setting the log level to info in the config file will reduce log output.

The Docker container implements Docker healthchecks, which means you can run `docker ps` to see whether the container is healthy or not (assuming Docker healthchecks are enabled in the config file, of course):

```bash

➜ docker ps
CONTAINER ID        IMAGE                           COMMAND                  CREATED             STATUS                    PORTS               NAMES
905f21443f97        ptarmiganlabs/butler-sos:5.0.0   "docker-entrypoint.s…"   6 minutes ago       Up 22 seconds (healthy)                       butler-sos

```
