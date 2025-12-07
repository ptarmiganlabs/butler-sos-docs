# Security Considerations

Security is important! Keep these things in mind when deploying Butler SOS.

::: info
Security is a whole field in its own.  
What's considered secure in one company might be considered insecure in another.

It's a good idea to review your tools and services every now and then, for example making sure they are updated to include the latest security patches etc.  
When in doubt, be paranoid.
:::

## Security considerations

::: warning Security/Disclosure
If you discover a serious bug with Butler SOS that may pose a security problem, please disclose it confidentially to security@ptarmiganlabs.com first, so that it can be assessed and hopefully fixed prior to being exploited. Please do not raise GitHub issues for security-related doubts or problems.
:::

- Make sure to configure the firewall on the server where Butler SOS is running to only accept connections from the desired clients/IP addresses.

  A reasonable first approach would be to configure the firewall to only allow calls from localhost. That way calls to Butler SOS can only be made from the server where Butler SOS itself is running.  
   If Butler SOS is not running on the Sense server, the IPs of the Sense servers should also be whitelisted in the firewall, of course.

- Butler SOS uses various Node.js modules from [npm](https://www.npmjs.com/). If concerned about security, you should review these dependencies and decide whether there are issues in them or not.

  Same thing with Butler SOS itself - while efforts have been made to make Butler SOS secure, you need to decide for yourself whether the level of security is enough for your use case.

  Butler SOS is continuously checked for security vulnerabilities by using GitHub security audit, [Snyk](https://snyk.io/), npm audit and other tools.

## Butler SOS talking to Qlik Sense

Butler SOS uses https for all communication with Sense, using Sense's certificates for authentication.

## Signed binaries

The macOS executable binary is signed and notarized by Apple's standard process.  
A warning may still be shown first time the app is started. This is expected and normal.

The Windows executable binary is signed by "Open Source Developer, Göran Sander".
