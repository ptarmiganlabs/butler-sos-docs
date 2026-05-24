---
outline: deep
---

# Crash Dump

When Butler SOS encounters an unrecoverable error, it can create crash dump files that capture exactly what went wrong, at the moment it happened. These dumps are designed to be safe to share with the Butler SOS support team — but the Sense admin should always review them first.

## What it is

Crash dumps are plain-text or JSON files created when Butler SOS experiences a fatal error it cannot recover from. Three kinds of events trigger a crash dump:

| Event | Description |
|---|---|
| `uncaughtException` | A synchronous exception was not caught by any `try/catch` handler |
| `unhandledRejection` | A Promise was rejected without a `.catch()` handler |
| `logFatal` | Butler SOS deliberately triggered a fatal error before exiting |

## Why it exists

Crash dumps serve two purposes:

**Debugging** — When Butler SOS crashes, log files may already have been rotated, or the app may not be able to write further log entries. A crash dump preserves the stack trace and runtime context at the exact moment of failure, giving the support team the information they need to diagnose the issue.

**Monitoring** — External monitoring tools can watch the crash dump directory. When a new file appears, an alert can be triggered — even if Butler SOS itself has stopped.

## When to use it

- When Butler SOS has crashed unexpectedly and the cause is not clear from log files
- When sharing diagnostic information with the Butler SOS support team
- When setting up external file-system monitors to alert on service failures

## Safe to share — but review first

Crash dumps are designed to be safe to share externally. Butler SOS intentionally excludes sensitive data from every crash dump:

| Never included | Also never included |
|---|---|
| IP addresses and hostnames | Certificate paths and contents |
| Passwords and passphrases | HTTP authorization headers |
| API keys and tokens | MQTT topics |
| InfluxDB tokens | Account names and IDs |
| Usernames | Storage bucket names |

The only information captured in a crash dump is the error type, message and stack trace, Butler SOS version, Node.js version and platform, the exit code, and a **non-sensitive snapshot of which major features were enabled** (log level, InfluxDB, MQTT, Prometheus, etc.).

Error messages and stack traces are subject to **best-effort redaction** of common sensitive patterns (URLs with embedded credentials, Bearer tokens, key-value secret pairs, JSON-style secret fields). However, this redaction cannot catch all possible formats — error messages from third-party libraries or unexpected secret formats may contain sensitive information that automated redaction does not catch.

::: warning Review before sharing — and restrict directory access
Before sharing a crash dump with anyone outside your organization — including Butler SOS support — the Qlik Sense admin **must** review its contents to confirm no environment-specific or sensitive information is present. While Butler SOS makes every effort to exclude sensitive data, the admin is ultimately responsible for what is shared.

Additionally, access to the crash dump directory should be restricted to trusted users only. Treat crash dump files as potentially sensitive until they have been reviewed.
:::

## File formats

Each crash produces two files with the same timestamp-based name:

- A **plain-text** `.txt` file — human-readable, with clear section headers
- A **JSON** `.json` file — machine-readable, useful for support tooling

Files are never overwritten — every crash produces a uniquely named file.

Example filename: `crash_dump_20260509_143045_123_12345_1.json`

## Storage location

Crash dumps are stored in `./crash_dumps/` by default (relative to the directory from which Butler SOS was started). The location is configurable via `Butler-SOS.crashFile.crashFileDirectory`.

For configuration details, see [Crash Dump](/v15.0/getting-started/setup/crash-dump).