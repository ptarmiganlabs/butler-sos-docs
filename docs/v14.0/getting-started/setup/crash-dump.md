---
outline: deep
---

# Crash Dump

Butler SOS can create crash dump files when it encounters unrecoverable errors. These files capture diagnostic information at the exact moment of a crash, making it easier to diagnose what went wrong.

Sensitive config fields (passwords, tokens, IPs) are never written to crash dump files, and common secret patterns in error messages are redacted automatically.

::: warning Important — always review before sharing
While Butler SOS makes every effort to exclude sensitive data from crash dumps, **automated redaction cannot catch all possible formats**. Error messages from third-party libraries or unexpected secret formats may contain sensitive information that is not caught by automated redaction.

Before sharing any crash dump file with anyone outside your organization — including Butler SOS support — the Qlik Sense admin **must** review its contents to confirm no environment-specific or sensitive information is present. Restrict access to the crash dump directory to trusted users only.
:::

## When crash dumps are created

| Source | Description |
|---|---|
| `uncaughtException` | A synchronous exception was not caught by any `try/catch` handler |
| `unhandledRejection` | A rejected Promise had no `.catch()` handler |
| `logFatal` | Butler SOS deliberately triggered a fatal error before exiting |

## Configuration Reference

The `crashFile` section is a mandatory top-level key under `Butler-SOS`.

```yaml
Butler-SOS:
  logDirectory: ./logs

  crashFile:
    enable: true                      # Default: true
    crashFileDirectory: ./crash_dumps # Default: ./crash_dumps
    crashFileCreateJson: true         # Default: true
    crashFileCreateText: true         # Default: true
```

| Setting | Default | Description |
|---|---|---|
| `enable` | `true` | Master switch. Set to `false` to disable crash dump creation entirely. |
| `crashFileDirectory` | `./crash_dumps` | Directory where crash files are written. Relative paths are resolved from Butler SOS's working directory; absolute paths are supported. An empty string uses the working directory. |
| `crashFileCreateJson` | `true` | When `true`, creates a machine-readable JSON crash dump file. |
| `crashFileCreateText` | `true` | When `true`, creates a human-readable plain-text crash dump file. |

### Plain-text files only

```yaml
crashFile:
  enable: true
  crashFileDirectory: ./crash_dumps
  crashFileCreateJson: false
  crashFileCreateText: true
```

### Disabled

```yaml
crashFile:
  enable: false
  crashFileDirectory: ./crash_dumps
  crashFileCreateJson: true
  crashFileCreateText: true
```

## File formats

### Filename pattern

Both file types use the same naming convention, which includes a timestamp, the process ID, and a per-process incrementing counter to guarantee uniqueness even when multiple crashes occur within the same millisecond:

```
crash_dump_<YYYYMMDD>_<HHMMSS>_<mmm>_<PID>_<counter>.<ext>
```

- Timestamp is local time
- `mmm` is milliseconds (3 digits, zero-padded)
- `PID` is the operating system process ID
- `counter` is a per-process integer starting at 1
- Extension is `.json` or `.txt`

**Example:** `crash_dump_20260509_143045_123_12345_1.json`

Files are never overwritten — each crash produces uniquely named files. The exclusive-create flag (`flag: 'wx'`) prevents any silent overwrites if a filename were somehow reused.

### JSON format

```json
{
  "version": "1.0",
  "timestamp": "2026-05-09T14:30:45.123Z",
  "app": {
    "name": "butler-sos",
    "version": "14.0.0"
  },
  "runtime": {
    "nodeVersion": "22.10.0",
    "platform": "darwin/arm64",
    "isSea": true
  },
  "error": {
    "type": "Error",
    "message": "Connection refused",
    "stack": "at Function.foo (src/lib/foo.js:123)\n    at Module._compile (node:internal/modules/cjs-loader:456)"
  },
  "context": {
    "exitCode": 1,
    "source": "uncaughtException"
  },
  "config": {
    "logLevel": "info",
    "fileLogging": true,
    "logDirectory": "./logs",
    "anonTelemetry": false,
    "systemInfoEnable": true,
    "userEventsEnable": true,
    "influxdbEnable": true,
    "influxdbVersion": 2,
    "prometheusEnable": false,
    "mqttEnable": false,
    "auditEventsEnable": false
  }
}
```

#### JSON field descriptions

