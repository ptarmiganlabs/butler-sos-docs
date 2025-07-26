---
title: "Security considerations"
linkTitle: "Security considerations"
weight: 100
description: >
  Security is important! Keep these things in mind when deploying Butler.
---

{{% pageinfo %}}
Security is a whole field in its own.  
What's considered secure in one company might be considered insecure in another.

It's a good idea to review your tools and services every now and then, for example making sure they are updated to include the latest security patches etc.  
When in doubt, be paranoid.
{{% /pageinfo %}}

## Security considerations

{{% alert title="Security/Disclosure" color="warning" %}}
If you discover a serious bug with Butler SOS that may pose a security problem, please disclose it confidentially to security@ptarmiganlabs.com first, so that it can be assessed and hopefully fixed prior to being exploited. Please do not raise GitHub issues for security-related doubts or problems.
{{% /alert %}}

- Make sure to configure the firewall on the server where Butler SOS is running to only accept connections from the desired clients/IP addresses.

  A reasonable first approach would be to configure the firewall to only allow calls from localhost. That way calls to/from Butler SOS can only be made from the server where Butler SOS itself is running.  
   If Butler SOS is not running on the Sense server, the IPs of the Sense servers should also be whitelisted in the firewall, of course.

- The MQTT connections are not secured by certificates or passwords.

  For use within a controlled network that might be fine, but nonetheless something to keep in mind. Adding certificate based authentication (which MQTT supports) would solve this.

- Butler SOS uses various Node.js modules from [npm](https://www.npmjs.com/). If concerned about security, you should review these dependencies and decide whether there are issues in them or not.

  Same thing with Butler SOS itself - while efforts have been made to make Butler SOS secure, you need to decide for yourself whether the level of security is enough for your use case.

  Butler SOS is continuously checked for security vulnerabilities by using GitHub security audit, [Snyk](https://snyk.io/), npm audit and other tools.

## Butler SOS system information gathering

Butler SOS can optionally gather detailed system information about the host it's running on. This is controlled by the `Butler-SOS.systemInfo.enable` configuration setting.

When enabled (which is the default), Butler SOS uses the `systeminformation` npm package to collect host information. This package executes various operating system commands to gather data such as:

- **System information:** `wmic` commands on Windows, `/proc` file reads on Linux
- **CPU details:** Hardware detection commands like `dmidecode`, `lscpu`
- **Memory information:** Memory layout and usage commands
- **Network interfaces:** Network configuration queries
- **Disk information:** Storage device enumeration and statistics

**Security implications:**
- These commands may be flagged by enterprise security monitoring tools as potentially suspicious activity
- In security-sensitive environments, you may want to disable system information gathering by setting `Butler-SOS.systemInfo.enable: false`
- Note that telemetry functionality requires system information to be enabled - Butler SOS will refuse to start if telemetry is enabled but systemInfo is disabled

**Recommendation:** Review your organization's security policies regarding automated system command execution before deploying Butler SOS in production environments.

## Butler SOS talking to Qlik Sense

Butler SOS uses https for all communication with Sense, using Sense's certificates for authentication.
