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
Instead we (in this case) use a docker-compose file to define how Butler SOS should be executed within a Docker container.  

Configuration of Butler specific settings is then done using a YAML file.

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

3. Copy the [YAML config file](https://github.com/ptarmiganlabs/butler-sos/blob/master/src/config/production_template.yaml) from the GitHub repository into the ./config directory, rename it to `production.yaml` (or something else, as long as it matches the NODE_ENV environment variable) and edit it as needed. Note that for the Docker setup the path to certificates (as specified in the YAML config file) should be `/nodeapp/config/certificate/` (this is the Docker container's internal path to the certificate directory).

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

What does the config file look like?

```bash

proton:butler-sos-docker goran$ cat config/production_template.yaml
Butler-SOS:
  # All configuration items are mandatory, unless otherwise noted.

  # Heartbeats can be used to send "I'm alive" messages to some other tool, e.g. an infrastructure monitoring tool
  # The concept is simple: The remoteURL will be called at the specified frequency. The receiving tool will then know
  # that Butler SOS is alive.
  heartbeat:
    enabled: false
    remoteURL: http://my.monitoring.server/some/path/
    frequency: every 1 hour         # https://bunkat.github.io/later/parsers.html

  # Logging configuration
  logLevel: info          # Log level. Possible log levels are silly, debug, verbose, info, warn, error
  fileLogging: true       # true/false to enable/disable logging to disk file
  logDirectory: logs      # Subdirectory where log files are stored

  # Qlik Sense logging db config parameters
  logdb:
    enableLogDb: true
    # Items below are mandatory if enableLogDb=true
    influxDbRetentionPolicy: DEFAULT  # Name of Influxdb policy used to determine how long
                                      #   log db data should be kept in Influxdb
    pollingInterval: 60000    # How often (milliseconds) should Postgres log db be queried for warnings and errors?
    queryPeriod: 5 minutes    # How far back should Butler SOS query for log entries? Default is 5 min
    host: <IP or FQDN of Qlik Sense logging db>
    port: 4432
    qlogsReaderUser: qlogs_reader
    qlogsReaderPwd: <pwd>
    extractErrors: true       # Should error level entries be extracted from log db into Influxdb?
    extractWarnings: true     # Should warn level entries be extracted from log db into Influxdb?
    extractInfo: true         # Should info level entries be extracted from log db into Influxdb?
                              # Warning! Seting this to true will result in LOTS of log messages
                              # being retrrieved by Butler SOS!

  # Certificates to use when querying Sense for healthcheck data. Get these from the Certificate Export in QMC.
  cert:
    clientCert: <path/to/cert/client.pem>
    clientCertKey: <path/to/cert/client_key.pem>
    clientCertCA: <path/to/cert/root.pem>
    clientCertPassphrase:
    # If running Butler SOS in a Docker container, the cert paths MUST be the following
    # clientCert: /nodeapp/config/certificate/client.pem
    # clientCertKey: /nodeapp/config/certificate/client_key.pem
    # clientCertCA: /nodeapp/config/certificate/root.pem
    # clientCertPassphrase:

  # MQTT config parameters
  mqttConfig:
    enableMQTT: false
    # Items below are mandatory if enableMQTT=true
    brokerHost: <IP of MQTT server>
    brokerPort: 1883
    baseTopic: butler-sos/          # Topic should end with /

  # Influx db config parameters
  influxdbConfig:
    enableInfluxdb: true
    # Items below are mandatory if enableInfluxdb=true
    hostIP: <IP or FQDN of Influxdb server>
    hostPort: <Port where Influxdb is listening>    # Optional. Default value=8086
    auth:
      enable: false                 # Does influxdb instance require authentication (true/false)?
      username: <username>          # Username for Influxdb authentication. Mandatory if auth.enable=true
      password: <password>          # Password for Influxdb authentication. Mandatory if auth.enable=true
    dbName: SenseOps

    # Default retention policy that should be created in InfluxDB when Butler SOS creates a new database there.
    # Any data older than retention policy threshold will be purged from InfluxDB.
    retentionPolicy:
      name: 2_weeks
      duration: 2w

    # Control whether certain fields are stored in InfluxDB or not
    # Use with caution! Enabling activeDocs, loadedDocs or inMemoryDocs may result in lots of data sent to InfluxDB.
    includeFields:
      activeDocs: false              # Should data on what docs are active be stored in Influxdb (true/false)?
      loadedDocs: false              # Should data on what docs are loaded be stored in Influxdb (true/false)?
      inMemoryDocs: false            # Should data on what docs are in memory be stored in Influxdb (true/false)?

  # Extract app names
  appNames:
    enableAppNameExtract: true    # Extract app names in addition to app IDs (tue/false)?
    extractInterval: 60000        # How often (milliseconds) should app names be extracted?
    hostIP: <IP or FQDN>          # What Sense server should be queried for app names?

  # Sessions per virtual proxy
  userSessions:
    enableSessionExtract: true      # Query unique user IDs of what users have sessions open (true/false)?
    # Items below are mandatory if enableSessionExtract=true
    pollingInterval: 30000          # How often (milliseconds) should detailed session data be polled?

  serversToMonitor:
    pollingInterval: 15000          # How often (milliseconds) should the healthcheck API be polled?

    # List of extra tags for each server. Useful for creating more advanced Grafana dashboards.
    # Each server below MUST include these tags in its serverTags property.
    # The tags below are just examples - define your own as needed
    serverTagsDefinition:
      - server_group
      - serverLocation
      - server-type
      - serverBrand

    # Sense Servers that should be queried for healthcheck data
    servers:
      - host: <server1.my.domain>:4747
        serverName: <server1>
        serverDescription: <description>
        logDbHost: <host name as used in QLogs db>
        userSessions:
          enable: true
          # Items below are mandatory if userSessions.enable=true
          host: <server1.my.domain>:4243
          virtualProxies:
            - virtualProxy: /                 # Default virtual proxy
            - virtualProxy: /hdr              # "hdr" virtual proxy
        serverTags:
          server_group: DEV
          serverLocation: Asia
          server-type: virtual
          serverBrand: Dell
      - host: <server2.my.domain>:4747
        serverName: <server2>
        serverDescription: <description>
        logDbHost: <host name as used in QLogs db>
        userSessions:
          enable: true
          # Items below are mandatory if userSessions.enable=true
          host: <server2.my.domain>:4243
          virtualProxies:
            - virtualProxy: /finance          # "finance" virtual proxy
        serverTags:
          server_group: PROD
          serverLocation: Europe
          server-type: physical
          serverBrand: HP

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

Ok, all good. Let's start Butler SOS using docker-compose (the exact output will depend on what version of Butler SOS you are using):

```bash

proton:butler-sos-docker goran$ docker-compose up
➜ docker-compose up
Creating butler-sos ... done
Attaching to butler-sos
butler-sos    | 2019-10-12T20:14:21.814Z debug: CONFIG: Setting up new Influx database: Found server tag : server_group
butler-sos    | 2019-10-12T20:14:21.824Z debug: CONFIG: Setting up new Influx database: Found server tag : serverLocation
butler-sos    | 2019-10-12T20:14:21.826Z debug: CONFIG: Setting up new Influx database: Found server tag : server-type
butler-sos    | 2019-10-12T20:14:21.829Z debug: CONFIG: Setting up new Influx database: Found server tag : serverBrand
butler-sos    | 2019-10-12T20:14:21.831Z info: CONFIG: Influxdb enabled: true
butler-sos    | 2019-10-12T20:14:21.832Z info: CONFIG: Influxdb host IP: 192.168.100.20
butler-sos    | 2019-10-12T20:14:21.833Z info: CONFIG: Influxdb host port: 8086
butler-sos    | 2019-10-12T20:14:21.834Z info: CONFIG: Influxdb db name: SenseOps
butler-sos    | 2019-10-12T20:14:22.006Z info: --------------------------------------
butler-sos    | 2019-10-12T20:14:22.006Z info: Starting Butler SOS
butler-sos    | 2019-10-12T20:14:22.009Z info: Log level is: debug
butler-sos    | 2019-10-12T20:14:22.010Z info: App version is: 5.0.0
butler-sos    | 2019-10-12T20:14:22.011Z info: --------------------------------------
butler-sos    | 2019-10-12T20:14:22.012Z debug: Client cert: /nodeapp/config/certificate/client.pem
butler-sos    | 2019-10-12T20:14:22.013Z debug: Client cert key: /nodeapp/config/certificate/client_key.pem
butler-sos    | 2019-10-12T20:14:22.014Z debug: CA cert: /nodeapp/config/certificate/root.pem
butler-sos    | 2019-10-12T20:14:22.018Z debug: USER SESSIONS: Monitor user sessions for these servers/virtual proxies: [
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
butler-sos    | 2019-10-12T20:14:22.028Z info: MAIN: Docker healthcheck server now listening
butler-sos    | 2019-10-12T20:14:22.075Z info: CONFIG: Found InfluxDB database: SenseOps
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

The Docker container implements Docker healthchecks, which means you can run `docker ps` to see whether the container is healthy or not:

```bash

➜ docker ps
CONTAINER ID        IMAGE                           COMMAND                  CREATED             STATUS                    PORTS               NAMES
905f21443f97        ptarmiganlabs/butler-sos:5.0.0   "docker-entrypoint.s…"   6 minutes ago       Up 22 seconds (healthy)                       butler-sos

```
