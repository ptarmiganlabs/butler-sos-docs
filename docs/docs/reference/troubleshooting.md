# Troubleshooting

This page provides guidance for diagnosing and resolving common issues with Butler SOS.

## API Timeout Errors

### Symptoms

You may see error messages like these in your Butler SOS logs:

```
2025-12-17T08:36:18.824Z error: PROXY SESSIONS: Error when calling proxy session API for server 'sense1' (192.168.100.109:4243), virtual proxy '/': timeout of 5000ms exceeded
2025-12-17T08:36:18.833Z error: HEALTH: Error when calling health check API for server 'sense1' (192.168.100.109:4747): timeout of 5000ms exceeded
```

### Root Causes

These timeout errors can occur when:

1. **Network connectivity issues**
   - WiFi connections with intermittent connectivity
   - High network latency between Butler SOS and Qlik Sense servers
   - Network congestion or packet loss
   - Firewall or routing issues

2. **Qlik Sense server performance**
   - Server is under heavy load
   - Engine or proxy services are slow to respond
   - Certificate validation delays

3. **Hard-coded timeout limitations**
   - Butler SOS currently has a hard-coded 5-second timeout for API calls
   - This may be insufficient for slower networks or busy servers

### Analysis from Codebase Review

A review of the Butler SOS source code reveals:

**Current Implementation:**
- Health check API calls (`/engine/healthcheck`) have a 5000ms (5 second) timeout
- Proxy session API calls (`/qps/session`) have a 5000ms (5 second) timeout
- These timeout values are hard-coded and cannot be configured
- Error tracking and logging mechanisms are working correctly

**Code Locations:**
- `src/lib/healthmetrics.js` - Line 61: `timeout: 5000`
- `src/lib/proxysessionmetrics.js` - Line 281: `timeout: 5000`

**Sequential Processing:**
- Health metrics are collected sequentially (one server at a time) - this is appropriate
- User sessions are collected sequentially per server and virtual proxy - this is appropriate
- The sequential approach prevents overwhelming the Qlik Sense servers

### Workarounds

Until a configurable timeout option is added to Butler SOS, you can try these approaches:

#### 1. Improve Network Connectivity

**For WiFi connections:**
- Use a wired Ethernet connection instead of WiFi when possible
- Move closer to the WiFi access point or add WiFi repeaters
- Upgrade to a better quality WiFi router
- Use 5GHz WiFi band instead of 2.4GHz if available

**For all connections:**
- Reduce network hops between Butler SOS and Qlik Sense servers
- Check for and resolve any network congestion issues
- Verify firewall rules are not causing delays

#### 2. Optimize Qlik Sense Server Performance

- Monitor Qlik Sense server resource usage (CPU, memory, disk I/O)
- Reduce load on Qlik Sense servers during Butler SOS polling
- Consider increasing `pollingInterval` in Butler SOS configuration to reduce frequency of API calls

#### 3. Adjust Polling Intervals

In your Butler SOS configuration file, increase the polling intervals to reduce the frequency of API calls:

```yaml
Butler-SOS:
  # Increase from default (usually 30000ms) to reduce polling frequency
  serversToMonitor:
    pollingInterval: 60000  # 60 seconds instead of 30

  # Increase user session polling interval
  userSessions:
    pollingInterval: 120000  # 120 seconds instead of 60
```

This reduces the load on both the network and Qlik Sense servers, and decreases the chance of timeouts.

#### 4. Monitor Error Frequency

Butler SOS includes error tracking that logs error counts:

```
2025-12-17T08:36:18.824Z info: ERROR TRACKER: Error counts today (UTC): Total=1, Details={"PROXY_API":{"total":1,"servers":{"sense1":1}}}
```

- Monitor these error counts to understand the frequency and pattern of timeouts
- Occasional timeouts (1-2 per day) may be acceptable
- Frequent timeouts indicate a need to address the root cause

### Long-term Solutions

The following improvements should be requested from the Butler SOS project:

1. **Make timeout values configurable** - Allow users to set custom timeout values in the configuration file
2. **Add retry logic** - Implement automatic retry with exponential backoff for failed API calls
3. **Add connection pooling** - Reuse HTTPS connections to reduce overhead
4. **Add circuit breaker pattern** - Temporarily stop calling an API endpoint after repeated failures

### Reporting Issues

If you continue to experience timeout errors after trying these workarounds:

1. Gather diagnostic information:
   - Butler SOS log files showing the errors
   - Network configuration details
   - Qlik Sense server performance metrics at the time of errors

2. Check for existing issues at: [Butler SOS GitHub Issues](https://github.com/ptarmiganlabs/butler-sos/issues)

3. If no similar issue exists, create a new issue with:
   - Complete error messages from logs
   - Your network setup (wired vs WiFi, latency measurements)
   - Butler SOS configuration (redact sensitive information)
   - Frequency of errors (occasional vs constant)

## Other Common Issues

### Certificate Errors

If you see certificate-related errors, ensure:

- Client certificates are properly configured in the config file
- Certificate files exist at the specified paths
- Certificates have not expired
- Certificate passphrase (if any) is correct

### Connection Refused Errors

If Butler SOS cannot connect to Qlik Sense servers:

- Verify server hostnames and ports are correct
- Check firewall rules allow connections from Butler SOS
- Ensure Qlik Sense services are running
- Test connectivity with `telnet` or `nc` commands

### Data Not Appearing in InfluxDB/Prometheus/New Relic

If metrics are not being stored:

- Verify the destination is enabled in the config file
- Check destination connection details (URL, credentials, tokens)
- Review Butler SOS logs for errors related to the destination
- Test destination connectivity independently

## Getting Help

If you need additional assistance:

- **GitHub Discussions**: [Butler SOS Discussions](https://github.com/ptarmiganlabs/butler-sos/discussions) - Ask questions and get help from the community
- **GitHub Issues**: [Butler SOS Issues](https://github.com/ptarmiganlabs/butler-sos/issues) - Report bugs or request features
- **Documentation**: Review the [configuration reference](/docs/reference/config-file-format) for detailed setup guidance
