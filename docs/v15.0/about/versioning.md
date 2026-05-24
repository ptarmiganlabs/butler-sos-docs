# Versioning

In the spirit of not copying information to several places, the version history is kept as annotations of each release on the [GitHub release page](https://github.com/ptarmiganlabs/butler-sos/releases).

## Version Number Format

Version numbers include up to 3 levels, for example version 13.0.2:

**13** is the **major** version. It is increased when Butler SOS has added major new features, or in other ways changed in major ways.  
If following this principle, breaking changes should always result in a bumped major version.

**0** is the **minor** version. This indicates a smaller update, when one or a few minor features have been added.

**2** is the **patch** level. When individual bugs are fixed, these are released with an increased patch level.

:::info Note

- Major and minor updates usually include bug fixes too.
- If a version of 13.0 is mentioned, this implicitly means 13.0.0.

:::

## Semantic Versioning

Butler SOS follows [semantic versioning](https://semver.org/) principles, which means:

- **Major version** changes indicate breaking changes or significant new features
- **Minor version** changes indicate new features that are backwards compatible
- **Patch version** changes indicate bug fixes and minor improvements

Starting with Butler SOS 6.0, [Release Please](https://github.com/googleapis/release-please) is used to automate version management and create release notes, ensuring consistent versioning across releases.
