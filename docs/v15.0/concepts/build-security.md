# Build Security

Butler SOS takes a security-first approach throughout its development lifecycle. Every release goes through a multi-layered security process covering code analysis, dependency scanning, Docker image hardening, and supply chain protection. This page explains what that means for you as a Butler SOS admin.

## Automated Vulnerability Scanning

Butler SOS is continuously monitored for security issues using multiple scanning tools:

- **Trivy** scans Docker images on every release. Builds are blocked if critical or high vulnerabilities are found, ensuring that images on Docker Hub are safe to deploy.
- **Snyk** and **npm audit** continuously scan the codebase and dependencies for known vulnerabilities.
- **Dependabot** opens weekly pull requests to keep dependencies up to date, reducing exposure to newly discovered vulnerabilities.

This means Butler SOS binaries and Docker images are actively monitored against the latest known vulnerability databases.

## Static Code Analysis

**CodeQL** runs on every push and pull request to the codebase, analyzing code for security vulnerabilities and common coding errors. Results are tracked in the project's GitHub Security tab.

## Supply Chain Protection

The Butler SOS build pipeline uses several measures to protect its software supply chain:

- **Pinned action versions**: All GitHub Actions steps are locked to specific commit SHAs rather than mutable tags, preventing supply chain attacks on the CI system itself.
- **Software Bill of Materials (SBOM)**: Every release includes an SBOM listing all dependencies, making it easier to track what's included in any given version.

## Workflow Security

The GitHub Actions pipelines themselves are hardened:

- **Zizmor** scans pipeline definitions for security issues such as dangerous triggers, excessive permissions, and credential leakage.
- **GitHub secret scanning** prevents credentials from being accidentally committed to the repository.

These checks ensure that even the build infrastructure itself follows security best practices.

## Docker Image Security

When running Butler SOS in Docker, the container is hardened by design:

- **Multi-stage builds** keep the final image lean and free of build tools.
- **Non-root user**: Butler SOS runs as the `node` user, not root, limiting the impact of any potential container compromise.
- **Minimal base image**: Uses `node:24-bookworm-slim` to reduce the attack surface.
- **Healthcheck**: A REST endpoint lets Docker verify the container is healthy.

For reference deployments with recommended security configurations, see the [Docker Compose examples](/v15.0/examples/docker-compose-stack).

## VirusTotal Scanning

Release artifacts are scanned by **VirusTotal** before publication, checking for malware or other threats in downloadable binaries.

## Network Security

Butler SOS uses the **Fastify** web framework with security-focused plugins:

| Plugin | Purpose |
|--------|---------|
| `@fastify/rate-limit` | Rate limiting prevents API abuse and DoS attempts |
| `@fastify/cors` | Configurable CORS policy restricts which origins can call the API |
| `@fastify/sensible` | Applies secure HTTP header defaults |

## Code Signing

Butler SOS binaries are signed to ensure integrity and authenticity:

- **macOS**: Signed with an Apple Developer ID certificate and notarized with Apple's Notary Service. The OS can verify the binary has not been tampered with.
- **Windows**: Signed with SHA1 and SHA256 certificates from trusted certificate authorities.

## System Information Security

Butler SOS can gather detailed system information about the host it runs on. In security-sensitive environments where OS command execution is restricted, this can be disabled:

```yaml
Butler-SOS:
  systemInfo:
    enable: false
```

When disabled, Butler SOS will not execute any OS commands for gathering host information. Note that [telemetry](/v15.0/concepts/features/telemetry) requires system information to be enabled.