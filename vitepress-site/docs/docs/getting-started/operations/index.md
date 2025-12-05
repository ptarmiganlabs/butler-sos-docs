# Day 2 Operations

How to start and keep Butler SOS running varies depending on whether you are using Docker or a native Windows/Linux/macOS binary.

## Running Butler SOS with Docker

Starting Butler SOS using Docker is easy.

### Initial Setup and Testing

First configure the `docker-compose.yml` file as needed, then start the Docker container in interactive mode (with output sent to the screen).  
This is useful to ensure everything works as intended when first setting up Butler SOS.

```bash
docker compose up
```

Once Butler SOS has been verified to work as intended, hit `Ctrl+C` to stop it.

### Production Mode

Then start it again in daemon (background) mode:

```bash
docker compose up -d
```

From here on the Docker environment will make sure Butler SOS is always running, including restarting it if it for some reason stops, when server reboots etc.

## Running Pre-built Standalone Binaries

Starting Butler SOS using the pre-built binaries could look like this on Windows:

```bash
d:
cd \node\butler-sos
butler-sos.exe --configfile butler-sos-prod.yaml --loglevel info
```

It is of course also possible to put those commands in a command file (`.bat` on Windows, `.sh` etc on other platforms) and execute that file instead.

### Running as a Service

As Butler SOS is the kind of service that (probably) should always be running on a server, it makes sense running it as a Windows service (or similar mechanism in Linux).

#### Windows: Using NSSM

On Windows you can use the excellent [NSSM tool](https://nssm.cc) to achieve this, with all the benefits that follow (the service can be monitored using operations tools, automatic restarts etc).

A step-by-step tutorial for running Butler SOS as a Windows service using NSSM is available at [ptarmiganlabs.com](https://ptarmiganlabs.com/running-butler-tools-as-windows-services/).

#### Linux: Using PM2 or Forever

On Linux both [PM2](https://github.com/Unitech/pm2) and [Forever](https://github.com/foreverjs/forever) have been successfully tested with Butler SOS.

## Monitoring Butler SOS

For information about monitoring Butler SOS itself, see the [Monitoring Butler SOS](/docs/getting-started/operations/monitoring-butler-sos/) section.

## Next Steps

After setting up operations, you might want to:

- Learn about [upgrading Butler SOS](/docs/getting-started/upgrade/)
- Explore [configuration options](/docs/getting-started/setup/)
- Review [examples and dashboards](/docs/examples/)
