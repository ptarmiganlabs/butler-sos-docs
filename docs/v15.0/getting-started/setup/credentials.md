---
outline: deep
---

# Credentials to Third Party Services

Butler SOS can interact with certain third party services, such as New Relic. These services typically require some kind of authentication with associated credentials (username, password etc).

::: info Optional
These settings are optional.

If you do not use any third party services with Butler SOS you can leave the default values in this section.
:::

## What's This?

Butler SOS can interact with certain third party services, such as New Relic.

These services typically require some kind of authentication with associated credentials (username, password etc). Those credentials are stored in the `Butler-SOS.thirdPartyToolsCredentials` section of the config file.

## New Relic

Zero, one or more New Relic accounts with their respective credentials can be specified.

These accounts can then be used by Butler SOS' various features.

Note that different Butler SOS features can send their data to different New Relic accounts. This is specified in each feature's section in the YAML config file.

Example:

- Sense user events are sent to `First NR account`
- Sense log events are sent to `Second NR account`
- Sense RAM usage is sent to both `First NR account` and `Second NR account`

Note that the `accountName` setting is only used within Butler SOS to reference the different New Relic accounts. Specifically, it is _not_ used by or within New Relic itself.

## Settings in Main Config File

```yaml
Butler-SOS:
  ...
  ...
  # Credentials for third party systems that Butler SOS integrate with.
  # These can also be specified via command line parameters when starting Butler SOS.
  # Command line options takes precedence over settings in this config file.
  thirdPartyToolsCredentials:
    newRelic:         # Array of New Relic accounts/insert keys.
      - accountName: First NR account
        insertApiKey: <API key 1 (with insert permissions) from New Relic>
        accountId: <New Relic account ID 1>
      - accountName: Second NR account
        insertApiKey: <API key 2 (with insert permissions) from New Relic>
        accountId: <New Relic account ID 2>
  ...
  ...
```
