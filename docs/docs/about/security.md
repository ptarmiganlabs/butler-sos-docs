# Security

Butler SOS implements several security measures throughout its build and deployment lifecycle.

## Docker Security

When running Butler SOS in Docker, the container uses:

- **Non-root user**: Butler SOS runs as the `node` user (not root)
- **Minimal base image**: Uses `node:24-bookworm-slim` to reduce attack surface
- **Healthcheck**: A health check endpoint verifies the container is working correctly

## Network Security

Butler SOS uses the Fastify web framework with security-focused plugins:

| Plugin | Purpose |
|--------|---------|
| `@fastify/rate-limit` | Rate limiting for API endpoints to prevent abuse and DoS |
| `@fastify/cors` | Configurable CORS policy for allowed origins |
| `@fastify/sensible` | Security best practices including secure HTTP headers |

## System Information

Butler SOS can gather detailed system information about the host it is running on, including OS-level commands. In security-sensitive environments, this can be disabled:

```yaml
Butler-SOS:
  systemInfo:
    enable: false
```

When disabled, Butler SOS will not execute any OS commands for gathering host information. Note that [telemetry](/docs/about/telemetry) requires system information to be enabled.

## Code Signing

Butler SOS binaries are code-signed to ensure integrity and authenticity:

- **macOS**: Signed with an Apple Developer ID certificate and notarized with Apple's Notary Service
- **Windows**: Signed with SHA1 and SHA256 certificates using trusted certificate authorities

This makes it easier to install and run Butler SOS on those platforms, as the operating system can verify that the binary has not been tampered with.

## Supply Chain Security

Butler SOS uses several measures to protect its software supply chain:

- **Dependency scanning**: Dependencies are automatically scanned for known vulnerabilities
- **Software Bill of Materials (SBOM)**: Each Butler SOS release includes an SBOM listing all dependencies
- **License compliance**: Only permissive open source licenses (MIT, Apache-2.0, BSD) are allowed

## Docker Compose

For secure reference deployments, see the [Docker Compose examples](/docs/examples/docker-compose-stack) which include recommended security configurations.
