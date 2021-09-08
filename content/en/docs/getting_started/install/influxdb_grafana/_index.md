---
title: "InfluxDB & Grafana"
linkTitle: "InfluxDB & Grafana"
weight: 70
description: >
  How to use Butler SOS with InfluxDB and Grafana using Docker.
---

{{< notice warning >}}
Butler SOS was developed with InfluxDB version 1.x in mind.  

InfluxDB is currently available in version 2.x and while this version brings lots of new goodies, it's not out-of-the-box compatible with Butler SOS.  
For that reason you should use the latest 1.x version of InfluxDB, which at the time of this writing is 1.8.4.

In due time Butler SOS will be updated to support InfluxDB 2.x too.
{{< /notice >}}

If you already have InfluxDB and/or Grafana running you can skip this section.

## Running in Docker using docker-compose

The easiest way to get started is to run these tools in Docker containers, controlled by docker-compose files.  
Running them under Kubernetes will give you a whole other level of fault tolerance, scalability etc - but this also requries much more when it comes to Kubernetes skills. Use the setup that's relevant to your use case.

You can use a single docker-compose file for Butler SOS, Prometheus and Grafana - or separate docker-compose files for each tool.

The advantage of using a single docker-compose file is that the entire stack of tools will be launched in unison. You can create dependencies between the tools if needed etc - very convenient.
On the other hand, having separate docker-compose files makes it easier to restart (or upgrade or in other ways change) a single service without affecting other services.

### Full stack docker-compose file

Let's start Butler SOS, InfluxDB and Grafana from a single `docker-compose_fullstack_influxdb.yml` file:

```bash
# docker-compose_fullstack_influxdb.yml
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
    networks:
      - senseops

  influxdb:
    image: influxdb:1.8.9
    container_name: influxdb
    restart: always
    volumes:
      - ./influxdb/data:/var/lib/influxdb   # Mount for influxdb data directory
      - ./influxdb/config:/etc/influxdb     # Mount for influxdb configuration
    ports:
      # The API for InfluxDB is served on port 8086
      - "8086:8086"
      - "8082:8082"
    environment:
      - "INFLUXDB_REPORTING_DISABLED=true"  # Disable usage reporting
    networks:
      - senseops

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: always
    ports:
      - "3000:3000"
    volumes:
      - ./grafana/data:/var/lib/grafana
    networks:
      - senseops

networks:
  senseops:
    driver: bridge
```

Assuming you've already completed the [setup of Butler SOS](/docs/getting_started/setup/), the result of running the `docker-compose_fullstack_influxdb.yml` file above is something like this:

