---
title: "InfluxDB & Grafana"
linkTitle: "InfluxDB & Grafana"
weight: 70
description: >
  How to run InfluxDB and Grafana using Docker.
---

{{< notice warning >}}
Butler SOS was developed with InfluxDB version 1.x in mind.  

InfluxDB is currently available in version 2.x and while this version brings lots of new goodies, it's not out-of-the-box compatible with Butler SOS.  
For that reason you should use the latest 1.x version of InfluxDB, which at the time of this writing is 1.8.4.

In due time Butler SOS will be updated to support InfluxDB 2.x too.
{{< /notice >}}

If you already have InfluxDB and/or Grafana running you can skip this section.

## Running in Docker using docker-compose

The easiest (and arguably the best) way is to run these tools in Docker containers, controlled by docker-compose files.  

You can use a single docker-compose file for Butler SOS, InfluxDB and Grafana - or several files for more granular control.  

The advantage of using a single docker-compose file is that the entire stack of tools will be launched in unison. You can create dependencies between the tools if needed etc - very convenient.
On the other hand, having separate docker-compose files makes it easier to restart (or upgrade or in other ways change) a single service without affecting other services.

### Full stack docker-compose file

Let's start Butler SOS, InfluxDB and Grafana from a single docker-compose.yaml file:

```bash

# docker-compose.yml
version: '3.3'
services:
  butler-sos:
    image: mountaindude/butler-sos:latest
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
    image: influxdb:1.8.4
    container_name: influxdb
    restart: always
    volumes:
      # Mount for influxdb data directory
      - ./influxdb/data:/var/lib/influxdb
      # Mount for influxdb configuration
      - ./influxdb/config/:/etc/influxdb/
    ports:
      # The API for InfluxDB is served on port 8086
      - "8086:8086"
      - "8082:8082"
    environment:
      # Disable usage reporting
      - "INFLUXDB_REPORTING_DISABLED=true"
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

Assuming you've already completed the [setup of Butler SOS](/docs/getting_started/setup/), the result of running the `docker-compose.yaml` file above is something like this:

```bash

~/code/butler-sos_fullstack
➜ docker-compose -f docker-compose_fullstack.yaml up

Creating network "butler-sos_fullstack_senseops" with driver "bridge"
Pulling influxdb (influxdb:1.8.4)...
1.8.4: Pulling from library/influxdb
092586df9206: Already exists
ef599477fae0: Already exists
4530c6472b5d: Already exists
894a5f7b9fb5: Pull complete
54457be0a97c: Pull complete
217dafcc764f: Pull complete
30c228ee47d0: Pull complete
5a7d00e87e5e: Pull complete
Digest: sha256:f0b7acde2d7fa215576a9f83abbf363b6f5641896535a01dbaf62299ab2272f9
Status: Downloaded newer image for influxdb:1.8.4
Pulling grafana (grafana/grafana:latest)...
latest: Pulling from grafana/grafana
9d48c3bd43c5: Pull complete
df58635243b1: Pull complete
09b2e1de003c: Pull complete
f21b6d64aaf0: Pull complete
719d3f6b4656: Pull complete
d18fca935678: Pull complete
7c7f1ccbce63: Pull complete
Digest: sha256:a10521576058f40427306fcb5be48138c77ea7c55ede24327381211e653f478a
Status: Downloaded newer image for grafana/grafana:latest
Creating butler-sos ... done
Creating grafana    ... done
Creating influxdb   ... done
Attaching to butler-sos, grafana, influxdb
grafana       | t=2019-10-17T04:32:23+0000 lvl=info msg="Starting Grafana" logger=server version=6.4.3 commit=3a2bfb7 branch=HEAD compiled=2019-10-16T09:32:09+0000
grafana       | t=2019-10-17T04:32:23+0000 lvl=info msg="Config loaded from" logger=settings file=/usr/share/grafana/conf/defaults.ini
grafana       | t=2019-10-17T04:32:23+0000 lvl=info msg="Config loaded from" logger=settings file=/etc/grafana/grafana.ini
grafana       | t=2019-10-17T04:32:23+0000 lvl=info msg="Config overridden from command line" logger=settings arg="default.paths.data=/var/lib/grafana"
grafana       | t=2019-10-17T04:32:23+0000 lvl=info msg="Config overridden from command line" logger=settings arg="default.paths.logs=/var/log/grafana"

```

From a separate shell we can then ensure that the expected Docker containers are running:

```bash

~/code/butler-sos_fullstack
➜ docker ps
CONTAINER ID        IMAGE                           COMMAND                  CREATED             STATUS                    PORTS                                            NAMES
5e59e89d3185        grafana/grafana:latest          "/run.sh"                7 minutes ago       Up 37 seconds             0.0.0.0:3000->3000/tcp                           grafana
5b8ce73b20e6        influxdb:1.8.4                 "/entrypoint.sh infl…"   7 minutes ago       Up 36 seconds             0.0.0.0:8082->8082/tcp, 0.0.0.0:8086->8086/tcp   influxdb
73b0bb526261        mountaindude/butler-sos:5.2.0   "docker-entrypoint.s…"   7 minutes ago       Up 37 seconds (healthy)                                                    butler-sos

~/code/butler-sos_fullstack

```

That's great, you now have a single command (```docker-compose -f docker-compose_fullstack.yaml up -d``` for background/daemon mode) to bring up all the tools needed to monitor a Qlik Sense cluster!

Need to stop the entire stack of tools?  
Easy - just run `docker-compose -f docker-compose_fullstack.yaml down`:

```bash

~/code/butler-sos_fullstack
➜ docker-compose -f docker-compose_fullstack.yaml down
Stopping grafana    ... done
Stopping influxdb   ... done
Stopping butler-sos ... done
Removing grafana    ... done
Removing influxdb   ... done
Removing butler-sos ... done
Removing network butler-sos_fullstack_senseops

~/code/butler-sos_fullstack
➜

```
