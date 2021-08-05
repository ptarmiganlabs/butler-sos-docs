---
title: Contribution guidelines
linkTitle: Contribution guidelines
weight: 60
description: >
    How to contribute to Butler SOS.
aliases: ['/docs/contribution-guidelines']
---

{{% pageinfo %}}
Butler SOS is an open source project, using the [MIT license](https://choosealicense.com/licenses/mit/).

This means that all source code, documentation etc is available as-is, at no cost.

**It however also means that anyone interested can - and is encouraged to - contribute to the project!**

{{% /pageinfo %}}

Butler SOS is developed in [Node.js](https://nodejs.org), with support from various [NPM](https://www.npmjs.com/) modules.  

We use [Hugo](https://gohugo.io/) to format and generate this documentation site, the [Docsy](https://github.com/google/docsy) theme for styling and site structure.  
Hugo is an open-source static site generator that provides us with templates, content organisation in a standard directory structure, and a website generation engine. You write the pages in Markdown (or HTML if you want), and Hugo wraps them up into a website.

All submissions, including submissions by project members, require review. We use GitHub pull requests for this purpose. Consult [GitHub Help](https://help.github.com/articles/about-pull-requests/) for more information on using pull requests.

## Creating an issue

If you've found a problem - or have a feature suggestion - with Butler SOS itself or the documentation, but you're not sure how to fix it yourself, please create an issue in the [Butler SOS repo](https://github.com/ptarmiganlabs/butler-sos/issues/). You can also create an issue about a specific doc page by clicking the **Create Issue** button in the top right hand corner of the page.

{{% alert title="Security/Disclosure" color="warning" %}}
If you discover a serious bug with Butler that may pose a security problem, please disclose it confidentially to security@ptarmiganlabs.com first, so that it can be assessed and hopefully fixed prior to being exploited. Please do not raise GitHub issues for security-related doubts or problems.
{{% /alert %}}

## Development concepts

Some of the main tools/processes used during development of Butler SOS are:

### Visual Studio Code (=VSC)

Any IDE supporting Node.js can be used, but VSC works really well. Open Source and a huge ecosystem of extensions.

### GitHub

Used to store source code, track issues, change requests etc. 

GitHub Actions used to build Docker images.

### Release Please

[Release Please](https://github.com/googleapis/release-please) is used to create release notes.  
It also enforces consistent versioning when new (sometimes breaking) features are added, bugs fixed etc.

This menas thatas of Butler SOS 6.0 you can have more trust in the [semantic versioning](https://semver.org) of Butler SOS releases.

### ESLint + Prettier

Used to enforce a uniform source code format that also follow best practices defined in ESLint.

ESLint shows code issues within Visual Studio Code, but standalone reports can also be created:

```bash
➜ npx eslint . --format table

/Users/goran/code/butler-sos/src/butler-sos.js

║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║
╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢
║ 31       │ 18       │ error    │ Unexpected require().                                  │ global-require       ║

/Users/goran/code/butler-sos/src/lib/appnamesextract.js

║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║
╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢
║ 29       │ 37       │ error    │ A constructor name should not start with a             │ new-cap              ║
║          │          │          │ lowercase letter.                                      │                      ║

/Users/goran/code/butler-sos/src/lib/heartbeat.js

║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║
╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢
║ 3        │ 1        │ error    │ Unexpected var, use let or const instead.              │ no-var               ║
║ 6        │ 1        │ error    │ Unexpected var, use let or const instead.              │ no-var               ║
║ 6        │ 21       │ warning  │ Unexpected unnamed function.                           │ func-names           ║
║ 9        │ 15       │ error    │ Unexpected function expression.                        │ prefer-arrow-        ║
║          │          │          │                                                        │ callback             ║
║ 9        │ 15       │ warning  │ Unexpected unnamed function.                           │ func-names           ║
║ 9        │ 25       │ error    │ 'response' is defined but never used.                  │ no-unused-vars       ║
║ 13       │ 16       │ error    │ Unexpected function expression.                        │ prefer-arrow-        ║
║          │          │          │                                                        │ callback             ║
║ 13       │ 16       │ warning  │ Unexpected unnamed function.                           │ func-names           ║
║ 27       │ 9        │ error    │ All 'var' declarations must be at the top of the       │ vars-on-top          ║
║          │          │          │ function scope.                                        │                      ║
║ 27       │ 9        │ error    │ Unexpected var, use let or const instead.              │ no-var               ║
║ 28       │ 9        │ error    │ All 'var' declarations must be at the top of the       │ vars-on-top          ║
║          │          │          │ function scope.                                        │                      ║
║ 28       │ 9        │ error    │ Unexpected var, use let or const instead.              │ no-var               ║
║ 28       │ 13       │ error    │ 't' is assigned a value but never used.                │ no-unused-vars       ║
║ 28       │ 35       │ error    │ Unexpected function expression.                        │ prefer-arrow-        ║
║          │          │          │                                                        │ callback             ║
║ 28       │ 35       │ warning  │ Unexpected unnamed function.                           │ func-names           ║

╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ 13 Errors                                                                                                      ║
╟────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢
║ 4 Warnings                                                                                                     ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

➜ 
```

To format all source code files:

```bash
➜  npm run format:prettier

> butler-sos@5.6.0 format:prettier
> npx prettier --config .prettierrc.yaml "./**/*.{ts,css,less,js}" --write

butler-sos.js 97ms
docker-healthcheck.js 13ms
globals.js 90ms
lib/appnamesextract.js 35ms
lib/healthmetrics.js 27ms
lib/heartbeat.js 8ms
lib/logdb.js 34ms
lib/post-to-influxdb.js 85ms
lib/post-to-mqtt.js 27ms
lib/prom-client.js 45ms
lib/servertags.js 5ms
lib/service_uptime.js 14ms
lib/sessionmetrics.js 29ms
lib/telemetry.js 18ms
lib/udp_handlers.js 18ms
➜ 
```