```bash
➜ docker-compose -f docker-compose_fullstack_influxdb.yml up
Starting grafana    ... done
Starting butler-sos ... done
Starting influxdb   ... done
Attaching to grafana, butler-sos, influxdb
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Starting Grafana" logger=server version=8.0.6 commit=68fe9e3431 branch=HEAD compiled=2021-07-15T07:49:19+0000
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Config loaded from" logger=settings file=/usr/share/grafana/conf/defaults.ini
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Config loaded from" logger=settings file=/etc/grafana/grafana.ini
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Config overridden from command line" logger=settings arg="default.paths.data=/var/lib/grafana"
influxdb      | grep: /etc/influxdb/influxdb.conf: No such file or directory
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Config overridden from command line" logger=settings arg="default.paths.logs=/var/log/grafana"
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Config overridden from command line" logger=settings arg="default.paths.plugins=/var/lib/grafana/plugins"
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Config overridden from command line" logger=settings arg="default.paths.provisioning=/etc/grafana/provisioning"
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Config overridden from command line" logger=settings arg="default.log.mode=console"
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Config overridden from Environment variable" logger=settings var="GF_PATHS_DATA=/var/lib/grafana"
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Config overridden from Environment variable" logger=settings var="GF_PATHS_LOGS=/var/log/grafana"
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Config overridden from Environment variable" logger=settings var="GF_PATHS_PLUGINS=/var/lib/grafana/plugins"
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Config overridden from Environment variable" logger=settings var="GF_PATHS_PROVISIONING=/etc/grafana/provisioning"
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Path Home" logger=settings path=/usr/share/grafana
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Path Data" logger=settings path=/var/lib/grafana
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Path Logs" logger=settings path=/var/log/grafana
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Path Plugins" logger=settings path=/var/lib/grafana/plugins
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Path Provisioning" logger=settings path=/etc/grafana/provisioning
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="App mode production" logger=settings
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Connecting to DB" logger=sqlstore dbtype=sqlite3
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Starting DB migrations" logger=migrator
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="migrations completed" logger=migrator performed=0 skipped=330 duration=3.8592ms
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Starting plugin search" logger=plugins
influxdb      | ts=2021-08-05T13:32:26.796627Z lvl=info msg="InfluxDB starting" log_id=0Vmd55B0000 version=1.8.6 branch=1.8 commit=v1.8.6
influxdb      | ts=2021-08-05T13:32:26.796666Z lvl=info msg="Go runtime" log_id=0Vmd55B0000 version=go1.13.8 maxprocs=4
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Registering plugin" logger=plugins id=input
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Registering plugin" logger=plugins id=grafana-plugin-admin-app
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="Live Push Gateway initialization" logger=live.push_http
grafana       | t=2021-08-05T13:32:26+0000 lvl=info msg="HTTP Server Listen" logger=http.server address=[::]:3000 protocol=http subUrl= socket=
influxdb      | ts=2021-08-05T13:32:26.899419Z lvl=info msg="Using data dir" log_id=0Vmd55B0000 service=store path=/root/.influxdb/data
influxdb      | ts=2021-08-05T13:32:26.899479Z lvl=info msg="Compaction settings" log_id=0Vmd55B0000 service=store max_concurrent_compactions=2 throughput_bytes_per_second=50331648 throughput_bytes_per_second_burst=50331648
influxdb      | ts=2021-08-05T13:32:26.899581Z lvl=info msg="Open store (start)" log_id=0Vmd55B0000 service=store trace_id=0Vmd55_l000 op_name=tsdb_open op_event=start
influxdb      | ts=2021-08-05T13:32:26.899693Z lvl=info msg="Open store (end)" log_id=0Vmd55B0000 service=store trace_id=0Vmd55_l000 op_name=tsdb_open op_event=end op_elapsed=0.109ms
influxdb      | ts=2021-08-05T13:32:26.899786Z lvl=info msg="Opened service" log_id=0Vmd55B0000 service=subscriber
influxdb      | ts=2021-08-05T13:32:26.899803Z lvl=info msg="Starting monitor service" log_id=0Vmd55B0000 service=monitor
influxdb      | ts=2021-08-05T13:32:26.899818Z lvl=info msg="Registered diagnostics client" log_id=0Vmd55B0000 service=monitor name=build
influxdb      | ts=2021-08-05T13:32:26.899834Z lvl=info msg="Registered diagnostics client" log_id=0Vmd55B0000 service=monitor name=runtime
influxdb      | ts=2021-08-05T13:32:26.899917Z lvl=info msg="Registered diagnostics client" log_id=0Vmd55B0000 service=monitor name=network
influxdb      | ts=2021-08-05T13:32:26.899948Z lvl=info msg="Registered diagnostics client" log_id=0Vmd55B0000 service=monitor name=system
influxdb      | ts=2021-08-05T13:32:26.899970Z lvl=info msg="Starting precreation service" log_id=0Vmd55B0000 service=shard-precreation check_interval=10m advance_period=30m
influxdb      | ts=2021-08-05T13:32:26.899991Z lvl=info msg="Starting snapshot service" log_id=0Vmd55B0000 service=snapshot
influxdb      | ts=2021-08-05T13:32:26.900075Z lvl=info msg="Starting continuous query service" log_id=0Vmd55B0000 service=continuous_querier
influxdb      | ts=2021-08-05T13:32:26.900094Z lvl=info msg="Starting HTTP service" log_id=0Vmd55B0000 service=httpd authentication=false
influxdb      | ts=2021-08-05T13:32:26.900107Z lvl=info msg="opened HTTP access log" log_id=0Vmd55B0000 service=httpd path=stderr
influxdb      | ts=2021-08-05T13:32:26.900345Z lvl=info msg="Listening on HTTP" log_id=0Vmd55B0000 service=httpd addr=[::]:8086 https=false
influxdb      | ts=2021-08-05T13:32:26.900576Z lvl=info msg="Starting retention policy enforcement service" log_id=0Vmd55B0000 service=retention check_interval=30m
influxdb      | ts=2021-08-05T13:32:26.900703Z lvl=info msg="Listening for signals" log_id=0Vmd55B0000
influxdb      | ts=2021-08-05T13:32:26.900853Z lvl=info msg="Storing statistics" log_id=0Vmd55B0000 service=monitor db_instance=_internal db_rp=monitor interval=10s
butler-sos    | 2021-08-05T13:32:27.171Z info: CONFIG: Influxdb enabled: true
butler-sos    | 2021-08-05T13:32:27.174Z info: CONFIG: Influxdb host IP: 192.168.100.20
butler-sos    | 2021-08-05T13:32:27.175Z info: CONFIG: Influxdb host port: 8086
butler-sos    | 2021-08-05T13:32:27.175Z info: CONFIG: Influxdb db name: SenseOps
butler-sos    | 2021-08-05T13:32:27.370Z info: CONFIG: Found InfluxDB database: SenseOps
butler-sos    | 2021-08-05T13:32:27.467Z info: --------------------------------------
butler-sos    | 2021-08-05T13:32:27.468Z info: Starting Butler SOS
butler-sos    | 2021-08-05T13:32:27.469Z info: Log level: verbose
butler-sos    | 2021-08-05T13:32:27.469Z info: App version: 5.6.2
butler-sos    | 2021-08-05T13:32:27.469Z info:
butler-sos    | 2021-08-05T13:32:27.470Z info: Node version   : v14.17.0
butler-sos    | 2021-08-05T13:32:27.470Z info: Architecture   : x64
butler-sos    | 2021-08-05T13:32:27.470Z info: Platform       : linux
butler-sos    | 2021-08-05T13:32:27.470Z info: Release        : 9
butler-sos    | 2021-08-05T13:32:27.471Z info: Distro         : Debian GNU/Linux
butler-sos    | 2021-08-05T13:32:27.471Z info: Codename       : stretch
butler-sos    | 2021-08-05T13:32:27.471Z info: Virtual        : false
butler-sos    | 2021-08-05T13:32:27.471Z info: Processors     : 4
butler-sos    | 2021-08-05T13:32:27.472Z info: Physical cores : 4
butler-sos    | 2021-08-05T13:32:27.472Z info: Cores          : 4
butler-sos    | 2021-08-05T13:32:27.472Z info: Docker arch.   : undefined
butler-sos    | 2021-08-05T13:32:27.473Z info: Total memory   : 6235168768
butler-sos    | 2021-08-05T13:32:27.473Z info: --------------------------------------
butler-sos    | 2021-08-05T13:32:27.473Z info: Client cert: /nodeapp/config/certificate/client.pem
butler-sos    | 2021-08-05T13:32:27.474Z info: Client cert key: /nodeapp/config/certificate/client_key.pem
butler-sos    | 2021-08-05T13:32:27.474Z info: CA cert: /nodeapp/config/certificate/root.pem
butler-sos    | 2021-08-05T13:32:27.476Z verbose: MAIN: Anonymous telemetry reporting has been set up.
butler-sos    | 2021-08-05T13:32:27.476Z verbose: MAIN: Starting Docker healthcheck server...
butler-sos    | 2021-08-05T13:32:27.494Z info: MAIN: Docker healthcheck server now listening
...
...
```

