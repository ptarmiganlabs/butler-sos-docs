---
title: "Prometheus & Grafana"
linkTitle: "Prometheus & Grafana"
weight: 80
description: >
  How to use Butler SOS with Prometheus and Grafana using Docker.
---

{{< notice warning >}}
Prometheus is extremely powerful and flexible.  
In fact, it's probably the closest thing there is to a de facto standard for monitoring large scale software systems today.  
No matter if you run Kubernetes cluster spanning multiple data centers and continents, or just a single Butler SOS instance - Prometheus is an excellent choice for monitoring of operational metrics.

That power and flexibility also means it can be challenging to set up Prometheus.  
Usually it's not that difficult, but if you're new to Docker and has no previous experience with monitoring tools, [using InfluxDB](/docs/getting_started/install/influxdb_grafana/) is usually a bit easier.

Or view it as a chance to learn more about one of the absolute stars of open source software - Prometheus is awesome!
{{< /notice >}}

This page assumes you **don't** already have Prometheus and Grafana running.  
If you already have access to those tools you can of course instead configure them to work with Butler SOS.

## Running in Docker using docker-compose

The easiest way to get started is to run these tools in Docker containers, controlled by docker-compose files.  
Running them under Kubernetes will give you a whole other level of fault tolerance, scalability etc - but this also requries much more when it comes to Kubernetes skills.
Use the setup that's relevant to your use case.  

You can use a single docker-compose file for Butler SOS, Prometheus and Grafana - or separate docker-compose files for each tool.

The advantage of using a single docker-compose file is that the entire stack of tools will be launched in unison. You can create dependencies between the tools if needed etc - very convenient.
On the other hand, having separate docker-compose files makes it easier to restart (or upgrade or in other ways change) a single service without affecting other services.

### Full stack docker-compose file

Let's start Butler SOS, Prometheus and Grafana from a single `docker-compose_fullstack_prometheus.yml` file:

```bash
# docker-compose_fullstack_prometheus.yml
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
      - "NODE_ENV=production_prometheus"         # Means that Butler SOS will read config data from production_prometheus.yaml 
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "5m"
    networks:
      - senseops


  prometheus:
    image: prom/prometheus:v2.29.2
    container_name: prometheus
    volumes:
      - ./prometheus/:/etc/prometheus/
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'
      - '--log.level=debug'
    ports:
      - 9090:9090
    links:
      - cadvisor:cadvisor
      - alertmanager:alertmanager
    depends_on:
      - cadvisor
    networks:
      - senseops
    restart: always


  alertmanager:
    image: prom/alertmanager
    container_name: alertmanager
    ports:
      - 9093:9093
    volumes:
      - ./alertmanager/:/etc/alertmanager/
    networks:
      - senseops
    restart: always
    command:
      - '--config.file=/etc/alertmanager/config.yml'
      - '--storage.path=/alertmanager'


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

...
...
```

From a separate shell we can then ensure that the expected Docker containers are running:

```bash
➜ docker ps
CONTAINER ID   IMAGE                             COMMAND                  CREATED         STATUS                            PORTS                                                                                  NAMES
➜ 
```

That's great, you now have a single command (```docker-compose -f docker-compose_fullstack_influxdb.yml up -d``` for background/daemon mode) to bring up all the tools needed to monitor a Qlik Sense cluster!

Need to stop the entire stack of tools?  
Easy - just run `docker-compose -f docker-compose_fullstack_influxdb.yml down`:

```bash
➜ docker-compose -f docker-compose_fullstack_influxdb.yml down
➜
```