| Field | Description |
|---|---|
| `version` | Crash dump format version (currently `"1.0"`) |
| `timestamp` | ISO 8601 UTC timestamp of when the dump was created |
| `app.name` | Always `"butler-sos"` |
| `app.version` | Butler SOS version from `package.json` |
| `runtime.nodeVersion` | Node.js version |
| `runtime.platform` | `process.platform/process.arch` (e.g. `"linux/x64"`) |
| `runtime.isSea` | `true` when running as a packaged SEA binary |
| `error.type` | Error constructor name (e.g. `"Error"`, `"TypeError"`) |
| `error.message` | Error message |
| `error.stack` | Sanitized stack trace — absolute paths are stripped |
| `context.exitCode` | Always `1` |
| `context.source` | `"uncaughtException"`, `"unhandledRejection"`, or `"logFatal"` |
| `config` | Non-sensitive configuration snapshot (log level, feature enable flags, InfluxDB version) |

### Plain-text format

```
====================================
BUTLER SOS CRASH REPORT
====================================
Generated: 2026-05-09T14:30:45.123Z

=== APPLICATION INFO ===
Butler SOS Version: 14.0.0
Node.js Version: 22.10.0
Platform: darwin/arm64
Executable: SEA (packaged) | Node.js

=== CRASH INFO ===
Error Type: Error
Source: uncaughtException
Exit Code: 1

=== ERROR MESSAGE ===
Connection refused

=== STACK TRACE ===
at Function.foo (src/lib/foo.js:123)
    at Module._compile (node:internal/modules/cjs-loader:456)
...

====================================
END OF CRASH REPORT
====================================
```

## Sensitive data handling

Crash dumps are designed to be safe to share externally. Two layers of protection are applied:

### Config fields

Sensitive config fields are **never** written to crash dump files:

| Category | Examples |
|---|---|
| IP addresses / hostnames | Server hosts, client IPs, broker hosts |
| Credentials | Passwords, passphrases, client cert passphrases |
| API keys & tokens | New Relic keys, InfluxDB tokens |
| Account information | Account names, account IDs, organizations |
| Certificate paths & contents | `clientCert`, `clientCertKey`, `clientCertCA` |
| HTTP headers | Authorization headers |
| MQTT topics | Base topics |
| Usernames | Auth usernames |
| Storage bucket names | InfluxDB buckets |

Only non-sensitive config fields are captured in the `config` section of the JSON dump (log level, file logging, feature enable flags, InfluxDB version).

### Error content: best-effort redaction

Error messages and stack traces are included to aid debugging. Butler SOS applies **best-effort redaction** of common sensitive patterns found in error messages:

| Pattern | Example input | After redaction |
|---|---|---|
| URL with embedded credentials | `mqtt://admin:secret@broker.example.com` | `mqtt://[REDACTED]@broker.example.com` |
| Authorization header tokens | `Bearer eyJhbGci...` | `Bearer [REDACTED]` |
| Key-value secret pairs | `password=hunter2` | `password=[REDACTED]` |
| JSON-style secret fields | `"token": "abc123"` | `"token": "[REDACTED]"` |

::: warning Best-effort only — restrict access and review before sharing
Redaction is best-effort only. Error messages generated by third-party libraries or unexpected secret formats may not be caught by automated redaction. Treat crash dump files as potentially sensitive — restrict access to the `crashFileDirectory` accordingly, and always review the contents before sharing with anyone outside your organization.
:::

## Troubleshooting

### Where to find crash dumps

By default, crash dump files are created in `./crash_dumps/` relative to the directory from which Butler SOS was started. Use `Butler-SOS.crashFile.crashFileDirectory` to change this location.

### How to interpret the contents

1. Open the `.txt` file for a quick human-readable summary.
2. Open the `.json` file for machine-readable data that can be processed by support tooling.
3. The `error.message` and `error.stack` fields identify where the crash originated.
4. The `context.source` field tells you whether the crash was caused by an uncaught exception, unhandled rejection, or explicit fatal error.
5. The `config` section shows which major features were enabled at the time of the crash.

### Crash dumps are not being created

- Verify `Butler-SOS.crashFile.enable` is `true`.
- Verify `Butler-SOS.crashFile.crashFileCreateJson` or `Butler-SOS.crashFile.crashFileCreateText` (or both) are `true`.
- Check that Butler SOS has write permission to the `crashFileDirectory`.
- If `crashFileDirectory` is a relative path, it is resolved from the process working directory, which may differ from the installation directory.