From a separate shell we can then ensure that the expected Docker containers are running:

```bash
➜ docker ps
CONTAINER ID   IMAGE                             COMMAND                  CREATED         STATUS                            PORTS                                                                                  NAMES
b18bb3842039   ptarmiganlabs/butler-sos:latest   "docker-entrypoint.s…"   8 minutes ago   Up About a minute (healthy)                                                                                          butler-sos
0e6c22af1252   influxdb:1.8.6                    "/entrypoint.sh infl…"   8 minutes ago   Up About a minute             0.0.0.0:8082->8082/tcp, :::8082->8082/tcp, 0.0.0.0:8086->8086/tcp, :::8086->8086/tcp   influxdb
9a4a9bf95f3c   grafana/grafana:latest            "/run.sh"                8 minutes ago   Up About a minute             0.0.0.0:3000->3000/tcp, :::3000->3000/tcp                                              grafana
➜ 
```

That's great, you now have a single command (```docker-compose -f docker-compose_fullstack_influxdb.yml up -d``` for background/daemon mode) to bring up all the tools needed to monitor a Qlik Sense cluster!

Need to stop the entire stack of tools?  
Easy - just run `docker-compose -f docker-compose_fullstack_influxdb.yml down`:

```bash
➜ docker-compose -f docker-compose_fullstack_influxdb.yml down
Stopping butler-sos ... done
Stopping influxdb   ... done
Stopping grafana    ... done
Removing butler-sos ... done
Removing influxdb   ... done
Removing grafana    ... done
Removing network butler-sos_senseops
➜
```
