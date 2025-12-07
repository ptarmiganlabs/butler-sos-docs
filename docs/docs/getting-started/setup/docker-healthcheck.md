---
outline: deep
---

# Docker Healthcheck

Docker has a concept of "health checks", which is a way for Docker containers to tell the Docker runtime engine that the container is alive and well.

Butler SOS can be configured to send such health check messages to Docker.

::: info Optional
These settings are optional.

If you don't need this feature just disable it and leave the default values in the config as they are.

Do note though that Butler SOS expects the configuration properties below to exist in the config file, but will _ignore their values_ if the related features are disabled.
:::

::: tip Note
Sending health check messages is only meaningful when running Butler SOS as a Docker container.
:::

## Settings in Main Config File

```yaml
Butler-SOS:
  ...
  ...
  # Docker health checks are used when running Butler SOS as a Docker container.
  # The Docker engine will call the container's health check REST endpoint with a set interval to determine
  # whether the container is alive/well or not.
  # If you are not running Butler SOS in Docker you can safely disable this feature.
  dockerHealthCheck:
    enable: true                    # Control whether a REST endpoint will be set up to serve Docker health check messages
    port: 12398                     # Port the Docker health check service runs on (if enabled)
  ...
  ...
```
